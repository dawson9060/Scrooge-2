"use client";

import { updateBudget } from "@/actions/budget";
import {
  addRecurringExpense,
  deleteRecurringExpense,
} from "@/actions/recurringExpense";
import { surplusAtom } from "@/atoms/dashboard-atoms";
import { EXPENSE_MAP, EXPENSE_UTILITY } from "@/enums/ExpenseTypes";
import { RecurringExpense, Reminder, User } from "@/types/app";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Transition,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm as useMantineForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendarWeek,
  IconChartPie3,
  IconCirclePlus,
} from "@tabler/icons-react";
import { useSetAtom } from "jotai";
import { Trash2 } from "lucide-react";
import { useEffect, useMemo, useOptimistic, useState } from "react";
import CountUp from "react-countup";
import { useFormStatus } from "react-dom";
import Calendar from "./Calendar";
import RecurringExpenseChart from "./Charts/RecurringExpenseChart";
import { SlideDownWrapper } from "./common/SlideDownWrapper";

export type Action = "delete" | "update" | "create";
export type ExpenseOptimisticUpdate = (action: {
  action: Action;
  expense: RecurringExpense;
}) => void;

interface ExpenseProps {
  expenses: RecurringExpense[] | null;
  reminders: Reminder[] | null;
  user: User;
}

interface ReducerProps {
  action: Action;
  expense: RecurringExpense;
}

interface CountProps {
  number: number;
  title: string;
  duration: number;
  color: string;
}

const recurringReducer = (
  state: RecurringExpense[],
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

const MantineFormContent = ({ form }: any) => {
  const { pending } = useFormStatus();

  return (
    <Group gap={0}>
      <TextInput
        name="expense"
        key={form.key("expense_name")}
        {...form.getInputProps("expense_name")}
        placeholder="Expense Name&#42;"
        className="w-full md:w-[250px]"
        required
      />
      <NumberInput
        key={form.key("amount")}
        {...form.getInputProps("amount")}
        name="amount"
        min={1}
        clampBehavior="strict"
        prefix="$"
        placeholder="Amount&#42;"
        required
        className="w-[50%] mt-2 pr-2 md:mt-0 md:pl-2 md:w-[150px]"
        hideControls
      />
      <DateInput
        key={form.key("day")}
        {...form.getInputProps("day")}
        valueFormat="DD"
        placeholder="Optional Day"
        clearable
        defaultValue={null}
        className="w-[50%] mt-2 md:mt-0 md:mr-2 md:w-[135px]"
      />
      <Select
        name="type"
        key={form.key("type")}
        {...form.getInputProps("type")}
        placeholder="Pick value"
        data={Object.keys(EXPENSE_MAP)}
        defaultValue={EXPENSE_UTILITY}
        allowDeselect={false}
        // TODO - THIS SHOULD NOT NEED TO BE SEARCHABLE TO WORK
        searchable
        className="w-full mt-2 md:mt-0 md:w-[160px]"
      />
      <Box className="md:ml-2 w-full md:w-fit mt-2 md:mt-0">
        <Button type="submit" bg="gold.5" fullWidth loading={pending}>
          <IconCirclePlus />
        </Button>
      </Box>
    </Group>
  );
};

const UpdateBudgetModal = ({ user }: { user: User }) => {
  const [error, setError] = useState<string | undefined>();
  const [monthlyBudget, setMonthlyBudget] = useState<number | undefined>();

  useEffect(() => {
    setMonthlyBudget(user?.monthly_budget);
  }, [user]);

  const [opened, handlers] = useDisclosure(false);

  const handleUpdateBudget = async () => {
    if (monthlyBudget && monthlyBudget > 0) {
      await updateBudget(monthlyBudget);

      setError("");

      handlers.close();
    } else {
      setError("Please provide a valid budget");
    }
  };

  return (
    <>
      <Button variant="light" c="blue" fw="normal" onClick={handlers.open}>
        Update Budget
      </Button>
      <Modal opened={opened} onClose={handlers.close} title="Update User Info">
        <NumberInput
          hideControls
          value={monthlyBudget}
          prefix="$"
          placeholder="Monthly Budget;"
          onChange={(val) => setMonthlyBudget(val as number)}
        />
        {error && (
          <Text size="sm" c="red">
            {error}
          </Text>
        )}

        <Group mt={20} justify="flex-end" gap="xs">
          <Button bg="gray" onClick={handlers.close}>
            Close
          </Button>
          <Button bg="gold" onClick={handleUpdateBudget}>
            Submit
          </Button>
        </Group>
      </Modal>
    </>
  );
};

const AddRecurringForm = ({
  optimisticUpdate,
  user,
}: {
  optimisticUpdate: ExpenseOptimisticUpdate;
  user: User;
}) => {
  const [showForm, setShowForm] = useState<boolean>(false);

  const form = useMantineForm({
    mode: "uncontrolled",
    initialValues: {
      expense_name: "",
      amount: null,
      day: "",
      type: EXPENSE_UTILITY,
    },

    // validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    // },
  });

  const handleAddExpense = async (data: any) => {
    // add fake data temporarily
    const newExpense: RecurringExpense = {
      id: -1,
      created_at: "",
      user_id: "",
      day: "1",
      amount: Number(String(data.amount).substring(1)),
      type: data.type as string,
      expense_name: data.expense as string,
    };

    optimisticUpdate({ action: "create", expense: newExpense });

    await addRecurringExpense(data);

    form.reset();
  };

  return (
    <>
      <Group justify="space-between" mb="sm">
        <Text size="1.5rem">Monthly Expenses</Text>
        <Group>
          <UpdateBudgetModal user={user} />
          <Button
            variant="light"
            c="blue"
            fw="normal"
            w="70px"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Hide" : "Add"}
          </Button>
        </Group>
      </Group>
      <SlideDownWrapper isOpen={showForm}>
        <form onSubmit={form.onSubmit(handleAddExpense)}>
          <MantineFormContent form={form} />
        </form>
      </SlideDownWrapper>
    </>
  );
};

const ExpenseItem = ({
  expense,
  optimisticUpdate,
}: {
  expense: RecurringExpense;
  optimisticUpdate: ExpenseOptimisticUpdate;
}) => {
  const handleDelete = async () => {
    optimisticUpdate({ action: "delete", expense });

    await deleteRecurringExpense(expense.id);
  };

  return (
    <Group
      className="overflow-hidden shadow-md lg:w-[49%] w-full rounded-md bg-white px-3 py-2 relative transition-all"
      justify="space-between"
      wrap="nowrap"
    >
      <Box
        className="w-3 h-full absolute left-0 rounded-tl-md rounded-bl-md"
        bg={EXPENSE_MAP[expense.type]}
      />
      <Text w="60%" pl={8}>
        {expense.expense_name}
      </Text>
      <Text w="20%">${expense.amount}</Text>
      <ActionIcon variant="transparent" color="black" size="30px">
        <Trash2 onClick={() => handleDelete()} />
      </ActionIcon>
    </Group>
  );
};

const CountWrapper = ({ number, title, duration, color }: CountProps) => {
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
        style={{ color: color, minWidth: "65px" }}
        end={number}
        duration={duration}
        formattingFn={(num) => "$" + num.toLocaleString()}
      />
    </Group>
  );
};

