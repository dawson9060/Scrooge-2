import { updateBudget } from "@/actions/user";
import { User } from "@/types/app";
import { Button, Group, Modal, NumberInput, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getQueryClient } from "../../../utils/get-query-client";

export const UpdateBudgetModal = ({ user }: { user: User }) => {
  const [error, setError] = useState<string | undefined>();
  const [monthlyBudget, setMonthlyBudget] = useState<number | undefined>();

  const queryClient = getQueryClient();

  useEffect(() => {
    setMonthlyBudget(user?.monthly_budget);
  }, [user]);

  const [opened, handlers] = useDisclosure(false);

  const handleUpdateBudget = async () => {
    if (monthlyBudget && monthlyBudget > 0) {
      await updateBudget(monthlyBudget);

      queryClient.invalidateQueries({ queryKey: ["user"] });

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
      <Modal
        opened={opened}
        onClose={handlers.close}
        title="Update Monthly Budget"
      >
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
          <Button color="gray" onClick={handlers.close}>
            Close
          </Button>
          <Button color="gold" onClick={handleUpdateBudget}>
            Submit
          </Button>
        </Group>
      </Modal>
    </>
  );
};
