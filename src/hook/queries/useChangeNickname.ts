import { changeNickname } from "@/api/user";
import Alert from "@/utils/alert";
import { useMutation } from "@tanstack/react-query";

export const useChangeNickname = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: changeNickname,
    onSuccess,
    onError: () => {
      Alert.error("문제가 발생했어요 잠시후 다시 변경해보아요..");
    },
  });
};
