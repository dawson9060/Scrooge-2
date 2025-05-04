"use client";

import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "../../../utils/get-query-client";
import {
  addRecurringExpense,
  deleteRecurringExpense,
  updateRecurringExpense,
} from "../recurringExpense";

export const useAddRecurringExpenses = () => {
  const queryClient = getQueryClient();

  const mutate = useMutation({
    mutationFn: async (newExpense) => addRecurringExpense(newExpense),
    onMutate: async (newExpense: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["recurringExpenses"] });

      // Snapshot the previous value
      const prevRecurringExpenses = queryClient.getQueryData([
        "recurringExpenses",
      ]);

      const day = newExpense.day ? String(newExpense.day.getDate()) : null;
      // Optimistically update to the new value
      queryClient.setQueryData(["recurringExpenses"], (old: any) =>
        [...old, { ...newExpense, day }].sort((a, b) => b.amount - a.amount)
      );

      // Return a context object with the snapshotted value
      return { prevRecurringExpenses };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newExpense, context) => {
      queryClient.setQueryData(
        ["recurringExpenses"],
        context?.prevRecurringExpenses
      );
    },
    // Always refetch after error or success:
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["recurringExpenses"] }),
  });

  return mutate;
};

export const useUpdateRecurringExpense = () => {
  const queryClient = getQueryClient();

  const mutate = useMutation({
    mutationFn: async (expense: any) => updateRecurringExpense(expense),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["recurringExpenses"] }),
  });

  return mutate;
};

export const useDeleteRecurringExpense = () => {
  const queryClient = getQueryClient();

  const mutate = useMutation({
    mutationFn: async (id) => deleteRecurringExpense(id),
    onMutate: async (idToDelete: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["recurringExpenses"] });

      // Snapshot the previous value
      const prevRecurringExpenses = queryClient.getQueryData([
        "recurringExpenses",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["recurringExpenses"], (old: any) =>
        old.filter((expense: any) => expense.id !== idToDelete)
      );

      // Return a context object with the snapshotted value
      return { prevRecurringExpenses };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newExpense, context) => {
      queryClient.setQueryData(
        ["recurringExpenses"],
        context?.prevRecurringExpenses
      );
    },
    // Always refetch after error or success:
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["recurringExpenses"] }),
  });

  return mutate;
};
