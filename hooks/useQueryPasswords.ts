import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { QueryPasswordType } from "@/types/password";

export function useQueryPasswords() {
  return useQuery({
    queryKey: ["passwords"],
    queryFn: async (): Promise<QueryPasswordType> => {
      const res = await axiosInstance.get("/passwords");
      return res.data;
    },
  });
}
