// Tremor DonutChart [v0.0.1]
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import {
  Pie,
  PieChart as ReChartsDonutChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";

import { useColorModeValue } from "../ui/color-mode";
import { Box, BoxProps, chakra } from "@chakra-ui/react";
import { BaseChartProps } from "@/types";
import { createCategoryColors } from "@/utils";
import { ChartTooltip } from "./tooltip";

const sumNumericArray = (arr: number[]): number =>
  arr.reduce((sum, num) => sum + num, 0);

const calculateDefaultLabel = (data: any[], valueKey: string): number =>
  sumNumericArray(data.map((dataPoint) => dataPoint[valueKey]));

const parseLabelInput = (
  labelInput: string | undefined,
  valueFormatter: (value: number) => string,
  data: any[],
  valueKey: string
): string =>
  labelInput || valueFormatter(calculateDefaultLabel(data, valueKey));

const renderInactiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, className } =
    props;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      className={className}
      fill=""
      opacity={0.3}
      style={{ outline: "none" }}
    />
  );
};

type DonutChartVariant = "donut" | "pie";

type BaseEventProps = {
  eventType: "sector";
  categoryClicked: string;
  [key: string]: number | string;
};

type DonutChartEventProps = BaseEventProps | null | undefined;

interface DonutChartProps extends BoxProps {
  data: Record<string, any>[];
  category: string;
  value: string;
  colors?: BaseChartProps["colors"];
  variant?: DonutChartVariant;
  valueFormatter?: (value: number) => string;
  label?: string;
  showLabel?: boolean;
  showTooltip?: boolean;
  onValueChange?: (value: DonutChartEventProps) => void;
  tooltipContent?: BaseChartProps["tooltipContent"];
}

const CText = chakra("text", {
  base: {
    fill: {
      base: "gray.700",
      _dark: "gray.300",
    },
  },
});

const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(
  (
    {
      value,
      label,
      category,
      data = [],
      className,
      variant = "donut",
      showLabel = false,
      showTooltip = true,
      colors = ["teal", "cyan"],
      onValueChange,
      tooltipContent,
      valueFormatter = (value: number) => value.toString(),
      ...other
    },
    forwardedRef
  ) => {
    const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
      undefined
    );
    const isDonut = variant === "donut";
    const parsedLabelInput = parseLabelInput(
      label,
      valueFormatter,
      data,
      value
    );

    const categories = Array.from(new Set(data.map((item) => item[category])));
    const categoryColors = createCategoryColors(categories, colors);

    const handleShapeClick = (
      data: any,
      index: number,
      event: React.MouseEvent
    ) => {
      event.stopPropagation();
      if (!onValueChange) return;

      if (activeIndex === index) {
        setActiveIndex(undefined);
        onValueChange(null);
      } else {
        setActiveIndex(index);
        onValueChange({
          eventType: "sector",
          categoryClicked: data.payload[category],
          ...data.payload,
        });
      }
    };

    const getColor = (dataPoint: any, category: string) => {
      return categoryColors[dataPoint[category]];
    };

    const parseData = (
      data: Record<string, any>[],
      categoryColors: Record<string, any>,
      category: string
    ) =>
      data.map((dataPoint) => ({
        ...dataPoint,
        color: categoryColors[dataPoint[category]],
        fill: getColor(dataPoint, category),
      }));

    return (
      <Box
        h={40}
        w={40}
        ref={forwardedRef}
        className={className}
        tremor-id="tremor-raw"
        css={{
          ".recharts-pie-sector": {
            outline: "none",
          },
          "--chart-cursor-bg": "var(--chakra-colors-gray-100)",
          "--chart-gradient-start-opacity": "0.8",
          "--chart-gradient-end-opacity": "80",
          _dark: {
            "--chart-cursor-bg": "var(--chakra-colors-gray-900)",
            "--chart-gradient-start-opacity": "80",
            "--chart-gradient-end-opacity": "0.8",
          },
        }}
        {...other}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth="0">
          <ReChartsDonutChart
            onClick={
              onValueChange && activeIndex !== undefined
                ? () => {
                    setActiveIndex(undefined);
                    onValueChange(null);
                  }
                : undefined
            }
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {showLabel && isDonut && (
              <CText
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {parsedLabelInput}
              </CText>
            )}
            <Pie
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              dataKey={value}
              nameKey={category}
              outerRadius="100%"
              strokeLinejoin="round"
              isAnimationActive={false}
              activeIndex={activeIndex}
              style={{ outline: "none" }}
              innerRadius={isDonut ? "75%" : "0%"}
              cursor={onValueChange ? "pointer" : "default"}
              stroke={useColorModeValue("#ffffff", "#111111")}
              data={parseData(data, categoryColors, category)}
              onClick={handleShapeClick}
              inactiveShape={renderInactiveShape}
            />
            {showTooltip && (
              <Tooltip
                formatter={valueFormatter}
                content={
                  tooltipContent
                    ? tooltipContent
                    : (props) => (
                        <ChartTooltip
                          {...props}
                          categoryColors={categoryColors}
                        />
                      )
                }
              />
            )}
          </ReChartsDonutChart>
        </ResponsiveContainer>
      </Box>
    );
  }
);

DonutChart.displayName = "DonutChart";

export { DonutChart, type DonutChartEventProps };
