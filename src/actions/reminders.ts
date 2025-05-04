"use server";

import { createClient } from "../../utils/supabase/server";

export const fetchReminders = async () => {
  const supabase = createClient();

  const { data: reminders } = await supabase
    .from("reminders")
    .select()
    .order("date_timestamp", { ascending: true });

  return reminders;
};

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

  return;
}

export async function deleteReminder(id: number) {
  const supabase = createClient();
  console.log("DELETING REMINDER: " + id);
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
  console.log("1");
  if (error) {
    console.log("2");
    throw new Error("Error deleting reminder");
  }
  console.log("3");
  return;
}
