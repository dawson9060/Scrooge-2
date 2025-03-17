import { RecurringExpense, Reminder } from "@/types/app";
import { ActionIcon, Box, Group } from "@mantine/core";
import { IconCalendarWeek, IconChartPie3 } from "@tabler/icons-react";
import { useState } from "react";
import { RecurringCalendar } from "./RecurringCalendar";
import RecurringDonutChart from "./RecurringDonutChart";

export const RecurringCharts = ({
  expenses,
  reminders,
}: {
  expenses: RecurringExpense[] | null;
  reminders: Reminder[] | null;
}) => {
  const CHART = "chart";
  const CALENDAR = "calendar";

  const [selectedVisual, setSelectedVisual] = useState<string>(CHART);

  return (
    <Box className="min-h-96 w-full bg-white rounded-lg">
      <Group className="w-full" justify="center">
        <Group gap={0} w={150}>
          <ActionIcon
            w="50%"
            p="md"
            onClick={() => setSelectedVisual(CHART)}
            color={selectedVisual === CHART ? "gold" : "#f0f2f2"}
            style={{ borderRadius: "0", borderBottomLeftRadius: "8px" }}
          >
            <IconChartPie3 color="black" />
          </ActionIcon>
          <ActionIcon
            w="50%"
            p="md"
            onClick={() => setSelectedVisual(CALENDAR)}
            color={selectedVisual === CALENDAR ? "gold" : "#f0f2f2"}
            style={{ borderRadius: "0", borderBottomRightRadius: "8px" }}
          >
            <IconCalendarWeek color="black" />
          </ActionIcon>
        </Group>
      </Group>
      {selectedVisual === CHART ? (
        <RecurringDonutChart expenses={expenses} />
      ) : (
        <RecurringCalendar expenses={expenses} reminders={reminders} />
      )}
    </Box>
  );
};
