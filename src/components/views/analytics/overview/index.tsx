"use client";

import { useGetCSATAverageRating, useGetReportMainMetrics } from "@/queries";
import { convertSecondsToTime, numberWithCommas } from "@/utils";
import { Badge, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { LuArrowDown, LuArrowUp } from "react-icons/lu";

interface AnalyticsOverviewProps {
  period: number;
  reports: string[];
  dateRange: { to: string; from: string };
}

export const AnalyticsOverview = ({
  period,
  reports,
  dateRange,
}: AnalyticsOverviewProps) => {
  const { data: mainMetrics } = useGetReportMainMetrics({
    reports,
    period_unit: "days",
    period_value: period,
  });

  const { data: CSATAverageRating } = useGetCSATAverageRating({
    end_date: dateRange.to,
    start_date: dateRange.from,
  });

  const { inbox_metrics } = mainMetrics ?? {};

  const overallAvergeRating =
    Number(CSATAverageRating?.[0]?.average_rating ?? "0") * 20;

  const csatAvergeRatingDisplayOptions = useMemo(() => {
    if (overallAvergeRating < 50) {
      return { colorPalette: "red", caption: "Poor" };
    } else if (overallAvergeRating >= 50 && overallAvergeRating < 70) {
      return { colorPalette: "amber", caption: "Fair" };
    } else {
      return { colorPalette: "green", caption: "Excellent" };
    }
  }, [overallAvergeRating]);

  return (
    <Grid
      gap={8}
      flex={1}
      alignItems="flex-start"
      templateColumns={[
        "repeat(2, 1fr)",
        "repeat(3, 1fr)",
        "repeat(6, 1fr)",
        "repeat(6, 1fr)",
      ]}
      order={[1, 1, 1, 0]}
    >
      <OverviewStat
        label="Ongoing chats"
        stat="ongoing_conversation"
        data={inbox_metrics["ongoing_conversation"]}
      />
      <OverviewStat
        label="Closed chats"
        stat="closed_conversation"
        data={inbox_metrics["closed_conversation"]}
      />
      <OverviewStat
        label="Open chats"
        stat="open_conversation"
        data={inbox_metrics["open_conversation"]}
      />
      <OverviewStat
        stat="first_response_time"
        label="First response time"
        data={inbox_metrics["first_response_time"]}
      />
      <OverviewStat
        stat="processing_time"
        label="Chat duration"
        data={inbox_metrics["processing_time"]}
      />
      <Stack alignItems="flex-start">
        <Text textStyle="sm" fontWeight="semibold">
          CSAT score
        </Text>
        <Heading>{overallAvergeRating.toFixed(0)}%</Heading>
        {!!CSATAverageRating.length && (
          <Badge colorPalette={csatAvergeRatingDisplayOptions.colorPalette}>
            {csatAvergeRatingDisplayOptions.caption}
          </Badge>
        )}
      </Stack>
    </Grid>
  );
};

interface OverviewStatProps {
  stat: string;
  label: string;
  data: {
    current: number;
    previous: number;
  };
}

const OverviewStat = ({ stat, label, data }: OverviewStatProps) => {
  const statIncreased = data.current > data.previous;
  const statDifferenceValue = data.current - data.previous;

  const statValue = stat.includes("time")
    ? convertSecondsToTime(data.current)
    : numberWithCommas(data.current);

  const statPercentageDifference =
    statDifferenceValue <= 0
      ? data.current
      : (statDifferenceValue / data.current) * 100;

  const statPercentageDifferenceDisplay =
    statPercentageDifference === 0
      ? null
      : `${Math.abs(statPercentageDifference).toFixed(0)}%`;

  return (
    <Stack alignItems="flex-start">
      <Text truncate textStyle="sm" fontWeight="semibold">
        {label}
      </Text>
      <Heading>{statValue}</Heading>
      {statPercentageDifferenceDisplay && (
        <Badge colorPalette={statIncreased ? "green" : "red"}>
          {statIncreased ? <LuArrowUp /> : <LuArrowDown />}{" "}
          {statPercentageDifferenceDisplay}
        </Badge>
      )}
    </Stack>
  );
};
