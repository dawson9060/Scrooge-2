"use client";

import { addReminder, deleteReminder } from "@/actions/reminders";
import { RecurringExpense, Reminder, User } from "@/types/app";
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
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { Trash2 } from "lucide-react";
import { useMemo, useRef } from "react";
import { getTimeGreeting } from "../../utils/utilityFunctions";

interface Props {
  user: User;
  expenses: RecurringExpense[] | null;
  reminders: Reminder[] | null;
}

const ReminderDrawer = ({ reminders }: { reminders: Reminder[] | null }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const formRef = useRef();

  const { upcomingCount, formattedReminders } = useMemo(() => {
    let count = 0;

    const today = new Date().getTime();
    const weekInMilli = 604800000;

    const mapped = reminders?.map((reminder) => {
      const newReminder = { ...reminder };

      if (
        reminder.date_timestamp >= today &&
        reminder.date_timestamp - today <= weekInMilli
      ) {
        count++;
        //@ts-ignore
        newReminder.isUpcoming = true;
      }

      return newReminder;
    });

    return { upcomingCount: count, formattedReminders: mapped };
  }, [reminders]);

  const handleAdd = async (formData: FormData) => {
    const date = formData.get("date") as string;

    formData.set("date", date.substring(0, 10));

    await addReminder(formData);

    //@ts-ignore
    formRef?.current?.reset();
  };

  const handleDelete = async (id: number) => {
    await deleteReminder(id);
  };

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Reminders" maw="100vw">
        <DrawerBody p={0}>
          {/* @ts-ignore */}
          <form ref={formRef} action={(data) => handleAdd(data)}>
            <Group wrap="nowrap" className="w-full">
              <TextInput w="100%" placeholder="Name" name="name" />
              <DateInput
                clearable
                miw={150}
                w={150}
                placeholder="Select a Date"
                name="date"
              />
            </Group>
            <Button mt="sm" bg="gold" fw="normal" w="100%" type="submit">
              Add Reminder
            </Button>
          </form>
          <Divider my="lg" />
          <Stack className="w-full h-full overflow-y-auto gap-3 pb-2">
            {formattedReminders?.map((reminder) => (
              <Group
                key={reminder.id}
                wrap="nowrap"
                className="relative bg-slate-100 rounded-lg p-4 shadow-md"
              >
                {/* @ts-ignore */}
                {reminder.isUpcoming && (
                  <Box
                    className="w-3 h-full absolute left-0 rounded-tl-md rounded-bl-md"
                    bg="orange"
                  />
                )}
                <Text ml="sm" w="100%">
                  {reminder.name}
                </Text>
                <Text w={95}>{reminder.date}</Text>
                <ActionIcon variant="subtle" color="black" size="30px">
                  <Trash2 onClick={() => handleDelete(reminder.id)} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        </DrawerBody>
      </Drawer>

      <Group
        w="fit-content"
        className="hover:pl-3 transition-all py-2 hover:cursor-pointer"
        onClick={open}
      >
        <Text size="lg" c={upcomingCount > 0 ? "orange" : "black"}>
          You have {upcomingCount} upcoming reminders
        </Text>
      </Group>
    </>
  );
};

export function Welcome({ user, reminders }: Props) {
  return (
    <Stack className="my-10" mih={80}>
      <Stack className="p-5 pb-3 rounded-lg shadow-md break-words" bg="#fabf1b">
        <Text size="30px" className="text-2xl">
          {getTimeGreeting(user?.email)}
        </Text>
        <ReminderDrawer reminders={reminders} />
      </Stack>
    </Stack>
  );
}

export default Welcome;
