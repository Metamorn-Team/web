import { Pixelify_Sans } from "next/font/google";
import Image from "next/image";

const Pixelify = Pixelify_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const Logo = () => {
  return (
    <div className="flex justify-center items-center gap-2">
      <div className="relative w-16 h-12">
        <Image
          src={"/images/slime.png"}
          alt="메타몬"
          fill
        />
      </div>
      <p className={`${Pixelify.className} text-4xl`}>Metamorn</p>
    </div>
  );
};

export default Logo;
