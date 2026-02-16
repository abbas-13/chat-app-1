import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const debounce = <T extends unknown[]>(
  callback: (...args: T) => void | Promise<void>,
  delay: number,
) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const formatConvoDate = (dateString: string): string => {
  const messageDate = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDay = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate(),
  );

  const timeDiff = now.getTime() - messageDate.getTime();
  if (
    timeDiff < 24 * 60 * 60 * 1000 &&
    messageDay.getTime() === today.getTime()
  ) {
    return messageDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const daysDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
  if (daysDiff <= 6) {
    const days = [
      "Yesterday",
      "Saturday",
      "Friday",
      "Thursday",
      "Wednesday",
      "Tuesday",
    ];
    return days[daysDiff - 1];
  }

  return messageDate
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "/");
};
