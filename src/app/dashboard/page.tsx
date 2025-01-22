"use server";

import { redirect } from "next/navigation";

import { Stack } from "@mantine/core";

import RecurringExpenses from "@/components/RecurringExpenses";
import UniqueExpenses from "@/components/UniqueExpenses";
import Welcome from "@/components/Welcome";
import { createClient } from "../../../utils/supabase/server";

export default async function Dashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // don't have to add check for user id since we are using row-level-security, will only return items matching user id
  const { data: userInfo } = await supabase.from("users").select();

  // TODO - check that this only grabs current logged in users's expenses
  const { data: recurringExpenses } = await supabase
    .from("recurringExpenses")
    .select()
    .order("amount", { ascending: false });

  // TODO - move these into their own server components so as to not refetch all data on a revalidate path?
  const { data: uniqueExpenses } = await supabase
    .from("uniqueExpenses")
    .select()
    .order("created_at", { ascending: true });

  const { data: reminders } = await supabase
    .from("reminders")
    .select()
    .order("date_timestamp", { ascending: true });
  console.log("reminders", reminders);

  return (
    <>
      {userInfo && (
        <Stack className="max-w-screen-xl min-h-screen overflow-x-hidden w-full mx-auto px-6 md:px-10">
          <Welcome
            user={userInfo[0]}
            expenses={recurringExpenses}
            reminders={reminders}
          />
          <RecurringExpenses
            user={userInfo[0]}
            expenses={recurringExpenses}
            reminders={reminders}
          />
          <UniqueExpenses expenses={uniqueExpenses} />
        </Stack>
      )}
    </>
  );
}
