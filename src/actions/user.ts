"use server";

import { User } from "@/types/app";
import { createClient } from "../../utils/supabase/server";

const BlankUser: User = {
  id: "",
  full_name: "",
  email: "",
  monthly_budget: 0,
  avatar_url: "",
};

// const fetchUserInfo = async () => {
//   const supabase = createClient();

//   // don't have to add check for user id since we are using row-level-security, will only return items matching user id
//   const { data: user } = await supabase.from("users").select();

//   return user ? user[0] : BlankUser;
// };

const updateBudget = async (budget: number) => {
  const supabase = createClient();

  if (!budget) {
    throw new Error("You must provide a valid budget");
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (!authData.user) {
    console.log("no user data found");
    return null;
  }

  const { error } = await supabase
    .from("users")
    .update({ monthly_budget: budget })
    .eq("id", authData.user.id);

  if (error) {
    console.log("error updating user budget", error);
    return null;
  }

  return;
};

const updateUserDetails = async (name: string | undefined | null) => {
  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (!authData.user) {
    console.log("no user data found");
    return null;
  }

  const { error } = await supabase
    .from("users")
    .update({ full_name: name })
    .eq("id", authData.user.id);

  if (error) {
    console.log("error updating user budget", error);
    return null;
  }

  return;
};

export { updateBudget, updateUserDetails };
// export { updateBudget, updateUserDetails, fetchUserInfo };
