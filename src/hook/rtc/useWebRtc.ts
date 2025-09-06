import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { socketManager } from "@/game/managers/socket-manager";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { ClientToServer, ServerToClient } from "mmorntype";

interface UseRtcProps {
  islandId?: string;
  myVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
}

export const useRtc = ({
  islandId,
  myVideoRef,
  remoteVideoRef,
}: UseRtcProps) => {
  const socketRef = useRef<Socket<ServerToClient, ClientToServer>>(undefined);
  const pcRef = useRef<RTCPeerConnection>(null);

  // PeerConnection 초기화 함수 추가
  const initializePeerConnection = () => {
    pcRef.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    // ICE candidate 처리
    pcRef.current.onicecandidate = (event) => {
      if (event.candidate && islandId) {
        socketRef.current?.emit("webrtcIceCandidate", {
          islandId: islandId,
          candidate: event.candidate,
        });
      }
    };

    // Remote stream 처리
    pcRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  };

  const getMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        if (pcRef.current) pcRef.current.addTrack(track, stream);
      });
    } catch (e) {
      console.error("getMedia 에러:", e);
    }
  };

  // createOffer도 비슷하게 수정
  const createOffer = async (data: { peerId: string }) => {
    console.log("오퍼 생성 시작");
    if (!pcRef.current) return;

    try {
      // 연결 상태 확인
      if (pcRef.current.signalingState === "closed") {
        console.error("PeerConnection이 이미 닫혀있습니다.");
        return;
      }

      // Local description이 이미 설정되어 있는지 확인
      if (pcRef.current.localDescription) {
        console.log("Local description이 이미 설정되어 있습니다.");
        return;
      }

      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      console.log("Offer 설정 완료");

      socketRef.current?.emit("webrtcOffer", {
        targetClientId: data.peerId,
        offer,
      });
    } catch (e) {
      console.error("createOffer 에러:", e);
    }
  };

  const createAnswer = async (data: {
    from: string;
    sdp: RTCSessionDescriptionInit;
  }) => {
    console.log("앤서 생성 시작");
    if (!pcRef.current) return;

    try {
      // 1. 연결 상태 확인
      if (pcRef.current.signalingState === "closed") {
        console.error("PeerConnection이 이미 닫혀있습니다.");
        return;
      }

      // 2. Remote description이 이미 설정되어 있는지 확인
      if (pcRef.current.remoteDescription) {
        console.log("Remote description이 이미 설정되어 있습니다.");
        return;
      }

      // 3. Remote description 설정
      await pcRef.current.setRemoteDescription(data.sdp);
      console.log("Remote description 설정 완료");

      // 4. Answer 생성 (상태 재확인)
      if (pcRef.current.signalingState !== "have-remote-offer") {
        console.error("잘못된 signaling state:", pcRef.current.signalingState);
        return;
      }

      const answer = await pcRef.current.createAnswer();
      console.log("Answer SDP 생성 완료");

      // 5. Local description 설정 (상태 재확인)
      await pcRef.current.setLocalDescription(answer);
      console.log("Local description 설정 완료");

      // 6. Answer 전송
      socketRef.current?.emit("webrtcAnswer", {
        targetClientId: data.from,
        answer,
      });
      console.log("Answer 전송 완료");
    } catch (e) {
      console.error("createAnswer 에러:", e);

      // 에러 발생 시 연결 재설정을 위한 정리
      if (pcRef.current && pcRef.current.signalingState !== "closed") {
        pcRef.current.close();
        // 필요시 새로운 PeerConnection 생성
        initializePeerConnection();
      }
    }
  };

  const handleAnswer = async (data: {
    from: string;
    sdp: RTCSessionDescriptionInit;
  }) => {
    console.log("앤서 받음");
    console.log(pcRef.current);
    if (pcRef.current) {
      const remoteDesc = new RTCSessionDescription(data.sdp);
      pcRef.current.setRemoteDescription(remoteDesc);
      console.log("PeerConnection 상태:", pcRef.current);
    }
  };

  const handleIceCandidate = (data: {
    from: string;
    candidate: RTCIceCandidateInit;
  }) => {
    if (!pcRef.current) return;
    pcRef.current.addIceCandidate(data.candidate);
    console.log("캔디완");
  };

  useEffect(() => {
    getMedia();
    initializePeerConnection();
    socketRef.current = socketManager.connect(SOCKET_NAMESPACES.ISLAND);

    socketRef.current?.on("peerJoined", createOffer);
    socketRef.current?.on("offer", createAnswer);
    socketRef.current?.on("answer", handleAnswer);
    socketRef.current?.on("iceCandidate", handleIceCandidate);

    return () => {
      socketRef.current?.off("peerJoined", createOffer);
      socketRef.current?.off("offer", createAnswer);
      socketRef.current?.off("answer", handleAnswer);
      socketRef.current?.off("iceCandidate", handleIceCandidate);
    };
  }, []);
};
