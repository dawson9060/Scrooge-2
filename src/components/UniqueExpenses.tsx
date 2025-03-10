"use client";

import {
  addUniqueExpense,
  deleteUniqueExpense,
} from "@/actions/uniqueExpenses";
import { UniqueExpense } from "@/types/app";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  NumberInput,
  Popover,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { MonthPicker } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { useForm } from "@mantine/form";
import { IconCirclePlus, IconDownload } from "@tabler/icons-react";
import { Trash2 } from "lucide-react";
import { useMemo, useOptimistic, useState } from "react";
import CountUp from "react-countup";
import { useFormStatus } from "react-dom";
import { jsonToCSV } from "react-papaparse";
import {
  getFirstDayInMonth,
  getLastDayInMonth,
} from "../../utils/utilityFunctions";
import UniqueExpenseChart from "./Charts/UniqueExpenseCharts";

export type Action = "delete" | "update" | "create";
export type ExpenseOptimisticUpdate = (action: {
  action: Action;
  expense: UniqueExpense;
}) => void;

interface ExpenseProps {
  expenses: UniqueExpense[] | null;
}

interface ReducerProps {
  action: Action;
  expense: UniqueExpense;
}

export const uniqueReducer = (
  state: UniqueExpense[],
  { action, expense }: ReducerProps
) => {
  switch (action) {
    case "delete":
      return state.filter(({ id }) => id !== expense.id);
    case "update":
      return state.map((e) => (e.id === expense.id ? expense : e));
    case "create":
      return [...state, expense];
    default:
      return state;
  }
};

const FormContent = ({ form }: any) => {
  const { pending } = useFormStatus();

  return (
    <Group gap={0}>
      <TextInput
        key={form.key("expense")}
        {...form.getInputProps("expense")}
        name="expense"
        required
        className="w-full mb-2 md:mb-0 md:w-[250px]"
        placeholder="Expense Name"
      />
      <NumberInput
        key={form.key("amount")}
        {...form.getInputProps("amount")}
        name="amount"
        required
        min={1}
        prefix="$"
        clampBehavior="strict"
        className="w-1/2 pr-2 md:px-2 md:w-[150px]"
        hideControls
        placeholder="Amount"
      />
      <Select
        key={form.key("type")}
        {...form.getInputProps("type", { type: "select" })}
        name="type"
        placeholder="Pick value"
        data={["expense", "deposit"]}
        className="w-1/2 md:w-[160px]"
      />
      <Box className="w-full mt-2 md:pt-0 md:ml-2 md:mt-0 md:w-fit">
        <Button bg="gold" type="submit" fullWidth loading={pending}>
          <IconCirclePlus />
        </Button>
      </Box>
    </Group>
  );
};

const AddForm = ({
  optimisticUpdate,
}: {
  optimisticUpdate: ExpenseOptimisticUpdate;
}) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      expense: "",
      amount: null,
      type: "expense",
    },

    // validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    // },
  });

  const handleAddExpense = async (data: any) => {
    const newExpense: UniqueExpense = {
      id: -1,
      created_at: "",
      user_id: "",
      type: data.type,
      amount: Number(data.amount ?? 0),
      expense_name: data.expense,
    };

    optimisticUpdate({ action: "create", expense: newExpense });

    await addUniqueExpense(data);

    form.reset();
  };

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleAddExpense)}>
        <FormContent form={form} />
      </form>
    </Box>
  );
};

const CountWrapper = ({
  number,
  title,
  duration,
}: {
  number: number;
  title: string;
  duration: number;
}) => {
  return (
    <Group
      gap="2"
      miw={170}
      style={{ fontSize: "18px" }}
      justify="center"
      wrap="nowrap"
      className=""
    >
      <Text size="18px">{title}:</Text>
      <CountUp
        end={number}
        style={{ minWidth: "65px" }}
        duration={duration}
        enableScrollSpy
        scrollSpyOnce
        formattingFn={(num) => "$" + num.toLocaleString()}
      />
    </Group>
  );
};

const ExpenseStats = ({ expenses }: ExpenseProps) => {
  const { totalExpenses, largestExpense } = useMemo(() => {
    let total = 0;
    let largest = 0;

    expenses?.forEach((expense) => {
      if (expense.type === "expense" && expense.amount > largest) {
        largest = expense.amount;
      }

      if (expense.type === "expense") {
        total += expense.amount;
      } else {
        total -= expense.amount;
      }
    });

    return { totalExpenses: total, largestExpense: largest };
  }, [expenses]);

  return (
    <Group className="bg-white rounded-md w-full p-4" mih={60}>
      <Box className="gap-2 sm:gap-0 w-full flex flex-row flex-wrap justify-center md:justify-start md:gap-4">
        <CountWrapper number={totalExpenses} title="Total" duration={1} />
        <CountWrapper number={largestExpense} title="Largest" duration={2} />
      </Box>
    </Group>
  );
};

