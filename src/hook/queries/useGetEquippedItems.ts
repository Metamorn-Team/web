import { getEquippedItems } from "@/api/equipment";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "equipped";

export const useGetEquippedItems = () => {
  const result = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getEquippedItems,
    staleTime: 1000 * 60 * 5,
  });

  const { data, ...rest } = result;
  return {
    ...rest,
    equippedItems: data?.equipmentState,
  };
};
