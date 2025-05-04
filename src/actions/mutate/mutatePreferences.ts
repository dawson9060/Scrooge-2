import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "../../../utils/get-query-client";
import { updateUserDetails } from "../user";

export const useUpdatePreferences = () => {
  const queryClient = getQueryClient();

  const mutate = useMutation({
    mutationFn: async (name: any) => updateUserDetails(name),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });

  return mutate;
};
