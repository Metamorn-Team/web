import Image from "next/image";

export const Logo = ({ width }: { width: string }) => {
  return (
    <div
      className="flex flex-col justify-center items-center"
      style={{ width }}
    >
      <div className="relative w-12 h-12">
        <Image
          src={"/images/avatar/purple_pawn_avatar.png"}
          alt="메타몬"
          priority
          fill
        />
      </div>
      <p className="text-3xl">메타몬</p>
    </div>
  );
};

export default Logo;
