import { Box, HStack, Text, useTooltipStyles } from "@chakra-ui/react";
import React from "react";
import {
  NameType,
  ValueType,
  Props,
} from "recharts/types/component/DefaultTooltipContent";

export interface ChartTooltipProps<
  TValue extends ValueType,
  TName extends NameType
> extends Props<TValue, TName> {
  categoryColors: Record<string, string>;
}

export const ChartTooltip = <TValue extends ValueType, TName extends NameType>(
  props: ChartTooltipProps<TValue, TName>
) => {
  const {
    categoryColors,
    contentStyle = {},
    itemStyle = {},
    labelStyle = {},
    payload,
    formatter,
    wrapperClassName,
    labelClassName,
    label,
    labelFormatter,
  } = props;

  //   const tooltipTheme = useTooltipStyles();

  const renderContent = () => {
    if (payload && payload.length) {
      const items = payload.map((entry, i) => {
        if (
          entry.type === "none" ||
          entry.value === undefined ||
          entry.name === undefined
        ) {
          return null;
        }

        const finalFormatter = entry.formatter || formatter;
        const { value, name } = entry;
        let finalValue: React.ReactNode = value;
        let finalName: React.ReactNode = name;
        if (finalFormatter && finalValue != null && finalName != null) {
          const formatted =
            finalFormatter?.(value, name, entry, i, payload) ?? value;
          if (Array.isArray(formatted)) {
            [finalValue, finalName] = formatted;
          } else {
            finalValue = formatted;
          }
        }

        return (
          <HStack
            as="li"
            py={2}
            px={4}
            alignItems="center"
            key={`tooltip-item-${i}`}
            style={itemStyle}
          >
            <Box
              boxSize="2"
              rounded="full"
              bg={categoryColors[entry.name as string] ?? entry.color}
            />
            {finalName ? (
              <Box
                flex="1"
                minWidth="80px"
                color="var(--tooltip-fg-muted, var(--chakra-colors-muted))"
              >
                {finalName}
              </Box>
            ) : null}

            <Box
              textAlign="right"
              fontWeight="medium"
              whiteSpace="nowrap"
              fontVariantNumeric="tabular-nums"
            >
              <span>{finalValue}</span>
              <span>{entry.unit || ""}</span>
            </Box>
          </HStack>
        );
      });

      return <Box as="ul">{items}</Box>;
    }

    return null;
  };

  const hasLabel = !!label;
  let finalLabel = hasLabel ? label : "";

  if (hasLabel && labelFormatter && payload !== undefined && payload !== null) {
    finalLabel = labelFormatter(label, payload);
  }

  return (
    <Box
      bg="bg"
      shadow="md"
      rounded="md"
      textStyle="sm"
      outline="none"
      display="flex"
      flexDirection="column"
      style={contentStyle}
      className={wrapperClassName}
    >
      {finalLabel && (
        <Text
          px={4}
          py={2}
          w="full"
          borderColor="inherit"
          borderBottomWidth={1}
          className={labelClassName}
          style={labelStyle}
        >
          {React.isValidElement(finalLabel) ? finalLabel : `${finalLabel}`}
        </Text>
      )}
      {renderContent()}
    </Box>
  );
};
