"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUniqueExpenses } from "../uniqueExpenses";

export const useFetchUniqueExpenses = () => {
  const {
    data: expenses,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["uniqueExpenses"],
    queryFn: () => fetchUniqueExpenses(),
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return { expenses, refetch, isLoading, error };
};
