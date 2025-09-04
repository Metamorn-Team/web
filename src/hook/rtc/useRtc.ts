import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { socketManager } from "@/game/managers/socket-manager";
import { useModal } from "@/hook/useModal";
import { TypedSocket } from "@/types/socket-io";
import { useEffect, useRef, useState, useCallback } from "react";

export const useRtc = () => {
  const [peerConnections, setPeerConnections] = useState<
    Map<string, RTCPeerConnection>
  >(new Map());

  const [peerMediaStreams, setPeerMediaStreams] = useState<
    Map<string, MediaStream>
  >(new Map());

  // ref로 최신 상태 참조
  const peerConnectionsRef = useRef(peerConnections);
  const peerMediaStreamsRef = useRef(peerMediaStreams);

  // ICE 후보 큐잉을 위한 ref
  const pendingCandidatesRef = useRef<Map<string, RTCIceCandidateInit[]>>(
    new Map()
  );

  // 강제 리렌더링을 위한 state
  const [streamVersion, setStreamVersion] = useState(0);

  // 로컬 미디어 스트림
  const localMediaStreamRef = useRef<MediaStream>(new MediaStream());
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const {
    isModalOpen: isPermissionModalOpen,
    onOpen: onPermissionModalOpen,
    onClose: onPermissionModalClose,
  } = useModal();

  const socketRef = useRef<TypedSocket | null>(null);

  // ref 업데이트
  useEffect(() => {
    peerConnectionsRef.current = peerConnections;
  }, [peerConnections]);

  useEffect(() => {
    peerMediaStreamsRef.current = peerMediaStreams;
  }, [peerMediaStreams]);

  // ICE 후보 큐 플러시 함수
  const flushCandidateQueue = useCallback(async (peerId: string) => {
    const pc = peerConnectionsRef.current.get(peerId);
    if (!pc || !pc.remoteDescription) return;

    const queued = pendingCandidatesRef.current.get(peerId) || [];
    if (queued.length === 0) return;

    console.log(`[${peerId}] 큐에 있던 ICE 후보 ${queued.length}개 처리`);

    for (const candidate of queued) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log(`[${peerId}] ICE 후보 추가 성공`);
      } catch (err) {
        console.error(`[${peerId}] ICE 후보 추가 실패:`, err);
      }
    }

    pendingCandidatesRef.current.delete(peerId);
  }, []);

  const createPeerConnection = useCallback((peerId: string) => {
    // 이미 존재하는 경우 반환
    if (peerConnectionsRef.current.has(peerId)) {
      return peerConnectionsRef.current.get(peerId)!;
    }

    console.log(`[${peerId}] 새 PeerConnection 생성`);
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log(`[${peerId}] ICE 후보 전송`);
        socketRef.current?.emit("webrtcIceCandidateV2", {
          targetUserId: peerId,
          candidate: e.candidate,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`[${peerId}] Connection state:`, pc.connectionState);
    };

    pc.ontrack = (event) => {
      console.log(`[RTC][${peerId}] ontrack`, event);
      const remoteStreamFromEvent = event.streams && event.streams[0];

      setPeerMediaStreams((prev) => {
        const newMap = new Map(prev);

        // event.streams를 우선 사용, 없으면 기존 스트림이나 새 스트림 생성
        const remoteStream =
          remoteStreamFromEvent || prev.get(peerId) || new MediaStream();

        // 중복 추가 방지
        const exists = remoteStream
          .getTracks()
          .some((t) => t.id === event.track.id);
        if (!exists) {
          remoteStream.addTrack(event.track);
          console.log(`[RTC][${peerId}] 트랙 추가: ${event.track.kind}`);
        }

        // 트랙 종료 시 제거
        event.track.onended = () => {
          setPeerMediaStreams((prevStreams) => {
            const copy = new Map(prevStreams);
            const stream = copy.get(peerId);
            if (stream) {
              try {
                stream.removeTrack(event.track);
                if (stream.getTracks().length === 0) {
                  copy.delete(peerId);
                  console.log(`[RTC][${peerId}] 빈 스트림 제거`);
                } else {
                  copy.set(peerId, stream);
                }
              } catch (err) {
                console.error(`[RTC][${peerId}] 트랙 제거 실패:`, err);
              }
            }
            return copy;
          });
        };

        newMap.set(peerId, remoteStream);
        console.log(
          `[RTC][${peerId}] 스트림 업데이트, 총 트랙:`,
          remoteStream.getTracks().length
        );

        return newMap;
      });

      // 강제 리렌더링 트리거
      setStreamVersion((v) => v + 1);
    };

    // 상태 업데이트
    setPeerConnections((prev) => {
      const newMap = new Map(prev);
      newMap.set(peerId, pc);
      return newMap;
    });

    // 큐에 있던 ICE 후보들 처리 (pc 생성 직후)
    const pending = pendingCandidatesRef.current.get(peerId);
    if (pending && pending.length > 0) {
      console.log(
        `[${peerId}] PeerConnection 생성 후 큐잉된 ICE 후보 ${pending.length}개 처리`
      );
      // 약간의 지연 후 처리 (안정성을 위해)
      setTimeout(() => {
        pending.forEach(async (candidate) => {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
            console.log(`[${peerId}] 큐잉된 ICE 후보 추가 성공`);
          } catch (err) {
            console.error(`[${peerId}] 큐잉된 ICE 후보 추가 실패:`, err);
          }
        });
        pendingCandidatesRef.current.delete(peerId);
      }, 100);
    }

    return pc;
  }, []);

  const handleNegotiation = useCallback(
    async (pc: RTCPeerConnection, peerId: string) => {
      try {
        console.log(`[${peerId}] 재협상 시작`);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.emit("webrtcOffer", { offer, targetUserId: peerId });
      } catch (err) {
        console.error(`[${peerId}] 재협상 실패:`, err);
      }
    },
    []
  );

  const toggleMic = useCallback(async () => {
    try {
      if (!isMicOn) {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // 기존 오디오 트랙 제거
        localMediaStreamRef.current.getAudioTracks().forEach((track) => {
          track.stop();
          localMediaStreamRef.current.removeTrack(track);
        });

        // 새 오디오 트랙 추가
        audioStream.getAudioTracks().forEach((track) => {
          localMediaStreamRef.current.addTrack(track);
        });

        // 모든 peer connection에 트랙 추가
        peerConnectionsRef.current.forEach((pc) => {
          audioStream.getAudioTracks().forEach((track) => {
            pc.addTrack(track, localMediaStreamRef.current);
          });
        });

        setIsMicOn(true);
      } else {
        // 마이크 끄기
        localMediaStreamRef.current.getAudioTracks().forEach((track) => {
          track.stop();
          localMediaStreamRef.current.removeTrack(track);
        });

        // peer connection에서 오디오 sender 제거
        peerConnectionsRef.current.forEach((pc) => {
          pc.getSenders().forEach((sender) => {
            if (sender.track?.kind === "audio") {
              pc.removeTrack(sender);
            }
          });
        });

        setIsMicOn(false);
      }

      // 재협상
      peerConnectionsRef.current.forEach((pc, peerId) => {
        handleNegotiation(pc, peerId);
      });
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "NotAllowedError") {
        console.error("권한 X");
        onPermissionModalOpen();
      }
    }
  }, [isMicOn, handleNegotiation]);

  const toggleCam = useCallback(async () => {
    try {
      if (!isCamOn) {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        // 기존 비디오 트랙 제거
        localMediaStreamRef.current.getVideoTracks().forEach((track) => {
          track.stop();
          localMediaStreamRef.current.removeTrack(track);
        });

        // 새 비디오 트랙 추가
        videoStream.getVideoTracks().forEach((track) => {
          localMediaStreamRef.current.addTrack(track);
        });

        // 모든 peer connection에 트랙 추가
        peerConnectionsRef.current.forEach((pc) => {
          videoStream.getVideoTracks().forEach((track) => {
            pc.addTrack(track, localMediaStreamRef.current);
          });
        });

        setIsCamOn(true);
      } else {
        // 카메라 끄기
        localMediaStreamRef.current.getVideoTracks().forEach((track) => {
          track.stop();
          localMediaStreamRef.current.removeTrack(track);
        });

        // peer connection에서 비디오 sender 제거
        peerConnectionsRef.current.forEach((pc) => {
          pc.getSenders().forEach((sender) => {
            if (sender.track?.kind === "video") {
              pc.removeTrack(sender);
            }
          });
        });

        setIsCamOn(false);
      }

      // 재협상
      peerConnectionsRef.current.forEach((pc, peerId) => {
        handleNegotiation(pc, peerId);
      });
    } catch (e) {
      if (e instanceof Error && e.name === "NotAllowedError") {
        console.error("권한 X");
        onPermissionModalOpen();
      }
    }
  }, [isCamOn, handleNegotiation]);

  useEffect(() => {
    const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);
    if (!socket) return;
    socketRef.current = socket;

    socket.on("peerJoined", async ({ userId: peerId }) => {
      console.log(`[${peerId}] 피어 참여`);
      const pc = createPeerConnection(peerId);
      // addLocalTracksToNewPeer(pc);

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(offer);
      socket.emit("webrtcOffer", { offer, targetUserId: peerId });
    });

    socket.on("offer", async ({ from: peerId, sdp }) => {
      console.log(`[${peerId}] Offer 수신`);
      const pc = createPeerConnection(peerId);

      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      // remote description 설정 후 큐 플러시
      await flushCandidateQueue(peerId);

      const answer = await pc.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(answer);
      socket.emit("webrtcAnswer", { answer, targetUserId: peerId });
    });

    socket.on("answer", async ({ from: peerId, sdp }) => {
      console.log(`[${peerId}] Answer 수신`);
      const pc = peerConnectionsRef.current.get(peerId);
      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      // remote description 설정 후 큐 플러시
      await flushCandidateQueue(peerId);
    });

    socket.on("iceCandidate", async ({ from: peerId, candidate }) => {
      console.log(`[${peerId}] ICE 후보 수신`);
      const pc = peerConnectionsRef.current.get(peerId);

      if (pc && pc.remoteDescription) {
        // 즉시 추가 가능
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
          console.log(`[${peerId}] ICE 후보 즉시 추가 성공`);
        } catch (err) {
          console.error(`[${peerId}] ICE 후보 즉시 추가 실패:`, err);
        }
      } else {
        // 큐에 저장
        console.log(
          `[${peerId}] ICE 후보 큐잉 (pc=${!!pc}, remoteDesc=${!!pc?.remoteDescription})`
        );
        if (!pendingCandidatesRef.current.has(peerId)) {
          pendingCandidatesRef.current.set(peerId, []);
        }
        pendingCandidatesRef.current.get(peerId)!.push(candidate);
      }
    });

    return () => {
      console.log("RTC 정리 시작");
      localMediaStreamRef.current.getTracks().forEach((track) => track.stop());

      peerConnectionsRef.current.forEach((pc, peerId) => {
        console.log(`[${peerId}] PeerConnection 정리`);
        pc.close();
      });
      setPeerConnections(new Map());

      peerMediaStreamsRef.current.forEach((stream, peerId) => {
        console.log(`[${peerId}] MediaStream 정리`);
        stream.getTracks().forEach((track) => track.stop());
      });
      setPeerMediaStreams(new Map());

      // 큐 정리
      pendingCandidatesRef.current.clear();

      socket.off("peerJoined");
      socket.off("offer");
      socket.off("answer");
      socket.off("iceCandidate");
    };
  }, [createPeerConnection, flushCandidateQueue]);

  return {
    peerConnections,
    peerMediaStreams,
    localMediaStream: localMediaStreamRef.current,
    isMicOn,
    isCamOn,
    toggleMic,
    toggleCam,
    isConnected: !!socketRef.current,
    streamVersion,
    isPermissionModalOpen,
    onPermissionModalOpen,
    onPermissionModalClose,
  };
};
