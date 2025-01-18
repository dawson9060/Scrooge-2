import Navbar from "@/components/Navbar";
import { Group, Text } from "@mantine/core";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Group
        bg="gold"
        className="min-w-full font-normal py-3 mt-10"
        justify="center"
      >
        <Text fw="normal" c="black">
          Scrooge 2024
        </Text>
      </Group>
    </>
  );
}
