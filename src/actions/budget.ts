"use server";

import { User } from "@/types/app";
import { createClient } from "../../utils/supabase/server";
import { revalidatePath } from "next/cache";

const updateUserBudget = async (budget: number) => {
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

  revalidatePath("/dashboard");
};

export default updateUserBudget;
