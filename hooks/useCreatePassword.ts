import { CreatePasswordInput } from "@/types/password";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useCreatePasswordMutation() {
  return useMutation({
    mutationFn: async (data: CreatePasswordInput) => {
      const res = await axios.post("/api/passwords", data);
      return res.data;
    },
  });
}
