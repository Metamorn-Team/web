import { useMutation } from "@tanstack/react-query";
import { checkPrivateIslandPassword } from "@/api/private-island";
import { CheckPrivatePasswordRequest } from "mmorntype";

export const useCheckPrivateIslandPassword = (
  onSuccess?: () => void,
  onError?: () => void
) => {
  return useMutation({
    mutationFn: ({
      islandId,
      body,
    }: {
      islandId: string;
      body: CheckPrivatePasswordRequest;
    }) => checkPrivateIslandPassword(islandId, body),
    onSuccess,
    onError,
  });
};
