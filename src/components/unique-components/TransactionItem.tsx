import { selectedUniqueExpenseAtom } from "@/atoms/dashboard-atoms";
import { UniqueExpense } from "@/types/app";
import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { IconEdit } from "@tabler/icons-react";
import { useSetAtom } from "jotai";
import { motion } from "motion/react";
import React from "react";

/* HEIGHT ANIMATION NOTES
 - We need 2 divs - the outer one is for height animation, and the inner one is for the actual content
 - Margins and gaps are not automatically animated with height. Either animate them explicitly, or use a wrapper padding div to simulate them.
 - If using a component, make sure to forward the ref.
 - Items inside AnimatePresence must have keys.
*/

export const TransactionItem = React.forwardRef(
  (
    { expense }: { expense: UniqueExpense },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const setSelectedUniqueExpense = useSetAtom(selectedUniqueExpenseAtom);

    const { colorScheme } = useMantineColorScheme();

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full"
      >
        <Box
          className="py-1 cursor-pointer"
          onClick={() => setSelectedUniqueExpense(expense)}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
              scale: 0.98,
              filter: "blur(4px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.98,
              filter: "blur(4px)",
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="w-full flex flex-row overflow-hidden items-center shadow-md rounded-md pr-2 relative transition-all"
            style={{
              backgroundColor:
                colorScheme === "light"
                  ? "white"
                  : "var(--mantine-color-dark-5)",
            }}
          >
            <Box
              className="w-3 h-[40px] opacity-50"
              bg={expense.type === "expense" ? "red" : "green"}
            />
            <Box className="pl-2 flex flex-grow">
              <Text>{expense.expense_name}</Text>
            </Box>
            <Box w={80}>
              <Text c={expense.type === "expense" ? "red" : "green"}>
                ${expense.amount}
              </Text>
            </Box>
            <Box w={130} mr="md" className="hidden sm:block">
              <Box w={130} className="flex flex-row justify-between">
                <Divider orientation="vertical" h="24px" />
                <Text>{new Date(expense.user_date).toLocaleDateString()}</Text>
                <Divider orientation="vertical" h="24px" />
              </Box>
            </Box>

            <Group justify="center">
              <ActionIcon
                variant="transparent"
                color={colorScheme === "light" ? "black" : "dark.0"}
                size={30}
              >
                <IconEdit />
              </ActionIcon>
            </Group>
          </motion.div>
        </Box>
      </motion.div>
    );

    // return (
    //   <motion.div
    //     ref={ref}
    //     layout
    //     initial={{ opacity: 0 }}
    //     animate={{ opacity: 1 }}
    //     exit={{ opacity: 0 }}
    //     key={expense.id ?? -1}
    //     className="w-full flex flex-row justify-between flex-nowrap lg:w-[49%] overflow-hidden shadow-md p-2 rounded-md bg-white relative transition-all"
    //   >
    //     <Box
    //       className="w-3 h-full absolute left-0 rounded-tl-md rounded-bl-md"
    //       bg={expense.type === "expense" ? "red" : "green"}
    //     />
    //     <Group className="flex-wrap sm:flex-nowrap w-full ml-4">
    //       <Text className="w-full sm:w-auto sm:flex-1">
    //         {expense.expense_name}
    //       </Text>
    //       <Text
    //         className="w-[70px]"
    //         c={expense.type === "expense" ? "red" : "green"}
    //       >
    //         ${expense.amount}
    //       </Text>
    //       <Text className="w-[70px]">
    //         {new Date(expense.created_at).toLocaleDateString()}
    //       </Text>
    //     </Group>
    //     <Box className="h-full flex-col justify-center align-middle">
    //       <ActionIcon variant="transparent" color="black" size="30px">
    //         <Trash2 onClick={handleDelete} />
    //       </ActionIcon>
    //     </Box>
    //   </motion.div>
    // );
  }
);
