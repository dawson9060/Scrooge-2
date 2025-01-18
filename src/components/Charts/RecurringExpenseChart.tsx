import { DonutChart } from "@mantine/charts";

import { RecurringExpense } from "@/types/app";
import { EXPENSE_MAP } from "@/enums/ExpenseTypes";
import {
  Box,
  Button,
  Flex,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Transition,
} from "@mantine/core";
import { ResponsiveContainer } from "recharts";
import "@mantine/charts/styles.css";
import { formatNumber } from "../../../utils/utilityFunctions";
import { useMemo, useState } from "react";

interface ExpenseProp {
  expenses: RecurringExpense[];
}

const LegendItem = ({ color, name }: { color: string; name: string }) => {
  return (
    <Group key={name} gap={10}>
      <Box className="rounded-full w-3 h-3" bg={color} />
      <Text>{name}</Text>
    </Group>
  );
};

function RecurringExpenseChart({ expenses }: ExpenseProp) {
  // const randomHexColor = require('random-hex-color');
  // const [showLegend, setShowLegend] = useState(false);
  const [showStatus, setShowStatus] = useState("hide");

  const donutData = useMemo(() => {
    let donutData = {};

    expenses.forEach((expense) => {
      if (!donutData[expense.type]) {
        donutData[expense.type] = {
          name: expense.type,
          value: expense.amount,
          color: EXPENSE_MAP[expense.type],
        };
      } else {
        donutData[expense.type].value =
          donutData[expense.type].value + expense.amount;
      }
    });

    return donutData;
  }, [expenses]);

  return (
    <Stack className="w-full h-full p-3 transition-all">
      <ResponsiveContainer width="auto" height={"100%"} minHeight={384}>
        <DonutChart
          h={384}
          size={270}
          thickness={30}
          valueFormatter={(value) => `$${formatNumber(value)}`}
          data={Object.values(donutData)}
          tooltipDataSource="segment"
          tooltipAnimationDuration={2000}
          pieProps={{
            isAnimationActive: true,
            animationDuration: 2000,
            dataKey: "value",
          }}
        />
      </ResponsiveContainer>
      <Flex style={{ transition: "all 1s ease-in-out" }}>
        <Transition
          mounted={showStatus === "show"}
          transition="fade-down"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <Group
              style={styles}
              className="w-full px-4 pb-3"
              justify="space-evenly"
            >
              {Object.entries(EXPENSE_MAP).map(([key, value]) => (
                <LegendItem color={value} name={key} />
              ))}
            </Group>
          )}
        </Transition>
      </Flex>
      <Group justify="center">
        <SegmentedControl
          value={showStatus}
          color="gold"
          data={[
            { label: "Show Legend", value: "show" },
            { label: "Hide Legend", value: "hide" },
          ]}
          onChange={setShowStatus}
        />
        {/* <Button onClick={() => setShowLegend(!showLegend)}>{showLegend ? 'Hide Legend' : 'Show Legend'}</Button> */}
      </Group>
    </Stack>
  );
}

export default RecurringExpenseChart;
