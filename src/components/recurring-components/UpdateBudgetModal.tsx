import { updateBudget } from "@/actions/budget";
import { User } from "@/types/app";
import { Button, Group, Modal, NumberInput, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

export const UpdateBudgetModal = ({ user }: { user: User }) => {
  const [error, setError] = useState<string | undefined>();
  const [monthlyBudget, setMonthlyBudget] = useState<number | undefined>();

  useEffect(() => {
    setMonthlyBudget(user?.monthly_budget);
  }, [user]);

  const [opened, handlers] = useDisclosure(false);

  const handleUpdateBudget = async () => {
    if (monthlyBudget && monthlyBudget > 0) {
      await updateBudget(monthlyBudget);

      setError("");

      handlers.close();
    } else {
      setError("Please provide a valid budget");
    }
  };

  return (
    <>
      <Button variant="light" c="blue" fw="normal" onClick={handlers.open}>
        Update Budget
      </Button>
      <Modal opened={opened} onClose={handlers.close} title="Update User Info">
        <NumberInput
          hideControls
          value={monthlyBudget}
          prefix="$"
          placeholder="Monthly Budget;"
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
          <Button bg="gold" onClick={handleUpdateBudget}>
            Submit
          </Button>
        </Group>
      </Modal>
    </>
  );
};
