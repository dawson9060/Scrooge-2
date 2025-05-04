"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
// import { fetchUserInfo } from "../user";
import { createClient } from "../../../utils/supabase/client";
import { User } from "@/types/app";

const BlankUser: User = {
  id: "",
  full_name: "",
  email: "",
  monthly_budget: 0,
  avatar_url: "",
};

export const fetchUserInfo = async () => {
  const supabase = createClient();

  // don't have to add check for user id since we are using row-level-security, will only return items matching user id
  const { data: user } = await supabase.from("users").select();
  console.log("USER 1", user);
  return user ? user[0] : BlankUser;
};

export const useFetchUserInfo = () => {
  const {
    data: user = BlankUser,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClient();

      // don't have to add check for user id since we are using row-level-security, will only return items matching user id
      const { data: user } = await supabase.from("users").select();
      console.log("USER 2", user);
      return user ? user[0] : BlankUser;
    },
    // queryFn: () => fetchUserInfo(),
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return { user, refetch, isLoading, error };
};
