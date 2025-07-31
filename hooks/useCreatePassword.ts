// hooks/useCreatePasswordMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { CreatePasswordInput } from "@/types/password";

export function useCreatePasswordMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePasswordInput) => {
      const res = await axiosInstance.post("/passwords", data);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate password queries to automatically update the table
      queryClient.invalidateQueries({ queryKey: ["passwords"] });
    },
  });
}
