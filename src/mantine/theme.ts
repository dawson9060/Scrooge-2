import { createTheme, MantineColorsTuple } from "@mantine/core";

const gold: MantineColorsTuple = [
  "#fff9e0",
  "#fff2cb",
  "#fee49b",
  "#fcd566",
  "#fbc83a",
  "#fac01d",
  "#fabb08",
  "#dfa400",
  "#c69200",
  "#ac7d00",
];

export const theme = createTheme({
  fontFamily: "Poppins, serif",
  colors: { gold },
});
