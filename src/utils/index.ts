import { ReadonlyURLSearchParams } from "next/navigation";
import { defaultSystem } from "@chakra-ui/react";

export const createQueryString = (
  searchParams: ReadonlyURLSearchParams,
  params: Record<string, string | number | null>
) => {
  const newSearchParams = new URLSearchParams(searchParams?.toString());

  for (const [key, value] of Object.entries(params)) {
    if (!value) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, String(value));
    }
  }

  return newSearchParams.toString();
};

export const createCategoryColors = (
  categories: string[],
  colors: string[]
) => {
  return Object.fromEntries(
    categories.map((category, index) => {
      const color = getColor(
        colors[index] ? `${colors[index]}.500` : "gray.500"
      );
      return [category, color];
    })
  );
};

export const getColor = (color: string) => {
  if (color.match(/\.[0-9]{2,3}/)) {
    return `var(--chakra-colors-${color.replace(".", "-")})`;
  } else if (defaultSystem.token(`colors.${color}`)) {
    return defaultSystem.token(`colors.${color}`);
  }

  return color;
};

export const numberWithCommas = (x: number | undefined) =>
  x
    ? Number.isInteger(x)
      ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "0";

export const convertSecondsToTime = (seconds: number) => {
  if (!!seconds) {
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    minutes = minutes % 60;

    // 👇️ If you don't want to roll hours over, e.g. 24 to 00
    // 👇️ comment (or remove) the line below
    // commenting next line gets you `24:00:00` instead of `00:00:00`
    // or `36:15:31` instead of `12:15:31`, etc.
    hours = hours % 24;

    if (hours) {
      return `${hours}hr(s)`;
    }
    if (minutes) {
      return `${minutes}min(s)`;
    }
    return `${seconds}s`;
  } else {
    return "0";
  }
};
