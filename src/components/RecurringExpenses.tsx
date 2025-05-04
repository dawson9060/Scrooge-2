"use client";

import { useFetchRecurringExpenses } from "@/actions/fetch/fetchRecurringExpenses";
import { useFetchUserInfo } from "@/actions/fetch/fetchUserInfo";
import { Group, Stack, useMantineColorScheme } from "@mantine/core";
import { AnimatePresence } from "motion/react";
import { ExpenseItem } from "./recurring-components/ExpenseItem";
import { RecurringCharts } from "./recurring-components/RecurringCharts";
import { RecurringFormWrapper } from "./recurring-components/RecurringFormWrapper";
import { SummarySection } from "./recurring-components/SummarySection";

export function RecurringExpenses() {
  const { expenses } = useFetchRecurringExpenses();
  const { user } = useFetchUserInfo();

  const { colorScheme } = useMantineColorScheme();

  return (
    <Stack gap={0}>
      <RecurringFormWrapper user={user} />
      <Stack
        style={{ width: "100%" }}
        gap="md"
        mt="sm"
        className="rounded-md p-4 shadow-lg"
        align="flex-start"
        bg={colorScheme === "light" ? "gray.2" : "dark.2"}
      >
        <SummarySection expenses={expenses ?? []} user={user} />
        <Group w="100%" pb="lg" mah="500px" gap={0} className="overflow-y-auto">
          <AnimatePresence>
            {expenses?.map((expense) => (
              <ExpenseItem key={expense.timestamp} expense={expense} />
            ))}
          </AnimatePresence>
        </Group>
        <RecurringCharts expenses={expenses ?? []} />
      </Stack>
    </Stack>
  );
}

export default RecurringExpenses;
