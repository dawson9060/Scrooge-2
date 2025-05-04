"use client";

import { useFetchReminders } from "@/actions/fetch/fetchReminders";
import {
  useAddReminder,
  useDeleteReminder,
} from "@/actions/mutate/mutateReminders";
import { showRemindersAtom } from "@/atoms/dashboard-atoms";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  Group,
  Stack,
  Text,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useAtom } from "jotai";
import { Trash2 } from "lucide-react";
import { useMemo, useRef } from "react";

export const Reminders = () => {
  const { reminders, refetch } = useFetchReminders();

  const addMutator = useAddReminder();
  const deleteMutator = useDeleteReminder();

  const [open, setOpen] = useAtom(showRemindersAtom);

  const { colorScheme } = useMantineColorScheme();

  const formRef = useRef();

  const formattedReminders = useMemo(() => {
    const today = new Date().getTime();
    const weekInMilli = 604800000;

    const mapped = reminders?.map((reminder) => {
      const newReminder = { ...reminder };

      if (
        reminder.date_timestamp >= today &&
        reminder.date_timestamp - today <= weekInMilli
      ) {
        //@ts-ignore
        newReminder.isUpcoming = true;
      }

      return newReminder;
    });

    return mapped;
  }, [reminders]);

  const handleAdd = async (formData: FormData) => {
    const date = formData.get("date") as string;

    formData.set("date", date.substring(0, 10));
    formData.set("date_timestamp", String(new Date(date).getTime()));

    addMutator.mutate(formData);

    //@ts-ignore
    formRef?.current?.reset();
  };

  const handleDelete = async (id: number) => {
    deleteMutator.mutate(id);
  };

  return (
    <>
      <Drawer
        opened={open}
        onClose={() => setOpen(false)}
        title="Reminders"
        maw="100vw"
        position="right"
      >
        <DrawerBody p={0}>
          {/* @ts-ignore */}
          <form ref={formRef} action={(data) => handleAdd(data)}>
            <Group
              className="w-full flex flex-row flex-wrap sm:flex-nowrap"
              justify="space-between"
            >
              <TextInput
                className="w-full sm:w-auto"
                placeholder="Name"
                name="name"
                required
              />
              <DateInput
                clearable
                className="w-full sm:w-[170px] sm:min-w-[170px]"
                placeholder="Select a Date"
                name="date"
                required
              />
            </Group>
            <Button mt="sm" color="gold" fw="normal" w="100%" type="submit">
              Add Reminder
            </Button>
          </form>
          <Divider my="lg" />
          <Stack className="w-full h-full overflow-y-auto gap-3 pb-2">
            {formattedReminders?.map((reminder) => (
              <Group
                key={reminder.id ?? -1}
                wrap="nowrap"
                className="relative bg-slate-100 rounded-lg p-2 shadow-md"
                bg={colorScheme === "light" ? "gray.2" : "dark.3"}
              >
                {/* @ts-ignore */}
                {reminder.isUpcoming && (
                  <Box
                    className="w-3 h-full absolute left-0 rounded-tl-md rounded-bl-md"
                    bg="gold"
                  />
                )}
                <Text ml="sm" w="100%">
                  {reminder.name}
                </Text>
                <Text w={100}>{reminder.date}</Text>
                <ActionIcon variant="subtle" color="black" size="30px">
                  <Trash2 onClick={() => handleDelete(reminder.id)} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        </DrawerBody>
      </Drawer>
    </>
  );
};