const SummarySection = ({
  expenses,
  user,
}: {
  expenses: RecurringExpense[] | null;
  user: User;
}) => {
  const [mounted, setMounted] = useState<boolean>(false);

  const setSurplus = useSetAtom(surplusAtom);

  const { total, surplus } = useMemo(() => {
    let total = 0;
    expenses?.forEach((expense) => (total += expense.amount ?? 0));

    return { total, surplus: user.monthly_budget - total };
  }, [expenses, user]);

  useEffect(() => setMounted(true), []);
  useEffect(() => setSurplus(surplus), [surplus]);

  return (
    <Group className="bg-white rounded-md w-full p-4" mih={60}>
      <Transition
        mounted={mounted}
        transition="fade-right"
        duration={700}
        timingFunction="ease"
      >
        {(styles) => (
          <Box
            style={styles}
            className="gap-3 sm:gap-0 w-full flex flex-row flex-wrap justify-center md:justify-start md:gap-8"
          >
            <CountWrapper
              number={user.monthly_budget}
              title="Budget"
              duration={1}
              color={"black"}
            />
            <CountWrapper
              number={total}
              title="Expenses"
              duration={2}
              color={"red"}
            />
            <CountWrapper
              number={surplus}
              title="Excess"
              duration={3}
              color={"green"}
            />
          </Box>
        )}
      </Transition>
    </Group>
  );
};

const ChartDisplaySection = ({
  expenses,
  reminders,
}: {
  expenses: RecurringExpense[] | null;
  reminders: Reminder[] | null;
}) => {
  const CHART = "chart";
  const CALENDAR = "calendar";

  const [selectedVisual, setSelectedVisual] = useState<string>(CHART);

  return (
    <Box className="min-h-96 w-full bg-white rounded-lg">
      <Group className="w-full" justify="center">
        <Group gap={0} w={150}>
          <ActionIcon
            w="50%"
            p="md"
            onClick={() => setSelectedVisual(CHART)}
            color={selectedVisual === CHART ? "gold" : "#f0f2f2"}
            style={{ borderRadius: "0", borderBottomLeftRadius: "8px" }}
          >
            <IconChartPie3 color="black" />
          </ActionIcon>
          <ActionIcon
            w="50%"
            p="md"
            onClick={() => setSelectedVisual(CALENDAR)}
            color={selectedVisual === CALENDAR ? "gold" : "#f0f2f2"}
            style={{ borderRadius: "0", borderBottomRightRadius: "8px" }}
          >
            <IconCalendarWeek color="black" />
          </ActionIcon>
        </Group>
      </Group>
      {selectedVisual === CHART ? (
        <RecurringExpenseChart expenses={expenses} />
      ) : (
        <Calendar expenses={expenses} reminders={reminders} />
      )}
    </Box>
  );
};

export function RecurringExpenses({ expenses, user, reminders }: ExpenseProps) {
  const [optimisticExpenses, optimisticExpensesUpdate] = useOptimistic(
    expenses ?? [],
    recurringReducer
  );

  return (
    <Stack gap={0}>
      <AddRecurringForm
        optimisticUpdate={optimisticExpensesUpdate}
        user={user}
      />
      <Stack
        style={{ width: "100%" }}
        gap="md"
        mt="sm"
        className="bg-slate-100 rounded-md p-4 shadow-lg"
        align="flex-start"
      >
        <SummarySection expenses={expenses} user={user} />
        <Group
          w="100%"
          justify="space-between"
          pb="lg"
          mah="500px"
          className="overflow-y-auto"
        >
          {optimisticExpenses?.map((expense) => (
            <ExpenseItem
              expense={expense}
              key={expense.id}
              optimisticUpdate={optimisticExpensesUpdate}
            />
          ))}
        </Group>
        <ChartDisplaySection expenses={expenses} reminders={reminders} />
      </Stack>
    </Stack>
  );
}

export default RecurringExpenses;
