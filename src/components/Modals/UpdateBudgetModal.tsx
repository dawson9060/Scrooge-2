"use client";

import { Button, Group, Modal, NumberInput, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import updateUserBudget from "@/actions/budget";
import { useState } from "react";

export const UpdateBudgetModal = () => {
  const [monthlyBudget, setMonthlyBudget] = useState<number>();

  const [opened, handlers] = useDisclosure(false);

  const handleUpdateBudget = async () => {
    if (monthlyBudget) {
      await updateUserBudget(monthlyBudget);

      handlers.close();
    }
  };

  return (
    <>
      <Text
        onClick={handlers.open}
        className="hover:cursor-pointer hover:text-blue-600"
      >
        Update Budget
      </Text>
      <Modal
        opened={opened}
        onClose={handlers.close}
        title="Update Monthly Budget"
      >
        <NumberInput
          hideControls
          placeholder="Input Monthly Budget"
          value={monthlyBudget}
          onChange={(val) => setMonthlyBudget(val)}
        />

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
