"use client";

import { Box, Group, Text } from "@mantine/core";

import classes from "./ScrollingText.module.css";

export const ScrollingText = () => {
  const scroogeSayings = [
    "You don't really need three meals a day. Or two",
    "These sayings may seem unnecessary, but so was your last purchase",
    "Fun is temporary, money is eternal",
    "Chase your dreams, but not with my money",
  ];

  return (
    <Group w="100%" data-animated="true" className={`scroll ${classes.scroll}`}>
      <Box className={classes.tagList}>
        {scroogeSayings.concat(scroogeSayings).map((saying, index) => (
          <Box key={index}>
            <Text>{saying}</Text>
          </Box>
        ))}
      </Box>
    </Group>
  );
};
