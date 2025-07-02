import GlassButton from "./common/GlassButton";
import Pawn from "./common/Pawn";
import RetroModal from "./common/RetroModal";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleLogout: () => void;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  handleLogout,
}: LogoutConfirmModalProps) {
  return (
    <RetroModal isOpen={isOpen} onClose={onClose} className="!max-w-[400px]">
      <div className="text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#5c4b32] mb-2">
            로그아웃하시겠어요?
          </h2>
          <p className="text-[#7a6144]">또 놀러와주세요!</p>
        </div>

        <div className="flex justify-center mb-6">
          <Pawn color="orange" animation="idle" className="w-20 h-20" />
        </div>

        <div className="flex gap-4 justify-center">
          <GlassButton
            onClick={onClose}
            variant="auto"
            size="md"
            hover
            timeOfDay={"evening"}
          >
            아니요
          </GlassButton>
          <GlassButton
            onClick={handleLogout}
            variant="auto"
            size="md"
            hover
            timeOfDay={"evening"}
          >
            예
          </GlassButton>
        </div>
      </div>
    </RetroModal>
  );
}
