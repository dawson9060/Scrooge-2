import { AreaChart } from "@mantine/charts";

import { UniqueExpense } from "@/types/app";
import "@mantine/charts/styles.css";
import { Box, Stack, Text } from "@mantine/core";
import { useMemo } from "react";
import { ResponsiveContainer } from "recharts";
import {
  formatNumber,
  getAllDaysInRange,
} from "../../../utils/utilityFunctions";

interface ExpenseProp {
  expenses: UniqueExpense[];
  selectedRange: [Date, Date | null];
}

function createChartData(expenses: UniqueExpense[]) {
  if (!expenses[0]) return [];

  const rangeMap = getAllDaysInRange(
    expenses[0].created_at,
    expenses[expenses.length - 1].created_at
  );

  let runningTotal = 0;
  expenses.forEach((expense) => {
    const formattedDate = new Date(expense.created_at).toLocaleDateString();

    if (expense.type === "expense") {
      runningTotal += expense.amount;
    } else {
      runningTotal -= expense.amount;
    }

    rangeMap.set(formattedDate, runningTotal);
  });

  let chartData: Object[] = [];
  rangeMap.forEach((value, key) => {
    chartData.push({ date: key, expenses: value });
  });

  return chartData;
}

function UniqueExpenseChart({ expenses, selectedRange }: ExpenseProp) {
  const chartData = useMemo(() => {
    return createChartData(expenses);
  }, [expenses]);

  const isSingleMonth = selectedRange[1] === null;
  console.log("SELECTED RANGE", selectedRange);
  console.log("isSIngleMonth", isSingleMonth);
  // console.log('chart data', chartData);

  return (
    <Box className="min-h-96 w-full">
      <ResponsiveContainer width={"100%"} height={"100%"} minHeight={"384px"}>
        {chartData.length > 0 ? (
          <AreaChart
            h={"384px"}
            bg="white"
            p="md"
            // xAxisLabel="Date"
            // yAxisLabel="Cumulative Total"
            style={{ borderRadius: "12px" }}
            data={chartData ?? []}
            dataKey="date"
            areaProps={{ isAnimationActive: true, animationDuration: 6000 }}
            referenceLines={
              isSingleMonth
                ? [{ y: 700, label: "Allowance", color: "red.6" }]
                : []
            }
            series={[{ name: "expenses", color: "indigo.6" }]}
            valueFormatter={(value) => `$${formatNumber(value)}`}
            curveType="linear"
          />
        ) : (
          <Stack
            className="min-h-96 w-full h-full"
            justify="center"
            align="center"
          >
            <Text fw="bold">No Data Available</Text>
          </Stack>
        )}
      </ResponsiveContainer>
    </Box>
  );
}

export default UniqueExpenseChart;