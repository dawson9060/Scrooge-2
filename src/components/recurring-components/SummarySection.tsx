import { surplusAtom } from "@/atoms/dashboard-atoms";
import { RecurringExpense, User } from "@/types/app";
import { Box, Group, Text, Transition } from "@mantine/core";
import { useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import CountUp from "react-countup";

interface CountProps {
  number: number;
  title: string;
  duration: number;
  color: string;
}

const CountWrapper = ({ number, title, duration, color }: CountProps) => {
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
        style={{ color: color, minWidth: "65px" }}
        end={number}
        duration={duration}
        formattingFn={(num) => "$" + num.toLocaleString()}
      />
    </Group>
  );
};

export const SummarySection = ({
  expenses,
  user,
}: {
  expenses: RecurringExpense[] | null;
  user: User;
}) => {
  const [mounted, setMounted] = useState<boolean>(false);

  const setSurplus = useSetAtom(surplusAtom);

  const { total, surplus } = useMemo(() => {
    let total = 0;
    expenses?.forEach((expense) => (total += expense.amount ?? 0));

    return { total, surplus: user.monthly_budget - total };
  }, [expenses, user]);

  useEffect(() => setMounted(true), []);
  useEffect(() => setSurplus(surplus), [surplus]);

  return (
    <Group className="bg-white rounded-md w-full p-4" mih={60}>
      <Transition
        mounted={mounted}
        transition="fade-right"
        duration={700}
        timingFunction="ease"
      >
        {(styles) => (
          <Box
            style={styles}
            className="gap-3 sm:gap-0 w-full flex flex-row flex-wrap justify-center md:justify-start md:gap-8"
          >
            <CountWrapper
              number={user.monthly_budget}
              title="Budget"
              duration={1}
              color={"black"}
            />
            <CountWrapper
              number={total}
              title="Expenses"
              duration={2}
              color={"red"}
            />
            <CountWrapper
              number={surplus}
              title="Excess"
              duration={3}
              color={"green"}
            />
          </Box>
        )}
      </Transition>
    </Group>
  );
};
