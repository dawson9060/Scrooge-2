"use client";

import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "../../../utils/get-query-client";
import { addReminder, deleteReminder } from "../reminders";

export const useAddReminder = () => {
  const queryClient = getQueryClient();

  const mutate = useMutation({
    mutationFn: async (newReminder) => addReminder(newReminder),
    onMutate: async (newReminder: FormData) => {
      const reminderObj = {
        name: newReminder.get("name"),
        date_timestamp: newReminder.get("date_timestamp"),
      };
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["reminders"] });

      // Snapshot the previous value
      const prevReminders = queryClient.getQueryData(["reminders"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["reminders"], (old: any) =>
        [...old, reminderObj].sort(
          (a, b) => a.date_timestamp - b.date_timestamp
        )
      );

      // Return a context object with the snapshotted value
      return { prevReminders };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newExpense, context) => {
      queryClient.setQueryData(["reminders"], context?.prevReminders);
    },
    // Always refetch after error or success:
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
  });

  return mutate;
};

export const useDeleteReminder = () => {
  const queryClient = getQueryClient();

  const mutate = useMutation({
    mutationFn: async (id) => deleteReminder(id),
    onMutate: async (idToDelete: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["reminders"] });

      // Snapshot the previous value
      const prevReminders = queryClient.getQueryData(["reminders"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["reminders"], (old: any) =>
        old.filter((reminder: any) => reminder.id !== idToDelete)
      );

      // Return a context object with the snapshotted value
      return { prevReminders };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newReminder, context) => {
      queryClient.setQueryData(["reminders"], context?.prevReminders);
    },
    // Always refetch after error or success:
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
  });

  return mutate;
};
