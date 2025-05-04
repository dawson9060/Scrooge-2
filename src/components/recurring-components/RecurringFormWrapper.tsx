import { useAddRecurringExpenses } from "@/actions/mutate/mutateRecurring";
import { EXPENSE_MAP, EXPENSE_UTILITY } from "@/enums/ExpenseTypes";
import { User } from "@/types/app";
import {
  Box,
  Button,
  Group,
  NumberInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm as useMantineForm } from "@mantine/form";
import { IconCirclePlus } from "@tabler/icons-react";
import { useState } from "react";
import { SlideDownWrapper } from "../common/SlideDownWrapper";
import { UpdateBudgetModal } from "./UpdateBudgetModal";

const FormInput = ({ form }: any) => {
  return (
    <Group gap={0}>
      <TextInput
        name="expense"
        key={form.key("expense_name")}
        {...form.getInputProps("expense_name")}
        placeholder="Expense Name&#42;"
        className="w-full md:w-[250px]"
        required
      />
      <NumberInput
        key={form.key("amount")}
        {...form.getInputProps("amount")}
        name="amount"
        min={1}
        clampBehavior="strict"
        prefix="$"
        placeholder="Amount&#42;"
        required
        className="w-[50%] mt-2 pr-2 md:mt-0 md:pl-2 md:w-[150px]"
        hideControls
      />
      <DateInput
        key={form.key("day")}
        {...form.getInputProps("day")}
        valueFormat="DD"
        placeholder="Optional Day"
        clearable
        defaultValue={null}
        className="w-[50%] mt-2 md:mt-0 md:mr-2 md:w-[135px]"
      />
      <Select
        name="type"
        key={form.key("type")}
        {...form.getInputProps("type")}
        placeholder="Pick value"
        data={Object.keys(EXPENSE_MAP)}
        defaultValue={EXPENSE_UTILITY}
        allowDeselect={false}
        // TODO - THIS SHOULD NOT NEED TO BE SEARCHABLE TO WORK
        searchable
        className="w-full mt-2 md:mt-0 md:w-[160px]"
      />
      <Box className="md:ml-2 w-full md:w-fit mt-2 md:mt-0">
        <Button type="submit" color="gold" fullWidth>
          <IconCirclePlus />
        </Button>
      </Box>
    </Group>
  );
};

export const RecurringFormWrapper = ({ user }: { user: User }) => {
  const [showForm, setShowForm] = useState<boolean>(false);

  const expenseMutator = useAddRecurringExpenses();

  const form = useMantineForm({
    mode: "uncontrolled",
    initialValues: {
      expense_name: "",
      amount: null,
      day: "",
      type: EXPENSE_UTILITY,
    },
  });

  const handleAddExpense = async (data: any) => {
    expenseMutator.mutate({ ...data, timestamp: Date.now() });
    form.reset();
  };

  return (
    <>
      <Group justify="space-between" mb="sm">
        <Text size="1.5rem">Monthly Expenses</Text>
        <Group>
          <UpdateBudgetModal user={user} />
          <Button
            variant="light"
            c="blue"
            fw="normal"
            w="70px"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Hide" : "Add"}
          </Button>
        </Group>
      </Group>
      <SlideDownWrapper isOpen={showForm}>
        <form onSubmit={form.onSubmit(handleAddExpense)}>
          <FormInput form={form} />
        </form>
      </SlideDownWrapper>
    </>
  );
};
