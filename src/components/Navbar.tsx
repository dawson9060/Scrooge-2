"use client";

import {
  Burger,
  Drawer,
  DrawerBody,
  Group,
  NavLink,
  Text,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { UpdateBudgetModal } from "./Modals/UpdateBudgetModal";

const Navbar = () => {
  // const [createProfileOpened , { open: onCreateOpen, close: onCreateClose }] = useDisclosure(false);
  // const [authOpened , { open: onAuthOpen, close: onAuthClose }] = useDisclosure(false);
  // TODO - User does not need to be in state? Navbar will always have a logged in user
  const [user, setUser] = useState<User>();
  const [opened, setOpened] = useState(false);

  const { height, width } = useViewportSize();

  const router = useRouter();

  const getUser = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      console.log("error", error);
    } else {
      console.log("setting user", data.user);
      setUser(data.user);
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

  console.log("user in Navbar", user);

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

        {width > 450 ? (
          <Group gap="xl">
            <UpdateBudgetModal />
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
          <UpdateBudgetModal />
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
