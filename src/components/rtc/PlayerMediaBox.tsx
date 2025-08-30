// "use client";

// import Image from "next/image";
// import React, { useEffect, useLayoutEffect, useState } from "react";

// interface PlayerMediaBoxProps {
//   playerId: string;
//   playerName: string;
//   avatarUrl?: string;
//   isSpeaking?: boolean;
//   isLocalPlayer?: boolean;
//   isScreenShareBox?: boolean; // 화면 공유 전용 박스인지 구분
//   videoRef: React.RefObject<HTMLVideoElement | null>;
// }

// export default function PlayerMediaBox({
//   playerId,
//   playerName,
//   avatarUrl = "/images/avatar/blue_pawn.png",
//   isSpeaking = false,
//   isLocalPlayer = false,
//   isScreenShareBox = false, // 기본값은 false
//   videoRef,
// }: PlayerMediaBoxProps) {
//   // const { localStream, screenStream, remoteStreams } = useRtc();
//   const [showWave, setShowWave] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   // 말하기 웨이브 효과
//   useEffect(() => {
//     console.log("isSpeaking", isSpeaking);
//     if (isSpeaking) {
//       setShowWave(true);
//       // 말하는 동안 웨이브 유지 (isSpeaking이 false가 될 때까지)
//     } else {
//       setShowWave(false);
//     }
//   }, [isSpeaking]);

//   // 로컬 플레이어인지 확인하여 적절한 스트림 선택
//   const getDisplayStream = () => {};
//   // () => {
//   //   if (isLocalPlayer) {
//   //     // 화면 공유 전용 박스인 경우 화면 공유 스트림만 반환
//   //     if (isScreenShareBox && screenStream) return screenStream;

//   //     // 일반 박스: 카메라가 켜져 있으면 카메라, 아니면 화면 공유로 폴백
//   //     const isCameraEnabled =
//   //       !!localStream &&
//   //       localStream.getVideoTracks().length > 0 &&
//   //       localStream.getVideoTracks().some((track) => track.enabled);

//   //     if (isCameraEnabled && localStream) return localStream;
//   //     if (screenStream) return screenStream;
//   //   } else {
//   //     // 원격 플레이어의 경우 remoteStreams에서 해당 플레이어의 스트림 찾기
//   //     const remoteStream = remoteStreams.get(playerId);
//   //     if (remoteStream) return remoteStream;
//   //   }
//   //   return null;
//   // };

//   const displayStream = getDisplayStream();
//   // 현재 표시 중인 스트림 타입 판단 (화면 공유인지 여부)
//   // const isShowingScreenShare =
//   //   isLocalPlayer &&
//   //   !!displayStream &&
//   //   !!screenStream &&
//   //   displayStream === screenStream;
//   const isShowingScreenShare = false;

//   // 비디오 트랙 활성 여부
//   // const hasVideo =
//   //   displayStream &&
//   //   displayStream.getVideoTracks().length > 0 &&
//   //   displayStream.getVideoTracks().some((track) => track.enabled);
//   const hasVideo = true;

//   const handleClick = () => {
//     setIsFullscreen(!isFullscreen);
//   };

//   useLayoutEffect(() => {
//     if (videoRef.current && displayStream) {
//       videoRef.current.srcObject = displayStream;
//     }
//   }, [displayStream, isFullscreen]);

//   if (isFullscreen) {
//     return (
//       <div
//         className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
//         onClick={handleClick}
//       >
//         <div className="relative w-[90vw] h-[90vh] bg-[#fdf8ef] border-4 border-[#bfae96] rounded-2xl shadow-[8px_8px_0_#8c7a5c] overflow-hidden">
//           {hasVideo ? (
//             // 전체화면 비디오
//             <video
//               autoPlay
//               playsInline
//               muted={isLocalPlayer}
//               ref={videoRef}
//               className={`w-full h-full ${
//                 // 화면 공유는 비율 유지 + 좌우반전 없음
//                 isLocalPlayer ? "object-contain bg-black" : "object-contain"
//               } ${
//                 // 카메라일 때만 좌우반전 적용
//                 isShowingScreenShare ? "" : "transform scale-x-[-1]"
//               }`}
//             />
//           ) : (
//             // 전체화면 아바타
//             <div className="w-full h-full flex items-center justify-center">
//               <div className="w-48 h-48 bg-[#f5f1e6] border-4 border-[#bfae96] rounded-full flex items-center justify-center overflow-hidden">
//                 <Image
//                   src={avatarUrl}
//                   alt={playerName}
//                   className="w-40 h-40 object-cover"
//                 />
//               </div>
//             </div>
//           )}

//           {/* TODO 보이스*/}
//           {false && (
//             <audio
//               autoPlay
//               playsInline
//               ref={(el) => {
//                 if (el && displayStream) el.srcObject = displayStream;
//               }}
//             />
//           )}

