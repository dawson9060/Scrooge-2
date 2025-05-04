"use client";

import { useFetchUniqueExpenses } from "@/actions/fetch/fetchUniqueExpenses";
import {
  Box,
  Button,
  Group,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { IconDownload } from "@tabler/icons-react";
import { AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
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

export function UniqueExpenses() {
  const { expenses } = useFetchUniqueExpenses();

  const { colorScheme } = useMantineColorScheme();

  const [selectedRange, setSelectedRange] = useState<[Date, Date | null]>([
    new Date(),
    null,
  ]);

  const expensesInRange = useMemo(() => {
    const start = getFirstDayInMonth(selectedRange[0]);
    const end = getLastDayInMonth(selectedRange[1] ?? selectedRange[0]);

    const startMilli = start.getTime();
    const endMilli = end.getTime();

    return expenses?.filter((expense) => {
      return expense.user_date >= startMilli && expense.user_date <= endMilli;
    });
  }, [expenses, selectedRange]);

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
        <Text size="1.5rem">Unique Transactions</Text>
        <Group gap="md">
          <DatePickerPopover
            // @ts-ignore
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
          />
          <Button color="gold" onClick={handleDownload}>
            <IconDownload />
          </Button>
        </Group>
      </Group>
      <UniqueFormWrapper />
      <Stack
        style={{ width: "100%" }}
        gap="md"
        className="rounded-md p-4 shadow-lg"
        align="flex-start"
        bg={colorScheme === "light" ? "gray.2" : "dark.2"}
      >
        <UniqueSummarySection expenses={expensesInRange ?? []} />
        <Box w="100%" pb="lg">
          <AnimatePresence initial={false} mode="sync">
            {expensesInRange?.map((expense) => (
              <TransactionItem expense={expense} key={expense.timestamp} />
            ))}
          </AnimatePresence>
        </Box>
        <UniqueExpenseChart
          expenses={expensesInRange ?? []}
          selectedRange={selectedRange}
        />
      </Stack>
    </Stack>
  );
}

export default UniqueExpenses;
