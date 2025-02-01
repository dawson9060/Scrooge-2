"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../utils/supabase/server";
import { RecurringExpense } from "@/types/app";

export async function addRecurringExpense(formData: FormData) {
  const supabase = createClient();

  const expense = formData.get("expense") as string | null;
  const amount = formData.get("amount") as string | null;
  const type = formData.get("type") as string | null;
  const day = formData.get("day") as string | null;

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
    amount: Number(amount.substring(1)),
    type,
    day,
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
