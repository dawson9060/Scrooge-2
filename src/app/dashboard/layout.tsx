import Navbar from "@/components/Navbar";
import { Group, Stack, Text } from "@mantine/core";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack gap={0}>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <Group
        bg="gold"
        className="min-w-full font-normal py-3 mt-10"
        justify="center"
      >
        <Text fw="normal" c="black">
          Scrooge {new Date().getFullYear()} ©
        </Text>
      </Group>
    </Stack>
  );
}
