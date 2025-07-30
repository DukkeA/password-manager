import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { QueryPasswordType } from "@/types/password";

export function useQueryPasswords(ownerAddress: string | null | undefined) {
  return useQuery<QueryPasswordType[], Error>({
    queryKey: ["passwords", ownerAddress],
    queryFn: async () => {
      const res = await axios.get("/api/passwords", {
        params: { ownerAddress },
      });
      return res.data;
    },
    enabled: !!ownerAddress,
  });
}
