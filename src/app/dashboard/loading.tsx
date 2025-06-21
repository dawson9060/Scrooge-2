import { Loader, Skeleton, Stack } from "@mantine/core";

const Loading = () => {
  return (
    <Stack className="max-w-screen-xl min-h-screen overflow-x-hidden w-full mx-auto px-6 md:px-10">
      <Skeleton height={130} w="full" mt={180} />
      <Skeleton height={800} w="full" mb="xl" />
      <Skeleton height={800} w="full" mb="xl" />
    </Stack>
  );
};

export default Loading;