//           {/* 전체화면 안내 */}
//           <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
//             {playerName} - 클릭하여 돌아가기
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* 풀스크린 오버레이 */}
//       {isFullscreen && (
//         <div
//           className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
//           onClick={handleClick}
//         />
//       )}

//       <div
//         className={`${
//           isFullscreen
//             ? "fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
//             : ""
//         }`}
//       >
//         <div
//           className={`relative ${
//             isFullscreen
//               ? "w-[90vw] h-[90vh] border-4 border-[#bfae96] rounded-2xl shadow-[8px_8px_0_#8c7a5c] pointer-events-auto cursor-pointer"
//               : "w-40 h-32 border-2 border-[#bfae96] rounded-lg shadow-[4px_4px_0_#8c7a5c] cursor-pointer hover:shadow-[6px_6px_0_#8c7a5c] transition-shadow duration-200 transform transition-transform"
//           } bg-[#fdf8ef] overflow-hidden ${
//             showWave && !isFullscreen
//               ? "border-pink-400 ring-4 ring-pink-300 ring-offset-2 ring-offset-[#fdf8ef] shadow-[6px_6px_0_#b97ea0] scale-105"
//               : ""
//           }`}
//           onClick={handleClick}
//         >
//           {/* 말하기 강조 효과 */}
//           {showWave && !isFullscreen && (
//             <>
//               <div className="absolute inset-0 rounded-lg border-2 border-pink-300 pointer-events-none animate-pulse opacity-80"></div>
//               <div className="absolute -top-1 -left-1 w-3 h-3 bg-pink-300 shadow-[2px_2px_0_#8c7a5c] animate-bounce"></div>
//               <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 shadow-[2px_2px_0_#8c7a5c] animate-bounce"></div>
//               <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-300 shadow-[2px_2px_0_#8c7a5c] animate-bounce"></div>
//               <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-300 shadow-[2px_2px_0_#8c7a5c] animate-bounce"></div>
//             </>
//           )}

//           {/* 미디어 콘텐츠 */}
//           <div className="relative w-full h-full">
//             {hasVideo ? (
//               <video
//                 autoPlay
//                 playsInline
//                 muted={isLocalPlayer}
//                 ref={videoRef}
//                 className={`w-full h-full ${
//                   isShowingScreenShare
//                     ? "object-contain bg-black"
//                     : isFullscreen
//                     ? "object-contain"
//                     : "object-cover"
//                 } ${isShowingScreenShare ? "" : "transform scale-x-[-1]"}`}
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center">
//                 <div
//                   className={`bg-[#f5f1e6] border-2 border-[#bfae96] rounded-full flex items-center justify-center overflow-hidden ${
//                     isFullscreen ? "w-48 h-48 border-4" : "w-14 h-14"
//                   }`}
//                 >
//                   <Image
//                     src={avatarUrl}
//                     alt={playerName}
//                     className={
//                       isFullscreen
//                         ? "w-40 h-40 object-cover"
//                         : "w-10 h-10 object-cover"
//                     }
//                   />
//                 </div>
//               </div>
//             )}

//             {/* 플레이어 이름 */}
//             <div
//               className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-1 px-2 truncate ${
//                 isFullscreen ? "text-base py-2" : "text-xs"
//               }`}
//             >
//               {playerName}
//               {isFullscreen && " - 클릭하여 돌아가기"}
//             </div>

//             {/* 상태 표시 아이콘 */}
//             <div
//               className={`absolute top-2 right-2 flex gap-1 ${
//                 isFullscreen ? "scale-150" : ""
//               }`}
//             >
//               {isShowingScreenShare && (
//                 <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
//                   <span className="text-white text-xs">🖥️</span>
//                 </div>
//               )}
//               {hasVideo && !isShowingScreenShare && (
//                 <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
//                   <span className="text-white text-xs">📹</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import Image from "next/image";
import React, { useEffect, useLayoutEffect, useState } from "react";

