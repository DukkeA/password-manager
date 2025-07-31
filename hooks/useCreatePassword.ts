// hooks/useCreatePasswordMutation.ts
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { CreatePasswordInput } from "@/types/password";

export function useCreatePasswordMutation() {
  return useMutation({
    mutationFn: async (data: CreatePasswordInput) => {
      const res = await axiosInstance.post("/passwords", data);
      return res.data;
    },
  });
}
