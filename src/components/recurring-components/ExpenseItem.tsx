import { deleteRecurringExpense } from "@/actions/recurringExpense";
import { EXPENSE_MAP } from "@/enums/ExpenseTypes";
import { RecurringExpense } from "@/types/app";
import { ActionIcon, Box, Group, Text } from "@mantine/core";
import { Trash2 } from "lucide-react";

export type Action = "delete" | "update" | "create";
export type ExpenseOptimisticUpdate = (action: {
  action: Action;
  expense: RecurringExpense;
}) => void;

export const ExpenseItem = ({
  expense,
  optimisticUpdate,
}: {
  expense: RecurringExpense;
  optimisticUpdate: ExpenseOptimisticUpdate;
}) => {
  const handleDelete = async () => {
    optimisticUpdate({ action: "delete", expense });

    await deleteRecurringExpense(expense.id);
  };

  return (
    <Group
      className="overflow-hidden shadow-md lg:w-[49%] w-full rounded-md bg-white px-3 py-2 relative transition-all"
      justify="space-between"
      wrap="nowrap"
    >
      <Box
        className="w-3 h-full absolute left-0 rounded-tl-md rounded-bl-md"
        bg={EXPENSE_MAP[expense.type]}
      />
      <Text w="60%" pl={8}>
        {expense.expense_name}
      </Text>
      <Text w="20%">${expense.amount}</Text>
      <ActionIcon variant="transparent" color="black" size="30px">
        <Trash2 onClick={() => handleDelete()} />
      </ActionIcon>
    </Group>
  );
};