const TransactionItem = ({
  expense,
  optimisticUpdate,
}: {
  expense: UniqueExpense;
  optimisticUpdate: ExpenseOptimisticUpdate;
}) => {
  const handleDelete = async () => {
    optimisticUpdate({ action: "delete", expense });

    await deleteUniqueExpense(expense.id);
  };

  return (
    <Group
      className="w-full lg:w-[49%] overflow-hidden shadow-md p-2 rounded-md bg-white relative transition-all"
      justify="space-between"
      wrap="nowrap"
    >
      <Box
        className="w-3 h-full absolute left-0 rounded-tl-md rounded-bl-md"
        bg={expense.type === "expense" ? "red" : "green"}
      />
      <Group className="flex-wrap sm:flex-nowrap w-full ml-4">
        <Text className="w-full sm:w-auto sm:flex-1">
          {expense.expense_name}
        </Text>
        <Text className="w-[70px]">${expense.amount}</Text>
        <Text className="w-[70px]">
          {new Date(expense.created_at).toLocaleDateString()}
        </Text>
      </Group>
      <Box className="h-full flex-col justify-center align-middle">
        <ActionIcon variant="transparent" color="black" size="30px">
          <Trash2 onClick={() => handleDelete()} />
        </ActionIcon>
      </Box>
    </Group>
  );
};

const DatePickerPopover = ({
  selectedRange,
  setSelectedRange,
}: {
  selectedRange: [Date, Date];
  setSelectedRange: Function;
}) => {
  let date = selectedRange[0].toLocaleString("default", { month: "long" });
  if (selectedRange[1])
    date +=
      " - " + selectedRange[1].toLocaleString("default", { month: "long" });

  return (
    <Popover width={200} position="bottom-end" withArrow shadow="md">
      <Popover.Target>
        <Button fw="normal" bg="gold">
          {date}
        </Button>
      </Popover.Target>
      <Popover.Dropdown miw={300}>
        <Group justify="center" align="center">
          <MonthPicker
            maxDate={new Date()}
            type="range"
            value={selectedRange}
            onChange={(val) => setSelectedRange(val)}
          />
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
};

export function UniqueExpenses({ expenses }: ExpenseProps) {
  const [optimisticExpenses, optimisticUpdate] = useOptimistic(
    expenses ?? [],
    uniqueReducer
  );
  const [selectedRange, setSelectedRange] = useState<[Date, Date | null]>([
    new Date(),
    null,
  ]);

  const expensesInRange = useMemo(() => {
    const start = getFirstDayInMonth(selectedRange[0]);
    const end = getLastDayInMonth(selectedRange[1] ?? selectedRange[0]);

    // TODO - remove these after we're sure this all works
    const startMilli = start.getTime();
    const endMilli = end.getTime();

    return expenses?.filter((expense) => {
      const creationMilli = new Date(expense.created_at).getTime();
      return creationMilli >= startMilli && creationMilli <= endMilli;
    });
  }, [expenses, selectedRange]);

  // TODO - MOVE THIS INTO DATE PICKER COMPONENT
  const handleSelect = (range: [Date, Date]) => {
    if (!range[0]) {
      setSelectedRange([new Date(), null]);
    } else {
      setSelectedRange(range);
    }
  };

  const handleDownload = () => {
    const formattedExpenses = expensesInRange?.map((expense) => {
      return {
        Amount: expense.amount,
        Type: expense.type,
        Name: expense.expense_name,
        Date: new Date(expense.created_at).toLocaleDateString(),
      };
    });

    if (formattedExpenses) {
      const csvString = jsonToCSV(formattedExpenses);

      const file = new Blob([csvString], { type: "text/csv" });
      const a = document.createElement("a");

      a.download = "expenses";
      a.href = URL.createObjectURL(file);
      a.addEventListener("click", (e) => {
        setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
      });

      a.click();
    }
  };

  return (
    <Stack mt={60}>
      <Group className="w-full" justify="space-between">
        <Text size="1.75rem">Unique Expenses</Text>
        <Group gap="md">
          <DatePickerPopover
            // @ts-ignore
            selectedRange={selectedRange}
            setSelectedRange={(val: [Date, Date]) => handleSelect(val)}
          />
          <Button bg="gold" onClick={handleDownload}>
            <IconDownload />
          </Button>
        </Group>
      </Group>
      <AddForm optimisticUpdate={optimisticUpdate} />
      <Stack
        style={{ width: "100%" }}
        gap="md"
        className="bg-slate-100 rounded-md p-4 shadow-lg"
        align="flex-start"
      >
        <ExpenseStats expenses={expensesInRange ?? []} />
        <Group w="100%" wrap="wrap" pb="lg">
          {expensesInRange?.map((expense) => (
            <TransactionItem
              expense={expense}
              key={expense.id}
              optimisticUpdate={optimisticUpdate}
            />
          ))}
        </Group>
        <UniqueExpenseChart
          expenses={expensesInRange ?? []}
          selectedRange={selectedRange}
        />
      </Stack>
    </Stack>
  );
}

export default UniqueExpenses;
