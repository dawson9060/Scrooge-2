"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../utils/supabase/server";

export async function addReminder(formData: FormData) {
  const supabase = createClient();

  const name = formData.get("name") as string | null;
  const date = formData.get("date") as string | null;

  if (!name) {
    throw new Error("Reminder name is required");
  }

  if (!date) {
    throw new Error("Reminder date is required");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const { error } = await supabase.from("reminders").insert({
    name: name,
    date: date,
    user_id: user.id,
    date_timestamp: new Date(date).getTime(),
  });

  if (error) {
    throw new Error("Error adding reminder");
  }

  revalidatePath("/dashboard");
}

export async function deleteReminder(id: number) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const { error } = await supabase.from("reminders").delete().match({
    user_id: user.id,
    id: id,
  });

  if (error) {
    throw new Error("Error deleting reminder");
  }

  revalidatePath("/dashboard");
}
