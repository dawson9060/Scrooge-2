"use client";

import { UniqueExpense } from "@/types/app";
import { Button, Group, Stack, Text } from "@mantine/core";
import "@mantine/dates/styles.css";
import { IconDownload } from "@tabler/icons-react";
import { useMemo, useOptimistic, useState } from "react";
import { jsonToCSV } from "react-papaparse";
import {
  getFirstDayInMonth,
  getLastDayInMonth,
} from "../../utils/utilityFunctions";
import { DatePickerPopover } from "./unique-components/DatePickerPopover";
import { TransactionItem } from "./unique-components/TransactionItem";
import UniqueExpenseChart from "./unique-components/UniqueExpenseCharts";
import { UniqueFormWrapper } from "./unique-components/UniqueFormWrapper";
import { UniqueSummarySection } from "./unique-components/UniqueSummarySection";

export type Action = "delete" | "update" | "create";
export type ExpenseOptimisticUpdate = (action: {
  action: Action;
  expense: UniqueExpense;
}) => void;

interface ExpenseProps {
  expenses: UniqueExpense[] | null;
}

interface ReducerProps {
  action: Action;
  expense: UniqueExpense;
}

export const uniqueReducer = (
  state: UniqueExpense[],
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

export function UniqueExpenses({ expenses }: ExpenseProps) {
  const [optimisticExpenses, optimisticUpdate] = useOptimistic(
    expenses ?? [],
    uniqueReducer
  );
  const [selectedRange, setSelectedRange] = useState<[Date, Date | null]>([
    new Date(),
    null,
  ]);

  const expensesInRange = useMemo(() => {
    const start = getFirstDayInMonth(selectedRange[0]);
    const end = getLastDayInMonth(selectedRange[1] ?? selectedRange[0]);

    // TODO - remove these after we're sure this all works
    const startMilli = start.getTime();
    const endMilli = end.getTime();

    return expenses?.filter((expense) => {
      const creationMilli = new Date(expense.created_at).getTime();
      return creationMilli >= startMilli && creationMilli <= endMilli;
    });
  }, [expenses, selectedRange]);

  // TODO - MOVE THIS INTO DATE PICKER COMPONENT
  const handleSelect = (range: [Date, Date]) => {
    if (!range[0]) {
      setSelectedRange([new Date(), null]);
    } else {
      setSelectedRange(range);
    }
  };

  const handleDownload = () => {
    const formattedExpenses = expensesInRange?.map((expense) => {
      return {
        Amount: expense.amount,
        Type: expense.type,
        Name: expense.expense_name,
        Date: new Date(expense.created_at).toLocaleDateString(),
      };
    });

    if (formattedExpenses) {
      const csvString = jsonToCSV(formattedExpenses);

      const file = new Blob([csvString], { type: "text/csv" });
      const a = document.createElement("a");

      a.download = "expenses";
      a.href = URL.createObjectURL(file);
      a.addEventListener("click", (e) => {
        setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
      });

      a.click();
    }
  };

  return (
    <Stack>
      <Group className="w-full" justify="space-between">
        <Text size="1.5rem">Unique Expenses</Text>
        <Group gap="md">
          <DatePickerPopover
            // @ts-ignore
            selectedRange={selectedRange}
            setSelectedRange={(val: [Date, Date]) => handleSelect(val)}
          />
          <Button bg="gold" onClick={handleDownload}>
            <IconDownload />
          </Button>
        </Group>
      </Group>
      <UniqueFormWrapper optimisticUpdate={optimisticUpdate} />
      <Stack
        style={{ width: "100%" }}
        gap="md"
        className="bg-slate-100 rounded-md p-4 shadow-lg"
        align="flex-start"
      >
        <UniqueSummarySection expenses={expensesInRange ?? []} />
        <Group w="100%" wrap="wrap" pb="lg">
          {expensesInRange?.map((expense) => (
            <TransactionItem
              expense={expense}
              key={expense.id}
              optimisticUpdate={optimisticUpdate}
            />
          ))}
        </Group>
        <UniqueExpenseChart
          expenses={expensesInRange ?? []}
          selectedRange={selectedRange}
        />
      </Stack>
    </Stack>
  );
}

export default UniqueExpenses;
