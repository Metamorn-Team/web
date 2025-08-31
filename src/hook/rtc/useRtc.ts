import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { socketManager } from "@/game/managers/socket-manager";
import { TypedSocket } from "@/types/socket-io";
import { useEffect, useRef, useState } from "react";

export const useRtc = () => {
  const [peerConnections, setPeerConnections] = useState<
    Map<string, RTCPeerConnection>
  >(new Map());

  const [peerMediaStreams, setPeerMediaStreams] = useState<
    Map<string, MediaStream>
  >(new Map());

  // 로컬 미디어 스트림
  const localMediaStreamRef = useRef<MediaStream>(new MediaStream());
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);

  const socketRef = useRef<TypedSocket | null>(null);

  const createPeerConnection = (peerId: string) => {
    // state에서 확인
    if (peerConnections.has(peerId)) {
      return peerConnections.get(peerId)!;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // addTrack으로 트랙 추가 시 재협성 이벤트 호출 -> offer 전송
    pc.onnegotiationneeded = async () => {
      try {
        console.log(`[${peerId}] onnegotiationneeded`);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.emit("webrtcOffer", { offer, targetUserId: peerId });
      } catch (err) {
        console.error("negotiationneeded error", err);
      }
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current?.emit("webrtcIceCandidateV2", {
          targetUserId: peerId,
          candidate: e.candidate,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("Connection state changed:", pc.connectionState);
    };

    pc.ontrack = (event) => {
      console.log(`[RTC][${peerId}] ontrack 이벤트 발생`, event);
      const { track } = event;

      setPeerMediaStreams((prev) => {
        const newMap = new Map(prev);
        let peerStream = newMap.get(peerId);
        if (!peerStream) {
          peerStream = new MediaStream();
          newMap.set(peerId, peerStream);
          console.log(`[RTC][${peerId}] 새로운 MediaStream 생성`);
        }

        // 기존 같은 종류 트랙 제거
        const existingTracks = peerStream
          .getTracks()
          .filter((t) => t.kind === track.kind);
        existingTracks.forEach((existingTrack) =>
          peerStream!.removeTrack(existingTrack)
        );

        // 새 트랙 추가
        peerStream.addTrack(track);
        console.log(
          `[RTC][${peerId}] ${track.kind} 트랙 추가 → 총 트랙 수: ${
            peerStream.getTracks().length
          }`
        );

        return newMap;
      });
    };

    // ===== state 업데이트 =====
    setPeerConnections((prev) => {
      const newMap = new Map(prev);
      newMap.set(peerId, pc);
      return newMap;
    });

    return pc;
  };

  const toggleMic = async () => {
    try {
      if (!isMicOn) {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        localMediaStreamRef.current.getAudioTracks().forEach((track) => {
          track.stop();
          localMediaStreamRef.current.removeTrack(track);
        });

        audioStream.getAudioTracks().forEach((track) => {
          localMediaStreamRef.current.addTrack(track);
        });

        // state의 peerConnections 사용
        peerConnections.forEach((pc) => {
          audioStream.getAudioTracks().forEach((track) => {
            pc.addTrack(track, localMediaStreamRef.current);
          });
        });

        setIsMicOn(true);
      } else {
        localMediaStreamRef.current.getAudioTracks().forEach((track) => {
          track.stop();
          localMediaStreamRef.current.removeTrack(track);
        });

        peerConnections.forEach((pc) => {
          pc.getSenders().forEach((sender) => {
            if (sender.track?.kind === "audio") pc.removeTrack(sender);
          });
        });

        setIsMicOn(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCam = async () => {
    try {
      if (!isCamOn) {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });

        localMediaStreamRef.current.getVideoTracks().forEach((track) => {
          track.stop();
          localMediaStreamRef.current.removeTrack(track);
        });

        videoStream.getVideoTracks().forEach((track) => {
          localMediaStreamRef.current.addTrack(track);
        });

        peerConnections.forEach((pc) => {
          videoStream.getVideoTracks().forEach((track) => {
            pc.addTrack(track, localMediaStreamRef.current);
          });
        });

        setIsCamOn(true);
      } else {
        localMediaStreamRef.current.getVideoTracks().forEach((track) => {
          track.stop();
          localMediaStreamRef.current.removeTrack(track);
        });

        peerConnections.forEach((pc) => {
          pc.getSenders().forEach((sender) => {
            if (sender.track?.kind === "video") pc.removeTrack(sender);
          });
        });

        setIsCamOn(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addLocalTracksToNewPeer = (pc: RTCPeerConnection) => {
    localMediaStreamRef.current
      .getTracks()
      .forEach((track) => pc.addTrack(track, localMediaStreamRef.current));
  };

  useEffect(() => {
    const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);
    if (!socket) return;
    socketRef.current = socket;

    socket.on("peerJoined", async ({ userId: peerId }) => {
      const pc = createPeerConnection(peerId);
      addLocalTracksToNewPeer(pc);

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(offer);
      socket.emit("webrtcOffer", { offer, targetUserId: peerId });
    });

    socket.on("offer", async ({ from: peerId, sdp }) => {
      const pc = createPeerConnection(peerId);
      addLocalTracksToNewPeer(pc);

      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(answer);
      socket.emit("webrtcAnswer", { answer, targetUserId: peerId });
    });

    socket.on("answer", async ({ from: peerId, sdp }) => {
      const pc = peerConnections.get(peerId);
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on("iceCandidate", async ({ from: peerId, candidate }) => {
      const pc = peerConnections.get(peerId);
      if (!pc) return;
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      localMediaStreamRef.current.getTracks().forEach((track) => track.stop());
      peerConnections.forEach((pc) => pc.close());
      setPeerConnections(new Map());

      peerMediaStreams.forEach((stream) =>
        stream.getTracks().forEach((track) => track.stop())
      );
      setPeerMediaStreams(new Map());

      socket.off("peerJoined");
      socket.off("offer");
      socket.off("answer");
      socket.off("iceCandidate");
    };
  }, []); // dependency 추가

  return {
    peerConnections, // 이제 state로 반환
    peerMediaStreams,
    localMediaStream: localMediaStreamRef.current,
    isMicOn,
    isCamOn,
    toggleMic,
    toggleCam,
    isConnected: !!socketRef.current,
  };
};
