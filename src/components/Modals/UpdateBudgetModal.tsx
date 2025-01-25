"use client";

import {
  Button,
  Group,
  Modal,
  NumberInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import updateUserDetails from "@/actions/budget";
import { useEffect, useState } from "react";

export const UpdateBudgetModal = ({
  currentName,
  currentBudget,
}: {
  currentName: string | undefined;
  currentBudget: number | undefined;
}) => {
  const [monthlyBudget, setMonthlyBudget] = useState<number | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setMonthlyBudget(currentBudget);
    setName(currentName);
  }, [currentName, currentBudget]);

  const [opened, handlers] = useDisclosure(false);

  const handleUpdateBudget = async () => {
    if (monthlyBudget && monthlyBudget > 0) {
      await updateUserDetails(monthlyBudget, name);

      setError("");

      handlers.close();
    } else {
      setError("Please provide a valid budget");
    }
  };

  return (
    <>
      <Text
        onClick={handlers.open}
        className="hover:cursor-pointer hover:text-blue-600"
      >
        Update Info
      </Text>
      <Modal opened={opened} onClose={handlers.close} title="Update User Info">
        <TextInput
          label="Name"
          placeholder="Input Name"
          value={name}
          mb="sm"
          onChange={(e) => setName(e.currentTarget.value as string)}
        />
        <NumberInput
          hideControls
          placeholder="Input Monthly Budget"
          value={monthlyBudget}
          label="Budget"
          onChange={(val) => setMonthlyBudget(val as number)}
        />
        {error && (
          <Text size="sm" c="red">
            {error}
          </Text>
        )}

        <Group mt={20} justify="flex-end" gap="xs">
          <Button bg="gray" onClick={handlers.close}>
            Close
          </Button>
          <Button bg="orange" onClick={handleUpdateBudget}>
            Submit
          </Button>
        </Group>
      </Modal>
    </>
  );
};
