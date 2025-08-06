import { createPrivateIsland } from "@/api/private-island";
import Alert from "@/utils/alert";
import { useMutation } from "@tanstack/react-query";

export const useCreatePrivateIsland = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: createPrivateIsland,
    onSuccess,
    onError: () => {
      Alert.error("문제가 발생했어요 잠시후 다시 시도해보아요..");
    },
  });
};
