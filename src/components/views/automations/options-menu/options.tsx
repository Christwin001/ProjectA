import { Checkbox } from "@/components/ui/checkbox";
import { Box } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { LuCheck } from "react-icons/lu";

type OptionProps<T> = {
  item: T;
  isSelected?: boolean;
  onSelect(e?: any): void;
  renderItem?: (item: T) => ReactNode;
};

export function OptionMenuSingleOption<T>(props: OptionProps<T>) {
  const { item, onSelect, isSelected, renderItem } = props;

  return (
    <Box
      as="button"
      py="0.5rem"
      px="0.75rem"
      width="100%"
      display="flex"
      cursor="pointer"
      textAlign="left"
      onClick={onSelect}
      alignItems="center"
      _hover={{ bg: "bg.muted" }}
      justifyContent="space-between"
    >
      {renderItem?.(item)}
      {isSelected && <LuCheck />}
    </Box>
  );
}

export function OptionMenuMultiOption<T>(props: OptionProps<T>) {
  const { item, onSelect, isSelected, renderItem } = props;

  const [isChecked, setIsChecked] = useState(isSelected ?? false);

  useEffect(() => {
    setIsChecked(isSelected ?? false);
  }, [isSelected]);

  return (
    <Box
      as="button"
      py="0.5rem"
      px="0.75rem"
      width="100%"
      display="flex"
      textAlign="left"
      alignItems="center"
      _hover={{ bg: "bg.muted" }}
      justifyContent="space-between"
    >
      {renderItem?.(item)}
      <Checkbox size="sm" checked={isChecked} onCheckedChange={onSelect} />
    </Box>
  );
}
