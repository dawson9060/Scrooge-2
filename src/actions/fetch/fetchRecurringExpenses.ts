"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRecurringExpenses } from "../recurringExpense";

export const useFetchRecurringExpenses = () => {
  const {
    data: expenses,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["recurringExpenses"],
    queryFn: () => fetchRecurringExpenses(),
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return { expenses, refetch, isLoading, error };
};
