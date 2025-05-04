"use client";

import {
  useDeleteUniqueExpense,
  useUpdateUniqueExpense,
} from "@/actions/mutate/mutateUnique";
import { selectedUniqueExpenseAtom } from "@/atoms/dashboard-atoms";
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

export const UniqueExpenseModal = () => {
  const [selectedUniqueExpense, setSelectedUniqueExpense] = useAtom(
    selectedUniqueExpenseAtom
  );

  const [name, setName] = useState<string | undefined>();
  const [amount, setAmount] = useState<number>();
  const [type, setType] = useState<string | null>();
  const [date, setDate] = useState<Date | null>();

  const mutateUniqueExpense = useUpdateUniqueExpense();
  const deleteUniqueExpense = useDeleteUniqueExpense();

  useEffect(() => {
    setName(selectedUniqueExpense?.expense_name);
    setAmount(selectedUniqueExpense?.amount);
    setType(selectedUniqueExpense?.type);
    setDate(
      selectedUniqueExpense?.user_date
        ? new Date(selectedUniqueExpense.user_date)
        : null
    );
  }, [selectedUniqueExpense]);

  const handleUpdateUniqueExpense = (e: FormEvent) => {
    e.preventDefault();

    mutateUniqueExpense.mutate({
      ...selectedUniqueExpense,
      expense_name: name,
      amount,
      type,
      user_date: date?.getTime(),
    });

    setSelectedUniqueExpense(null);
  };

  const handleDelete = () => {
    deleteUniqueExpense.mutate(selectedUniqueExpense?.id);
    setSelectedUniqueExpense(null);
  };

  return (
    <Modal
      opened={!!selectedUniqueExpense}
      onClose={() => setSelectedUniqueExpense(null)}
      title="Update Transaction"
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
              value={amount}
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
            <Select
              value={type}
              onChange={(e) => setType(e)}
              label="Type"
              name="type"
              placeholder="Pick value"
              data={["expense", "deposit"]}
              searchable
            />
            <DateInput
              label="Date"
              value={date}
              onChange={(e) => setDate(e)}
              placeholder="Date"
            />
          </Stack>
        </Modal.Body>
        <Group mt="xl" w="100%" justify="flex-end" gap="sm">
          <Button color="gray" onClick={() => setSelectedUniqueExpense(null)}>
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
