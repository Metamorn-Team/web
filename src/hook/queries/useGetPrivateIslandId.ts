import { useQuery } from "@tanstack/react-query";
import { getPrivateIslandId } from "@/api/private-island";

export const useGetPrivateIslandId = (path: string, enabled = true) => {
  return useQuery({
    queryKey: ["privateIslandId", path],
    queryFn: () => getPrivateIslandId({ urlPath: path }),
    enabled,
  });
};
