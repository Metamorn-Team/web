import { getMyProfile } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "my-profile";

export const useGetMyProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => getMyProfile(),
    staleTime: 1000 * 60 * 5,
  });
};
