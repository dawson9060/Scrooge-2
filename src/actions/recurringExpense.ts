"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../utils/supabase/server";
import { RecurringExpense } from "@/types/app";

export async function addRecurringExpense(data: RecurringExpense) {
  const supabase = createClient();

  const expense = data.expense_name as string | null;
  const amount = data.amount as string | null;
  const type = data.type as string | null;
  const day = data.day as Date | null;

  if (!expense) {
    throw new Error("Expense name is required");
  }

  if (!amount) {
    throw new Error("Expense amount is required");
  }

  if (!type) {
    throw new Error("Type is required");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const { error } = await supabase.from("recurringExpenses").insert({
    expense_name: expense,
    amount: Number(amount),
    type,
    day: day ? String(new Date(day).getDate()) : null,
    user_id: user.id,
  });

  if (error) {
    throw new Error("Error adding expense");
  }

  revalidatePath("/dashboard");
}

export async function deleteRecurringExpense(id: number) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const { error } = await supabase.from("recurringExpenses").delete().match({
    user_id: user.id,
    id: id,
  });

  if (error) {
    throw new Error("Error deleting recurring expense");
  }

  revalidatePath("/dashboard");
}

export async function updateRecurringExpense(
  recurringExpense: RecurringExpense
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const { error } = await supabase
    .from("recurringExpenses")
    .update(recurringExpense)
    .match({
      user_id: user.id,
      id: recurringExpense.id,
    });

  if (error) {
    throw new Error("Error updating recurring expense");
  }

  revalidatePath("/dashboard");
}
