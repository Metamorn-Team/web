import { getAllOwnedItems } from "@/api/item";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ItemGrade,
  ItemType,
} from "mmorntype/dist/src/domain/types/item.types";

export const QUERY_KEY = "owned-items";

export const useGetAllOwnedItems = (type: ItemType, grade: ItemGrade) => {
  const query = useSuspenseQuery({
    queryKey: [QUERY_KEY, type, grade],
    queryFn: () => getAllOwnedItems({ type, grade }),
    staleTime: 1000 * 60 * 60,
  });

  return {
    ...query,
    data: query.data.items,
  };
};
