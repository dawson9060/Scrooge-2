import { Button, Group, Popover } from "@mantine/core";
import { MonthPicker } from "@mantine/dates";
import "@mantine/dates/styles.css";

export const DatePickerPopover = ({
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
