// "use client";

// import { DotLoader } from "@/components/common/DotLoader";
// import { CDN_URL } from "@/constants/image-path";
// import Image, { ImageProps } from "next/image";
// import { useState } from "react";

// interface ImageWithFallbackProps extends ImageProps {
//   fallbackSrc?: string;
//   loadingPlaceholder?: React.ReactNode;
// }

// export default function ImageWithFallback({
//   src,
//   alt,
//   fallbackSrc = `${CDN_URL}/image/fallback.png`,
//   loadingPlaceholder = (
//     <div className="flex justify-center items-center text-sm w-full h-full  ">
//       <DotLoader loadingText="불러오는 중" className="text-base" />
//     </div>
//   ),
//   ...props
// }: ImageWithFallbackProps) {
//   const [hasError, setHasError] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   console.log(isLoading);
//   console.log(src);

//   return (
//     <>
//       {/* {isLoading && loadingPlaceholder} */}
//       <Image
//         {...props}
//         src={hasError ? fallbackSrc : src}
//         alt={alt}
//         // onLoadingComplete={() => setIsLoading(false)}
//         // onError={() => {
//         //   setHasError(true);
//         //   setIsLoading(false);
//         // }}
//         placeholder="blur"
//         blurDataURL={`${CDN_URL}/image/fallback.png`}
//         // style={{
//         //   display: isLoading ? "none" : "block",
//         //   ...props.style,
//         // }}
//       />
//     </>
//   );
// }
