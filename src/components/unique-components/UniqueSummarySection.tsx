import { UniqueExpense } from "@/types/app";
import { Box, Group, Text } from "@mantine/core";
import "@mantine/dates/styles.css";
import { useMemo } from "react";
import CountUp from "react-countup";

interface ExpenseProps {
  expenses: UniqueExpense[] | null;
}

const CountWrapper = ({
  number,
  title,
  duration,
}: {
  number: number;
  title: string;
  duration: number;
}) => {
  return (
    <Group
      gap="2"
      miw={170}
      style={{ fontSize: "18px" }}
      justify="center"
      wrap="nowrap"
      className=""
    >
      <Text size="18px">{title}:</Text>
      <CountUp
        end={number}
        style={{ minWidth: "65px" }}
        duration={duration}
        enableScrollSpy
        scrollSpyOnce
        formattingFn={(num) => "$" + num.toLocaleString()}
      />
    </Group>
  );
};

export const UniqueSummarySection = ({ expenses }: ExpenseProps) => {
  const { totalExpenses, largestExpense } = useMemo(() => {
    let total = 0;
    let largest = 0;

    expenses?.forEach((expense) => {
      if (expense.type === "expense" && expense.amount > largest) {
        largest = expense.amount;
      }

      if (expense.type === "expense") {
        total += expense.amount;
      } else {
        total -= expense.amount;
      }
    });

    return { totalExpenses: total, largestExpense: largest };
  }, [expenses]);

  return (
    <Group className="bg-white rounded-md w-full p-4" mih={60}>
      <Box className="gap-2 sm:gap-0 w-full flex flex-row flex-wrap justify-center md:justify-start md:gap-4">
        <CountWrapper number={totalExpenses} title="Total" duration={1} />
        <CountWrapper number={largestExpense} title="Largest" duration={2} />
      </Box>
    </Group>
  );
};
