import { changeTag } from "@/api/user";
import Alert from "@/utils/alert";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useChangeTag = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: changeTag,
    onSuccess,
    onError: (e: AxiosError) => {
      const code = e.status;

      console.log(e);
      switch (code) {
        case 409:
          Alert.error("누군가 이미 사용 중인 태그예요..");
          break;
        default:
          Alert.error("문제가 발생했어요 잠시후 다시 변경해보아요..");
      }
    },
  });
};
