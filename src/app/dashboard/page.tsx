import { redirect } from "next/navigation";

import { Divider, Stack } from "@mantine/core";

import { fetchRecurringExpenses } from "@/actions/recurringExpense";
import { fetchReminders } from "@/actions/reminders";
import { fetchUniqueExpenses } from "@/actions/uniqueExpenses";
import RecurringExpenses from "@/components/RecurringExpenses";
import { Reminders } from "@/components/Reminders";
import { ScrollingText } from "@/components/ScrollingText";
import UniqueExpenses from "@/components/UniqueExpenses";
import Welcome from "@/components/Welcome";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../../../utils/get-query-client";
import { createClient } from "../../../utils/supabase/server";
import { UniqueExpenseModal } from "@/components/UniqueExpenseModal";
import { RecurringExpenseModal } from "@/components/RecurringExpenseModal";
import Navbar from "@/components/Navbar";
import { fetchUserInfo } from "@/actions/fetch/fetchUserInfo";

export default async function Dashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: fetchUserInfo,
  });
  await queryClient.prefetchQuery({
    queryKey: ["recurringExpenses"],
    queryFn: fetchRecurringExpenses,
  });
  await queryClient.prefetchQuery({
    queryKey: ["uniqueExpenses"],
    queryFn: fetchUniqueExpenses,
  });
  await queryClient.prefetchQuery({
    queryKey: ["reminders"],
    queryFn: fetchReminders,
  });

  return (
    <>
      <Stack className="max-w-screen-xl min-h-screen overflow-x-hidden w-full mx-auto px-6 md:px-10">
        <Navbar />
        <ScrollingText />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Welcome />
          <RecurringExpenses />
          <Divider mx="xl" my="2rem" />
          <UniqueExpenses />
          <Reminders />
          <UniqueExpenseModal />
          <RecurringExpenseModal />
        </HydrationBoundary>
      </Stack>
    </>
  );
}
