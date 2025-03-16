"use client";

import { updateUserDetails } from "@/actions/budget";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useEffect, useState } from "react";

export const UpdatePreferencesModal = ({
  currentName,
  currentBudget,
}: {
  currentName: string | undefined;
  currentBudget: number | undefined;
}) => {
  const [name, setName] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setName(currentName);
  }, [currentName, currentBudget]);

  const [opened, handlers] = useDisclosure(false);

  const handleUpdate = async () => {
    if (name && name.length > 0) {
      await updateUserDetails(name);

      setError("");

      handlers.close();
    } else {
      setError("Please provide a valid name");
    }
  };

  return (
    <>
      <Text
        onClick={handlers.open}
        className="hover:cursor-pointer hover:text-blue-600"
      >
        Preferences
      </Text>
      <Modal opened={opened} onClose={handlers.close} title="Update User Info">
        <TextInput
          label="Name"
          placeholder="Input Name"
          value={name}
          mb="sm"
          onChange={(e) => setName(e.currentTarget.value as string)}
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
          <Button bg="gold" onClick={handleUpdate}>
            Submit
          </Button>
        </Group>
      </Modal>
    </>
  );
};
