import { addUniqueExpense } from "@/actions/uniqueExpenses";
import { UniqueExpense } from "@/types/app";
import {
  Box,
  Button,
  Group,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { useForm } from "@mantine/form";
import { IconCirclePlus } from "@tabler/icons-react";
import { useFormStatus } from "react-dom";

export type Action = "delete" | "update" | "create";
export type ExpenseOptimisticUpdate = (action: {
  action: Action;
  expense: UniqueExpense;
}) => void;

const FormContent = ({ form }: any) => {
  const { pending } = useFormStatus();

  return (
    <Group gap={0}>
      <TextInput
        key={form.key("expense")}
        {...form.getInputProps("expense")}
        name="expense"
        required
        className="w-full mb-2 md:mb-0 md:w-[250px]"
        placeholder="Expense Name"
      />
      <NumberInput
        key={form.key("amount")}
        {...form.getInputProps("amount")}
        name="amount"
        required
        min={1}
        prefix="$"
        clampBehavior="strict"
        className="w-1/2 pr-2 md:px-2 md:w-[150px]"
        hideControls
        placeholder="Amount"
      />
      <Select
        key={form.key("type")}
        {...form.getInputProps("type", { type: "select" })}
        name="type"
        placeholder="Pick value"
        data={["expense", "deposit"]}
        className="w-1/2 md:w-[160px]"
        searchable
      />
      <Box className="w-full mt-2 md:pt-0 md:ml-2 md:mt-0 md:w-fit">
        <Button bg="gold" type="submit" fullWidth loading={pending}>
          <IconCirclePlus />
        </Button>
      </Box>
    </Group>
  );
};

export const UniqueFormWrapper = ({
  optimisticUpdate,
}: {
  optimisticUpdate: ExpenseOptimisticUpdate;
}) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      expense: "",
      amount: null,
      type: "expense",
    },

    // validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    // },
  });

  const handleAddExpense = async (data: any) => {
    const newExpense: UniqueExpense = {
      id: -1,
      created_at: "",
      user_id: "",
      type: data.type,
      amount: Number(data.amount ?? 0),
      expense_name: data.expense,
    };

    optimisticUpdate({ action: "create", expense: newExpense });

    await addUniqueExpense(data);

    form.reset();
  };

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleAddExpense)}>
        <FormContent form={form} />
      </form>
    </Box>
  );
};