interface PlayerMediaBoxProps {
  playerId: string;
  playerName: string;
  avatarUrl?: string;
  isSpeaking?: boolean;
  isLocalPlayer?: boolean;
  isScreenShareBox?: boolean; // 화면 공유 전용 박스인지 구분
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export default function PlayerMediaBox({
  playerId,
  playerName,
  avatarUrl = "/images/avatar/blue_pawn.png",
  isSpeaking = false,
  isLocalPlayer = false,
  isScreenShareBox = false, // 기본값은 false
  videoRef,
}: PlayerMediaBoxProps) {
  // const { localStream, screenStream, remoteStreams } = useRtc();
  const [showWave, setShowWave] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 말하기 웨이브 효과
  useEffect(() => {
    console.log("isSpeaking", isSpeaking);
    if (isSpeaking) {
      setShowWave(true);
      // 말하는 동안 웨이브 유지 (isSpeaking이 false가 될 때까지)
    } else {
      setShowWave(false);
    }
  }, [isSpeaking]);

  // 로컬 플레이어인지 확인하여 적절한 스트림 선택
  const getDisplayStream = () => {
    // 테스트를 위해 getUserMedia로 실제 카메라 스트림을 사용
    // 실제 프로젝트에서는 아래 주석 처리된 코드를 사용하세요
    return null; // 일단 null 반환, 실제 스트림 로직은 아래 주석 참조
  };
  // () => {
  //   if (isLocalPlayer) {
  //     // 화면 공유 전용 박스인 경우 화면 공유 스트림만 반환
  //     if (isScreenShareBox && screenStream) return screenStream;

  //     // 일반 박스: 카메라가 켜져 있으면 카메라, 아니면 화면 공유로 폴백
  //     const isCameraEnabled =
  //       !!localStream &&
  //       localStream.getVideoTracks().length > 0 &&
  //       localStream.getVideoTracks().some((track) => track.enabled);

  //     if (isCameraEnabled && localStream) return localStream;
  //     if (screenStream) return screenStream;
  //   } else {
  //     // 원격 플레이어의 경우 remoteStreams에서 해당 플레이어의 스트림 찾기
  //     const remoteStream = remoteStreams.get(playerId);
  //     if (remoteStream) return remoteStream;
  //   }
  //   return null;
  // };

  const displayStream = getDisplayStream();
  // 현재 표시 중인 스트림 타입 판단 (화면 공유인지 여부)
  // const isShowingScreenShare =
  //   isLocalPlayer &&
  //   !!displayStream &&
  //   !!screenStream &&
  //   displayStream === screenStream;
  const isShowingScreenShare = false;

  // 비디오 트랙 활성 여부
  const hasVideo = true;
  // const hasVideo =
  //   displayStream &&
  //   displayStream.getVideoTracks().length > 0 &&
  //   displayStream.getVideoTracks().some((track) => track.enabled);

  const handleClick = () => {
    setIsFullscreen(!isFullscreen);
  };

  useLayoutEffect(() => {
    if (videoRef.current && displayStream) {
      // 이미 같은 스트림이 연결되어 있다면 다시 설정하지 않음
      if (videoRef.current.srcObject !== displayStream) {
        videoRef.current.srcObject = displayStream;
      }
    }
  }, [displayStream]);

  // 풀스크린 상태가 변경될 때 비디오 재생 상태 확인
  useEffect(() => {
    if (videoRef.current && displayStream) {
      // 풀스크린 토글 후 비디오가 일시정지되었다면 다시 재생
      if (videoRef.current.paused) {
        videoRef.current.play().catch(console.error);
      }
    }
  }, [isFullscreen, displayStream]);

  return (
    <>
      {/* 풀스크린 오버레이 */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
          onClick={handleClick}
        />
      )}

      <div
        className={`${
          isFullscreen
            ? "fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            : ""
        }`}
      >
        <div
          className={`relative ${
            isFullscreen
              ? "w-[90vw] h-[90vh] border-4 border-[#bfae96] rounded-2xl shadow-[8px_8px_0_#8c7a5c] pointer-events-auto cursor-pointer"
              : `w-40 h-32 border-2 border-[#bfae96] rounded-lg shadow-[4px_4px_0_#8c7a5c] cursor-pointer hover:shadow-[6px_6px_0_#8c7a5c] transition-shadow duration-200 transform transition-transform ${
                  showWave
                    ? "border-pink-400 ring-4 ring-pink-300 ring-offset-2 ring-offset-[#fdf8ef] shadow-[6px_6px_0_#b97ea0] scale-105"
                    : ""
                }`
          } bg-[#fdf8ef] overflow-hidden`}
          onClick={handleClick}
        >
          {/* 말하기 강조 효과 (풀스크린이 아닐 때만) */}
          {showWave && !isFullscreen && (
            <>
              <div className="absolute inset-0 rounded-lg border-2 border-pink-300 pointer-events-none animate-pulse opacity-80"></div>
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-pink-300 shadow-[2px_2px_0_#8c7a5c] animate-bounce"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 shadow-[2px_2px_0_#8c7a5c] animate-bounce"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-300 shadow-[2px_2px_0_#8c7a5c] animate-bounce"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-300 shadow-[2px_2px_0_#8c7a5c] animate-bounce"></div>
            </>
          )}

          {/* 미디어 콘텐츠 */}
          <div className="relative w-full h-full">
            {hasVideo ? (
              <video
                autoPlay
                playsInline
                muted={isLocalPlayer}
                ref={videoRef}
                className={`w-full h-full ${
                  isShowingScreenShare
                    ? "object-contain bg-black"
                    : isFullscreen
                    ? "object-contain"
                    : "object-cover"
                } ${isShowingScreenShare ? "" : "transform scale-x-[-1]"}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className={`bg-[#f5f1e6] border-2 border-[#bfae96] rounded-full flex items-center justify-center overflow-hidden ${
                    isFullscreen ? "w-48 h-48 border-4" : "w-14 h-14"
                  }`}
                >
                  <Image
                    src={avatarUrl}
                    alt={playerName}
                    width={isFullscreen ? 160 : 40}
                    height={isFullscreen ? 160 : 40}
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* TODO 보이스*/}
            {false && (
              <audio
                autoPlay
                playsInline
                ref={(el) => {
                  if (el && displayStream) el.srcObject = displayStream;
                }}
              />
            )}

            {/* 플레이어 이름 */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-1 px-2 truncate ${
                isFullscreen ? "text-base py-2" : "text-xs"
              }`}
            >
              {playerName}
              {isFullscreen && " - 클릭하여 돌아가기"}
            </div>

            {/* 상태 표시 아이콘 */}
            <div
              className={`absolute top-2 right-2 flex gap-1 ${
                isFullscreen ? "scale-150" : ""
              }`}
            >
              {isShowingScreenShare && (
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🖥️</span>
                </div>
              )}
              {hasVideo && !isShowingScreenShare && (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📹</span>
                </div>
              )}
            </div>

            {/* 전체화면 안내 (풀스크린일 때만) */}
            {isFullscreen && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                {playerName} - 클릭하여 돌아가기
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// <div
//   className={`relative w-40 h-32 bg-[#fdf8ef] border-2 border-[#bfae96] rounded-lg shadow-[4px_4px_0_#8c7a5c] overflow-hidden cursor-pointer hover:shadow-[6px_6px_0_#8c7a5c] transition-shadow duration-200 transform transition-transform ${
//     showWave
//       ? "border-pink-400 ring-4 ring-pink-300 ring-offset-2 ring-offset-[#fdf8ef] shadow-[6px_6px_0_#b97ea0] scale-105"
//       : ""
//   }`}
//   onClick={handleClick}
// >
//   {/* 말하기 강조 효과 (웨이브 대신) */}
//   {showWave && (
//     <>
//       <div className="absolute inset-0 rounded-lg border-2 border-pink-300 pointer-events-none animate-pulse opacity-80"></div>
//       {/* 귀여운 픽셀 악센트 */}
//       <div className="absolute -top-1 -left-1 w-3 h-3 bg-pink-300 shadow-[2px_2px_0_#8c7a5c] animate-bounce"></div>
//       <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 shadow-[2px_2px_0_#8c7a5c] animate-bounce"></div>
//       <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-300 shadow-[2px_2px_0_#8c7a5c] animate-bounce"></div>
//       <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-300 shadow-[2px_2px_0_#8c7a5c] animate-bounce"></div>
//     </>
//   )}

//   {/* 미디어 콘텐츠 */}
//   <div className="relative w-full h-full">
//     {hasVideo ? (
//       // 비디오 스트림 표시
//       <video
//         autoPlay
//         playsInline
//         muted={isLocalPlayer}
//         ref={videoRef}
//         className={`w-full h-full ${
//           // 화면 공유일 때는 항상 전체가 보이도록 비율 유지
//           isShowingScreenShare
//             ? "object-contain bg-black"
//             : isFullscreen
//             ? "object-contain"
//             : "object-cover"
//         } ${
//           // 화면 공유가 아닐 때만 좌우 반전 적용
//           isShowingScreenShare ? "" : "transform scale-x-[-1]"
//         }`}
//       />
//     ) : (
//       // 아바타 표시
//       <div className="w-full h-full flex items-center justify-center">
//         <div className="w-14 h-14 bg-[#f5f1e6] border-2 border-[#bfae96] rounded-full flex items-center justify-center overflow-hidden">
//           <Image
//             src={avatarUrl}
//             alt={playerName}
//             className="w-10 h-10 object-cover"
//           />
//         </div>
//       </div>
//     )}

//     {false && (
//       <audio
//         autoPlay
//         playsInline
//         ref={(el) => {
//           if (el && displayStream) el.srcObject = displayStream;
//         }}
//       />
//     )}

//     {/* 플레이어 이름 */}
//     <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1 px-2 truncate">
//       {playerName}
//     </div>

//     {/* 상태 표시 아이콘 */}
//     <div className="absolute top-2 right-2 flex gap-1">
//       {isShowingScreenShare && (
//         <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
//           <span className="text-white text-xs">🖥️</span>
//         </div>
//       )}
//       {hasVideo && !isShowingScreenShare && (
//         <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
//           <span className="text-white text-xs">📹</span>
//         </div>
//       )}
//     </div>
//   </div>
// </div>
