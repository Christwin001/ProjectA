"use client";

import { Box, BoxProps, Stack, Text } from "@chakra-ui/react";
import React, { forwardRef } from "react";
import { LuCirclePlus } from "react-icons/lu";

export const AutomationActionButton = forwardRef(
  (props: Omit<BoxProps, "children"> & { label?: string }, ref: any) => {
    const { label, ...rest } = props;

    return (
      <Box
        py={4}
        px={5}
        w="full"
        ref={ref}
        as="button"
        rounded="sm"
        borderWidth="1px"
        borderStyle="dashed"
        transition="all 0.2s"
        _hover={{
          bg: "bg.muted",
        }}
        {...rest}
      >
        <Stack direction="row" alignItems="center">
          <LuCirclePlus />
          <Text textStyle="sm" textTransform="uppercase" fontWeight="semibold">
            {label}
          </Text>
        </Stack>
      </Box>
    );
  }
);

AutomationActionButton.displayName = "RuleActionButton";
