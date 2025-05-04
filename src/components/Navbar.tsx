"use client";

import { showRemindersAtom } from "@/atoms/dashboard-atoms";
import {
  ActionIcon,
  Box,
  Burger,
  Drawer,
  DrawerBody,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSunFilled } from "@tabler/icons-react";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { UpdatePreferencesModal } from "./Modals/UpdatePreferencesModal";
import { useFetchUserInfo } from "@/actions/fetch/fetchUserInfo";
import { User } from "@/types/app";

const BlankUser: User = {
  id: "",
  full_name: "",
  email: "",
  monthly_budget: 0,
  avatar_url: "",
};

const Navbar = () => {
  const [opened, setOpened] = useState(false);

  const setOpenReminders = useSetAtom(showRemindersAtom);

  const { toggleColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const { user } = useFetchUserInfo();
  // const user = BlankUser;

  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    router.push("/login");
  };

  return (
    <Box className="w-full">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-4 px-6 md:px-10">
        <Link
          href="/dashboard"
          className="text-3xl font-bold text-[#fac01d]"
          color="gold"
        >
          Scrooge
        </Link>

        <Box className="hidden md:flex flex-row flex-nowrap gap-6">
          <UpdatePreferencesModal user={user} />
          <Text
            className="hover:text-blue-500 hover:cursor-pointer"
            onClick={() => setOpenReminders(true)}
          >
            Reminders
          </Text>
          <Text
            className="hover:text-blue-500 hover:cursor-pointer"
            onClick={() => handleSignOut()}
          >
            Logout
          </Text>
          <ActionIcon
            size="sm"
            variant="transparent"
            onClick={toggleColorScheme}
          >
            {computedColorScheme === "dark" ? (
              <IconSunFilled color="ghostwhite" />
            ) : (
              <IconMoon color="black" />
            )}
          </ActionIcon>
        </Box>
        <Burger
          className="block md:hidden"
          opened={opened}
          onClick={() => setOpened((o) => !o)}
        />
      </div>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        size="sm"
        title="Actions"
      >
        <DrawerBody pt="lg">
          <UpdatePreferencesModal user={user} />
          <Text
            pt="md"
            className="hover:text-blue-500 hover:cursor-pointer"
            onClick={() => setOpenReminders(true)}
          >
            Reminders
          </Text>
          <Text
            pt="md"
            className="hover:text-blue-500 hover:cursor-pointer"
            onClick={() => handleSignOut()}
          >
            Logout
          </Text>
          <ActionIcon
            mt="md"
            size="md"
            variant="transparent"
            onClick={toggleColorScheme}
          >
            {computedColorScheme === "dark" ? (
              <IconSunFilled color="ghostwhite" />
            ) : (
              <IconMoon color="black" />
            )}
          </ActionIcon>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};

export default Navbar;
