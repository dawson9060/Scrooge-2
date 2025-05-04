"use client";

import {
  useDeleteRecurringExpense,
  useUpdateRecurringExpense,
} from "@/actions/mutate/mutateRecurring";
import { selectedRecurringExpenseAtom } from "@/atoms/dashboard-atoms";
import { EXPENSE_MAP } from "@/enums/ExpenseTypes";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useAtom } from "jotai";
import { FormEvent, useEffect, useState } from "react";

export const RecurringExpenseModal = () => {
  const [name, setName] = useState<string | undefined>();
  const [amount, setAmount] = useState<number | null>();
  const [type, setType] = useState<string | null>();
  const [day, setDay] = useState<string | null>();

  const [selectedExpense, setSelectedExpense] = useAtom(
    selectedRecurringExpenseAtom
  );

  const mutateExpense = useUpdateRecurringExpense();
  const deleteExpense = useDeleteRecurringExpense();

  useEffect(() => {
    setName(selectedExpense?.expense_name);
    setAmount(selectedExpense?.amount);
    setType(selectedExpense?.type);
    setDay(selectedExpense?.day);
  }, [selectedExpense]);

  const handleUpdateUniqueExpense = (e: FormEvent) => {
    e.preventDefault();

    mutateExpense.mutate({
      ...selectedExpense,
      expense_name: name,
      amount,
      day,
      type,
    });

    setSelectedExpense(null);
  };

  const handleDelete = () => {
    deleteExpense.mutate(selectedExpense?.id);
    setSelectedExpense(null);
  };

  const defaultDate = new Date();
  defaultDate.setDate(Number(day));

  return (
    <Modal
      opened={!!selectedExpense}
      onClose={() => setSelectedExpense(null)}
      title="Update Recurring Expense"
    >
      <form onSubmit={handleUpdateUniqueExpense}>
        <Modal.Body>
          <Stack gap="sm">
            <TextInput
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              label="Name"
              placeholder="Name"
              name="expense"
              required
            />
            <NumberInput
              value={amount ?? 0}
              onChange={(e) => setAmount(Number(e))}
              name="amount"
              label="Amount"
              required
              min={1}
              prefix="$"
              clampBehavior="strict"
              hideControls
              placeholder="Amount"
            />
            <DateInput
              label="Day of Month (Optional)"
              valueFormat="DD"
              placeholder="Optional Day"
              clearable
              defaultValue={day ? defaultDate : null}
              onChange={(date) =>
                setDay(date ? date.getDate().toString() : null)
              }
            />
            <Select
              label="Type"
              name="type"
              placeholder="Pick value"
              data={Object.keys(EXPENSE_MAP)}
              defaultValue={type}
              allowDeselect={false}
              // TODO - THIS SHOULD NOT NEED TO BE SEARCHABLE TO WORK
              searchable
              onChange={(val) => setType(val)}
            />
          </Stack>
        </Modal.Body>
        <Group mt="xl" w="100%" justify="flex-end" gap="sm">
          <Button color="gray" onClick={() => setSelectedExpense(null)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
          <Button color="gold" type="submit">
            Update
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
