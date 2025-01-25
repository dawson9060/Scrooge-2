export const getDaysInMonth = () => {
  let date = new Date();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  return new Date(year, month, 0).getDate();
};

export const getFirstDayInMonth = (date: Date) => {
  const month = date.getMonth();
  const year = date.getFullYear();

  return new Date(year, month, 1);
};

export const getLastDayInMonth = (date: Date) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return new Date(year, month, 0);
};

export const getAllDaysInRange = (start: string, end: string) => {
  const days = new Map();

  const startDate = getFirstDayInMonth(new Date(start));
  const endDate = getLastDayInMonth(new Date(end));

  for (
    const d = new Date(startDate);
    d <= new Date(endDate);
    d.setDate(d.getDate() + 1)
  ) {
    days.set(d.toLocaleDateString(), null);
  }

  return days;
};

export const getCalendarDate = (day: string | null) => {
  const date = new Date();

  const daysInMonth = getDaysInMonth();
  const finalDay = daysInMonth >= Number(day) ? day : getLastDayInMonth(date);

  date.setDate(Number(finalDay));

  return date.toISOString().substring(0, 10);
};

export const getTimeGreeting = (name: string | null) => {
  console.log("NAME", name);
  const date = new Date();
  const hours = date.getHours();

  if (hours > 1 && hours < 12) {
    return `Good Morning, ${name}`;
  } else if (hours >= 12 && hours < 18) {
    return `Good Afternoon, ${name}`;
  }

  return `Good Evening, ${name}`;
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat("en-US").format(number);
};
