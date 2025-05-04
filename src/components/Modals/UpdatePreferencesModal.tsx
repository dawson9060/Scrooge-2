import { Button, Group, Modal, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useFetchUserInfo } from "@/actions/fetch/fetchUserInfo";
import { useUpdatePreferences } from "@/actions/mutate/mutatePreferences";
import { useEffect, useState } from "react";
import { User } from "@/types/app";

export const UpdatePreferencesModal = ({ user }: { user: User }) => {
  const [name, setName] = useState<string | null>();
  const [error, setError] = useState<string | undefined>();

  const mutatePreferences = useUpdatePreferences();

  // const { user } = useFetchUserInfo();

  const [opened, handlers] = useDisclosure(false);

  // const queryClient = getQueryClient();

  useEffect(() => {
    setName(user?.full_name);
  }, [user]);

  const handleUpdate = async () => {
    if (name && name.length > 0) {
      mutatePreferences.mutate(name);
      // await updateUserDetails(name);

      // queryClient.invalidateQueries({ queryKey: ["user"] });

      setError("");

      handlers.close();
    } else {
      setError("Please provide a valid name");
    }
  };

  return (
    <>
      <Text
        onClick={() => handlers.open()}
        className="hover:cursor-pointer hover:text-blue-600"
      >
        Preferences
      </Text>
      <Modal
        opened={opened}
        onClose={() => handlers.close()}
        title="Update Preferences"
      >
        <TextInput
          label="Name"
          placeholder="Input Name"
          value={name ?? ""}
          mb="sm"
          onChange={(e) => setName(e.currentTarget.value as string)}
        />
        {error && (
          <Text size="sm" c="red">
            {error}
          </Text>
        )}

        <Group mt={20} justify="flex-end" gap="xs">
          <Button color="gray" onClick={() => handlers.close()}>
            Close
          </Button>
          <Button color="gold" onClick={() => handleUpdate()}>
            Submit
          </Button>
        </Group>
      </Modal>
    </>
  );
};
