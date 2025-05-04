"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchReminders } from "../reminders";

export const useFetchReminders = () => {
  const {
    data: reminders,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["reminders"],
    queryFn: () => fetchReminders(),
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return { reminders, refetch, isLoading, error };
};
