"use client";

import { Burger, Drawer, DrawerBody, Group, Text } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { UpdateBudgetModal } from "./Modals/UpdateBudgetModal";
import { useSetAtom } from "jotai";
import { showRemindersAtom } from "@/atoms/dashboard-atoms";

const Navbar = () => {
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState<string | undefined>();
  const [budget, setBudget] = useState<number | undefined>();

  const setOpenReminders = useSetAtom(showRemindersAtom);

  const { height, width } = useViewportSize();

  const router = useRouter();

  const getUser = async () => {
    const supabase = createClient();

    const { data: userInfo } = await supabase.from("users").select();

    if (userInfo) {
      setName(userInfo[0].full_name);
      setBudget(userInfo[0].monthly_budget);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    router.push("/login");
  };

  return (
    <nav className="bg-white border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-4 px-6 md:px-10">
        <Link
          href="/"
          className="text-3xl font-bold text-[#fac01d]"
          color="gold"
        >
          Scrooge
        </Link>

        {width > 550 ? (
          <Group gap="xl">
            <UpdateBudgetModal currentName={name} currentBudget={budget} />
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
          </Group>
        ) : (
          <Burger opened={opened} onClick={() => setOpened((o) => !o)} />
        )}
      </div>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        size="sm"
        title="Actions"
      >
        <DrawerBody pt="lg">
          <UpdateBudgetModal currentName={name} currentBudget={budget} />
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
        </DrawerBody>
      </Drawer>
    </nav>
  );
};

export default Navbar;
