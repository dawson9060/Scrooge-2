import { selectedRecurringExpenseAtom } from "@/atoms/dashboard-atoms";
import { EXPENSE_MAP } from "@/enums/ExpenseTypes";
import { RecurringExpense } from "@/types/app";
import {
  ActionIcon,
  Box,
  Divider,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useSetAtom } from "jotai";
import React from "react";

export const ExpenseItem = React.forwardRef(
  (
    { expense }: { expense: RecurringExpense },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const { colorScheme } = useMantineColorScheme();

    const setSelectedExpense = useSetAtom(selectedRecurringExpenseAtom);

    const date = new Date();
    date.setDate(Number(expense.day));
    const dayOfMonth = expense.day ? date.toLocaleDateString() : "N/A";

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full"
      >
        <Box
          className="py-1 cursor-pointer"
          onClick={() => setSelectedExpense(expense)}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
              scale: 0.98,
              filter: "blur(4px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.98,
              filter: "blur(4px)",
            }}
            style={{
              backgroundColor:
                colorScheme === "light"
                  ? "white"
                  : "var(--mantine-color-dark-5)",
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="w-full flex flex-row overflow-hidden items-center shadow-md rounded-md pr-2 bg-white relative transition-all"
          >
            <Box className="w-3 h-[40px]" bg={EXPENSE_MAP[expense.type]} />
            <Box className="pl-2 flex flex-grow">
              <Text>{expense.expense_name}</Text>
            </Box>
            <Box w={80}>
              <Text>${expense.amount}</Text>
            </Box>
            <Box w={130} mr="md" className="hidden sm:block">
              <Box w={130} className="flex flex-row justify-between">
                <Divider orientation="vertical" h="24px" />
                <Text>{dayOfMonth}</Text>
                <Divider orientation="vertical" h="24px" />
              </Box>
            </Box>
            <ActionIcon
              variant="transparent"
              color={colorScheme === "light" ? "black" : "dark.0"}
              size={30}
            >
              <IconEdit />
            </ActionIcon>
          </motion.div>
        </Box>
      </motion.div>
    );
  }
);

ExpenseItem.displayName = "ExpenseItem";
