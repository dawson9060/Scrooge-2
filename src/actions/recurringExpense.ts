"use server";

import { RecurringExpense } from "@/types/app";
import { createClient } from "../../utils/supabase/server";

export const fetchRecurringExpenses = async () => {
  const supabase = createClient();

  const { data: recurringExpenses } = await supabase
    .from("recurringExpenses")
    .select()
    .order("amount", { ascending: false });

  return recurringExpenses;
};

export async function addRecurringExpense(data: RecurringExpense) {
  const supabase = createClient();

  const expense = data.expense_name as string | null;
  const amount = data.amount as string | null;
  const type = data.type as string | null;
  const day = data.day as Date | null;
  const timestamp = data.timestamp as number;

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
    timestamp,
  });

  if (error) {
    throw new Error("Error adding expense");
  }

  return;
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

  return;
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

  return;
}
