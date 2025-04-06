import { Provider } from "@/types/client/unions";
import { create } from "zustand";

interface RegisterState {
  readonly email: string;
  readonly provider: Provider;
  readonly nickname: string;
  readonly tag: string;
  readonly avatarKey: string;
}

interface Action {
  updatePayload: (data: Partial<RegisterState>) => void;
  clear: () => void;
}

const initialState: RegisterState = {
  avatarKey: "",
  email: "",
  nickname: "",
  provider: "GOOGLE",
  tag: "",
};

const useRegisterPayloadStore = create<RegisterState & Action>((set) => ({
  ...initialState,
  updatePayload: (data) => set((state) => ({ ...state, ...data })),
  clear: () => set(() => initialState),
}));

export default useRegisterPayloadStore;
