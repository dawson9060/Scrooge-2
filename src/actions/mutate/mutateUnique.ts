"use client";

import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "../../../utils/get-query-client";
import {
  addUniqueExpense,
  deleteUniqueExpense,
  updateUniqueExpense,
} from "../uniqueExpenses";

export const useAddUniqueExpense = () => {
  const queryClient = getQueryClient();

  const mutate = useMutation({
    mutationFn: async (newExpense) => addUniqueExpense(newExpense),
    onMutate: async (newExpense: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["uniqueExpenses"] });

      // Snapshot the previous value
      const prevExpenses = queryClient.getQueryData(["uniqueExpenses"]);

      // Optimistically update to the new value
      const newExpenseObj = {
        id: -1,
        created_at: newExpense.timestamp,
        expense_name: newExpense.expense,
        amount: newExpense.amount,
        type: newExpense.type,
        timestamp: newExpense.timestamp,
        user_date: new Date(newExpense.user_date).getTime(),
      };
      queryClient.setQueryData(["uniqueExpenses"], (old: any) => [
        ...old,
        newExpenseObj,
      ]);

      // Return a context object with the snapshotted value
      return { prevExpenses };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newExpense, context) => {
      queryClient.setQueryData(["uniqueExpenses"], context?.prevExpenses);
    },
    // Always refetch after error or success:
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["uniqueExpenses"] }),
  });

  return mutate;
};

export const useUpdateUniqueExpense = () => {
  const queryClient = getQueryClient();

  const mutate = useMutation({
    mutationFn: async (expense: any) => updateUniqueExpense(expense),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["uniqueExpenses"] }),
  });

  return mutate;
};

export const useDeleteUniqueExpense = () => {
  const queryClient = getQueryClient();

  const mutate = useMutation({
    mutationFn: async (id) => deleteUniqueExpense(id),
    onMutate: async (idToDelete: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["uniqueExpenses"] });

      // Snapshot the previous value
      const prevExpenses = queryClient.getQueryData(["uniqueExpenses"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["uniqueExpenses"], (old: any) =>
        old.filter((expense: any) => expense.id !== idToDelete)
      );

      // Return a context object with the snapshotted value
      return { prevExpenses };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newExpense, context) => {
      queryClient.setQueryData(["uniqueExpenses"], context?.prevExpenses);
    },
    // Always refetch after error or success:
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["uniqueExpenses"] }),
  });

  return mutate;
};
