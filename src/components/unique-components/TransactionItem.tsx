import { deleteUniqueExpense } from "@/actions/uniqueExpenses";
import { UniqueExpense } from "@/types/app";
import { ActionIcon, Box, Group, Text } from "@mantine/core";
import "@mantine/dates/styles.css";
import { Trash2 } from "lucide-react";

export type Action = "delete" | "update" | "create";
export type ExpenseOptimisticUpdate = (action: {
  action: Action;
  expense: UniqueExpense;
}) => void;

export const TransactionItem = ({
  expense,
  optimisticUpdate,
}: {
  expense: UniqueExpense;
  optimisticUpdate: ExpenseOptimisticUpdate;
}) => {
  const handleDelete = async () => {
    optimisticUpdate({ action: "delete", expense });

    await deleteUniqueExpense(expense.id);
  };

  return (
    <Group
      className="w-full lg:w-[49%] overflow-hidden shadow-md p-2 rounded-md bg-white relative transition-all"
      justify="space-between"
      wrap="nowrap"
    >
      <Box
        className="w-3 h-full absolute left-0 rounded-tl-md rounded-bl-md"
        bg={expense.type === "expense" ? "red" : "green"}
      />
      <Group className="flex-wrap sm:flex-nowrap w-full ml-4">
        <Text className="w-full sm:w-auto sm:flex-1">
          {expense.expense_name}
        </Text>
        <Text
          className="w-[70px]"
          c={expense.type === "expense" ? "red" : "green"}
        >
          ${expense.amount}
        </Text>
        <Text className="w-[70px]">
          {new Date(expense.created_at).toLocaleDateString()}
        </Text>
      </Group>
      <Box className="h-full flex-col justify-center align-middle">
        <ActionIcon variant="transparent" color="black" size="30px">
          <Trash2 onClick={() => handleDelete()} />
        </ActionIcon>
      </Box>
    </Group>
  );
};
