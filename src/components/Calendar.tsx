"use client";

import { deleteRecurringExpense } from "@/actions/recurringExpense";
import { addReminder, deleteReminder } from "@/actions/reminders";
import { EXPENSE_MAP } from "@/enums/ExpenseTypes";
import { RecurringExpense, Reminder } from "@/types/app";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import {
  Box,
  Button,
  Group,
  Input,
  Modal,
  ModalBody,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";
import {
  formatNumber,
  getCalendarDate,
  getFirstDayInMonth,
} from "../../utils/utilityFunctions";

interface AddReminderProps {
  date: string | undefined;
  opened: boolean;
  open: Function;
  close: any;
}

interface ViewModalProps {
  event: {
    title: string;
    extendedProps: {
      type: string;
      reminderId: number;
      expenseId: number;
      reminderDate: string;
      amount: number;
    };
  };
  opened: boolean;
  open: Function;
  close: any;
}

const EVENT = "event";
const REMINDER = "reminder";

const AddReminderModal = ({ date, opened, open, close }: AddReminderProps) => {
  const handleSave = async (data: FormData) => {
    close();

    await addReminder(data);
  };

  return (
    <Modal opened={opened} onClose={close} title="Add Reminder">
      <form action={(data) => handleSave(data)}>
        <ModalBody>
          <Stack gap="lg">
            <Stack gap="xs">
              <Text>Reminder Date: {date}</Text>
              <TextInput placeholder="Reminder Name" name="name" />
            </Stack>
            <Input type="hidden" name="date" value={date} />
          </Stack>
        </ModalBody>
        <Group justify="flex-end" gap="xs">
          <Button onClick={close} bg="gray">
            Close
          </Button>
          <Button type="submit" bg="gold">
            Save
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

const ViewEventModal = ({ event, opened, open, close }: ViewModalProps) => {
  const type = event?.extendedProps.type;

  const handleReminderDelete = async () => {
    close();

    await deleteReminder(event?.extendedProps?.reminderId);
  };

  const handleExpenseDelete = async () => {
    close();

    await deleteRecurringExpense(event?.extendedProps?.expenseId);
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={type === REMINDER ? "Scheduled Reminder" : "Recurring Expense"}
    >
      <ModalBody>
        {type === REMINDER ? (
          <Stack gap="sm">
            <Text>Reminder Date: {event?.extendedProps?.reminderDate}</Text>
            <Text>Reminder Name: {event?.title} </Text>
          </Stack>
        ) : (
          <Stack gap="sm">
            <Text>Expense Name: {event?.title}</Text>
            <Text>
              Expense Amount: ${formatNumber(event?.extendedProps?.amount)}
            </Text>
          </Stack>
        )}
      </ModalBody>
      <Group justify="flex-end" gap="xs">
        <Button onClick={close} bg="gray">
          Close
        </Button>
        <Button
          onClick={
            type === REMINDER ? handleReminderDelete : handleExpenseDelete
          }
          bg="gold"
        >
          Delete
        </Button>
      </Group>
    </Modal>
  );
};

const Calendar = ({
  expenses,
  reminders,
}: {
  expenses: RecurringExpense[] | null;
  reminders: Reminder[] | null;
}) => {
  const mappedExpenses = useMemo(() => {
    return expenses?.map((item: RecurringExpense) => {
      return {
        title: item.expense_name,
        date: getCalendarDate(item.day),
        backgroundColor: EXPENSE_MAP[item.type],
        amount: item.amount,
        expenseId: item.id,
        type: EVENT,
      };
    });
  }, [expenses]);

  console.log("MAPPED EXPENSES", mappedExpenses);

  const mappedReminders = useMemo(() => {
    return reminders?.map((reminder) => {
      return {
        title: reminder.name,
        date: reminder.date,
        backgroundColor: "#ad0000",
        type: REMINDER,
        reminderDate: reminder.date,
        reminderId: reminder.id,
      };
    });
  }, [reminders]);

  const [activeData, setActiveData] = useState([
    ...(mappedExpenses ?? []),
    ...(mappedReminders ?? []),
  ]);
  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedEvent, setSelectedEvent] = useState<object | undefined>();

  const [addReminderOpened, { open: addOpen, close: addClose }] =
    useDisclosure(false);
  const [viewModalOpened, { open: viewOpen, close: viewClose }] =
    useDisclosure(false);

  useEffect(() => {
    setActiveData([...(mappedExpenses ?? []), ...(mappedReminders ?? [])]);
  }, [mappedExpenses, mappedReminders]);

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    addOpen();
  };

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
    viewOpen();
  };

  return (
    <Box w="100%" p="lg">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        validRange={(nowDate) => {
          return {
            start: getFirstDayInMonth(new Date()),
            // end: dayjs(firstDayInMonth).add(1, 'month').format('YYYY-MM-DD'),
          };
        }}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={activeData}
      />
      <AddReminderModal
        date={selectedDate}
        opened={addReminderOpened}
        open={addOpen}
        close={addClose}
      />
      <ViewEventModal
        // @ts-ignore
        event={selectedEvent}
        opened={viewModalOpened}
        open={viewOpen}
        close={viewClose}
      />
    </Box>
  );
};

export default Calendar;
