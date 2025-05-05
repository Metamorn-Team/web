import { getProfile } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "user-profile";

export const useGetUserProfile = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, userId],
    queryFn: () => getProfile(userId),
  });
};
