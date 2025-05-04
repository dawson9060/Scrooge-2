"use client";

import { useFetchReminders } from "@/actions/fetch/fetchReminders";
import { useFetchUserInfo } from "@/actions/fetch/fetchUserInfo";
import { showRemindersAtom } from "@/atoms/dashboard-atoms";
import { Group, Stack, Text } from "@mantine/core";
import { useSetAtom } from "jotai";
import { useMemo } from "react";
import { getTimeGreeting } from "../../utils/utilityFunctions";

export function Welcome() {
  const { reminders } = useFetchReminders();
  const { user } = useFetchUserInfo();

  const setOpen = useSetAtom(showRemindersAtom);

  const upcomingCount = useMemo(() => {
    let count = 0;

    const today = new Date().getTime();
    const weekInMilli = 604800000;

    reminders?.forEach((reminder) => {
      if (
        reminder.date_timestamp >= today &&
        reminder.date_timestamp - today <= weekInMilli
      ) {
        count++;
      }
    });

    return count;
  }, [reminders]);

  return (
    <Stack className="my-10 text-black" mih={80}>
      <Stack className="p-5 pb-3 rounded-lg shadow-md break-words" bg="#fabf1b">
        <Text size="30px" className="text-2xl">
          {getTimeGreeting(
            user && (user.full_name ? user.full_name : user.email)
          )}
        </Text>
        <Group
          w="fit-content"
          className="hover:pl-3 transition-all py-2 hover:cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <Text
            size="lg"
            className={`${upcomingCount > 0 && "animate-bounce"}`}
          >
            You have {upcomingCount} upcoming reminders
          </Text>
        </Group>
      </Stack>
    </Stack>
  );
}

export default Welcome;
