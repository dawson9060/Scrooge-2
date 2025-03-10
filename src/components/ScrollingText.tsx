"use client";

import { Box, Group, Text } from "@mantine/core";

import classes from "./ScrollingText.module.css";
import { useEffect } from "react";

export const ScrollingText = () => {
  const scroogeSayings = [
    "You know what's good for wallet and waist? Eating 1 meal a day, tops",
    "That last purchase of yours? Probably unecessary",
    "Fun is temporary, money is eternal",
  ];

  //   useEffect(() => {
  //     if (typeof document !== "undefined") {
  //       const scrollers = document.querySelectorAll(".scroll");

  //       if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  //         scrollers.forEach((scroller) => {
  //           scroller.setAttribute("data-animated", "true");
  //         });
  //       }
  //     }
  //   }, []);

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
