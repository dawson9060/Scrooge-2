import { useAddUniqueExpense } from "@/actions/mutate/mutateUnique";
import {
  Box,
  Button,
  Group,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import { DateInput, DatePicker } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { useForm } from "@mantine/form";
import { IconCirclePlus } from "@tabler/icons-react";

const FormContent = ({ form }: any) => {
  return (
    <Group gap={0}>
      <TextInput
        key={form.key("expense")}
        {...form.getInputProps("expense")}
        name="expense"
        required
        className="w-full mb-2 lg:mb-0 lg:w-[250px]"
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
        className="w-full mb-2 lg:mb-0 lg:px-2 lg:w-[150px]"
        hideControls
        placeholder="Amount"
      />
      <Select
        key={form.key("type")}
        {...form.getInputProps("type", { type: "select" })}
        name="type"
        placeholder="Pick value"
        data={["expense", "deposit"]}
        className="w-1/2 pr-1 lg:pr-2 lg:w-[140px]"
        searchable
      />
      <DateInput
        key={form.key("user_date")}
        {...form.getInputProps("user_date")}
        name="user_date"
        placeholder="Date"
        className="w-1/2 pl-1 lg:w-[140px]"
      />
      <Box className="w-full mt-2 lg:pt-0 lg:ml-2 lg:mt-0 lg:w-fit">
        <Button color="gold" type="submit" fullWidth>
          <IconCirclePlus />
        </Button>
      </Box>
    </Group>
  );
};

export const UniqueFormWrapper = () => {
  const mutateUniqueExpense = useAddUniqueExpense();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      expense: "",
      amount: null,
      type: "expense",
      user_date: new Date(),
    },
  });

  const handleAddExpense = async (data: any) => {
    mutateUniqueExpense.mutate({ ...data, timestamp: new Date().getTime() });
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
