"use client";

import { RecurringExpense, Reminder, User } from "@/types/app";
import { Group, Stack } from "@mantine/core";
import { useOptimistic } from "react";
import { ExpenseItem } from "./recurring-components/ExpenseItem";
import { RecurringCharts } from "./recurring-components/RecurringCharts";
import { RecurringFormWrapper } from "./recurring-components/RecurringFormWrapper";
import { SummarySection } from "./recurring-components/SummarySection";

export type Action = "delete" | "update" | "create";
export type ExpenseOptimisticUpdate = (action: {
  action: Action;
  expense: RecurringExpense;
}) => void;

interface ExpenseProps {
  expenses: RecurringExpense[] | null;
  reminders: Reminder[] | null;
  user: User;
}

interface ReducerProps {
  action: Action;
  expense: RecurringExpense;
}

const recurringReducer = (
  state: RecurringExpense[],
  { action, expense }: ReducerProps
) => {
  switch (action) {
    case "delete":
      return state.filter(({ id }) => id !== expense.id);
    case "update":
      return state.map((e) => (e.id === expense.id ? expense : e));
    case "create":
      return [...state, expense];
    default:
      return state;
  }
};

export function RecurringExpenses({ expenses, user, reminders }: ExpenseProps) {
  const [optimisticExpenses, optimisticExpensesUpdate] = useOptimistic(
    expenses ?? [],
    recurringReducer
  );

  return (
    <Stack gap={0}>
      <RecurringFormWrapper
        optimisticUpdate={optimisticExpensesUpdate}
        user={user}
      />
      <Stack
        style={{ width: "100%" }}
        gap="md"
        mt="sm"
        className="bg-slate-100 rounded-md p-4 shadow-lg"
        align="flex-start"
      >
        <SummarySection expenses={expenses} user={user} />
        <Group
          w="100%"
          justify="space-between"
          pb="lg"
          mah="500px"
          className="overflow-y-auto"
        >
          {optimisticExpenses?.map((expense) => (
            <ExpenseItem
              expense={expense}
              key={expense.id}
              optimisticUpdate={optimisticExpensesUpdate}
            />
          ))}
        </Group>
        <RecurringCharts expenses={expenses} reminders={reminders} />
      </Stack>
    </Stack>
  );
}

export default RecurringExpenses;
