"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../utils/supabase/server";
import { UniqueExpense } from "@/types/app";

export async function addUniqueExpense(data: any) {
  const supabase = createClient();

  const expense = data.expense as string | null;
  const amount = data.amount as string | null;
  const type = data.type as string | null;

  if (!expense) {
    throw new Error("Expense name is required");
  }

  if (!amount) {
    throw new Error("Expense amount is required");
  }

  if (!type) {
    throw new Error("Expense type is required");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const { error } = await supabase.from("uniqueExpenses").insert({
    expense_name: expense,
    amount: Number(amount),
    user_id: user.id,
    type: type,
  });

  if (error) {
    throw new Error("Error adding expense");
  }

  revalidatePath("/dashboard");
}

export async function deleteUniqueExpense(id: number) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const { error } = await supabase.from("uniqueExpenses").delete().match({
    user_id: user.id,
    id: id,
  });

  if (error) {
    throw new Error("Error deleting recurring expense");
  }

  revalidatePath("/dashboard");
}

export async function updateUniqueExpense(uniqueExpense: UniqueExpense) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const { error } = await supabase
    .from("uniqueExpenses")
    .update(uniqueExpense)
    .match({
      user_id: user.id,
      id: uniqueExpense.id,
    });

  if (error) {
    throw new Error("Error updating recurring expense");
  }

  revalidatePath("/dashboard");
}
