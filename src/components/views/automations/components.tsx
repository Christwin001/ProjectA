"use client";

import { Box, Icon, Stack, StackProps, Text } from "@chakra-ui/react";
import React from "react";
import { RuleTemplateItem } from "simpu-api-sdk";

export type RuleMenuListOptionProps = {
  label: string;
  value?: string;
};

const RuleMenuListOption = ({
  onSelect,
  ...rest
}: RuleTemplateItem & {
  onSelect(): void;
}) => {
  return (
    <Box
      px="1rem"
      as="button"
      width="100%"
      height="2rem"
      rounded="8px"
      textAlign="left"
      onClick={onSelect}
      _hover={{ bg: "bg.muted" }}
      _disabled={{
        opacity: 0.5,
        bg: "transparent",
        pointerEvents: "none",
        cursor: "not-allowed",
      }}
    >
      <Text textStyle="xs">{rest.name}</Text>
    </Box>
  );
};

const RuleMenuListTitle = ({
  label,
  icon,
  ...rest
}: { label: string; icon: string } & StackProps) => {
  return (
    <Stack direction="row" alignItems="center" {...rest}>
      {/* <Icon size="lg" color="red.900">
        {icon}
      </Icon> */}
      <Text textTransform="capitalize" fontWeight="bold">
        {label}
      </Text>
    </Stack>
  );
};

const RuleMenuList = ({
  label,
  icon,
  options,
  onSelectItem,
}: {
  label: string;
  icon: string;
  options: RuleTemplateItem[];
  onSelectItem(item: RuleTemplateItem): void;
}) => {
  return (
    <Box>
      <RuleMenuListTitle pb="1rem" label={label} icon={icon} />
      {
        <Stack>
          {options.map((option, index) => (
            <RuleMenuListOption
              key={`${index}`}
              onSelect={() => onSelectItem(option)}
              {...option}
            />
          ))}
        </Stack>
      }
    </Box>
  );
};

export { RuleMenuList, RuleMenuListTitle, RuleMenuListOption };
