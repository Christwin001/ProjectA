"use client";

import { AreaChart } from "@/components/charts/area-chart";
import { Button } from "@/components/ui/button";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetReportMetricsOvertime } from "@/queries";
import { convertSecondsToTime, numberWithCommas } from "@/utils";
import { Card, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { LuCheck, LuListFilter } from "react-icons/lu";

interface ChangesOvertimeAnalyticsProps {
  period: number;
}

const statOptions: { [key: string]: string } = {
  response_time: "Response time",
  first_response_time: "First response time",
  new_conversation: "New chats",
  closed_conversation: "Closed chats",
  sent_message: "Messages sent",
  processing_time: "Chat duration",
};

export const ChangesOvertimeAnalytics = ({
  period,
}: ChangesOvertimeAnalyticsProps) => {
  const [stat, setStat] = useState("response_time");

  const { data } = useGetReportMetricsOvertime({
    reports: [stat],
    period_unit: "days",
    period_value: period,
  });

  const { inbox_metrics_over_time } = data ?? {};

  const { current } = inbox_metrics_over_time?.[stat] ?? {};

  const chartData = current?.map((item: any) => ({
    date: item.date,
    [stat]: stat.includes("time") ? Math.ceil(item[stat] / 60) : item[stat],
  }));

  return (
    <Card.Root w={["100%", "100%", "100%", "50%"]}>
      <Card.Header
        pb="0"
        display="flex"
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Heading as="h4" fontWeight="medium" textStyle="sm">
          Changes over time
        </Heading>
        <PopoverRoot positioning={{ sameWidth: true }}>
          <PopoverTrigger asChild>
            <Button size="xs" variant="outline">
              <LuListFilter />
              {statOptions[stat]}
            </Button>
          </PopoverTrigger>
          <PopoverContent w="fit-content" p={1}>
            <Stack gap={0}>
              {Object.keys(statOptions).map((d) => (
                <Button
                  key={d}
                  size="xs"
                  rounded="xs"
                  variant="ghost"
                  textAlign="left"
                  justifyContent="space-between"
                  onClick={() => setStat(d)}
                >
                  {statOptions[d]}
                  {stat === d && <LuCheck />}
                </Button>
              ))}
            </Stack>
          </PopoverContent>
        </PopoverRoot>
      </Card.Header>
      <Card.Body>
        {!!chartData?.length ? (
          <AreaChart
            height={80}
            index="date"
            yAxisWidth={80}
            data={chartData}
            showLegend={false}
            colors={["teal"]}
            categories={[stat]}
            valueFormatter={(value) =>
              stat.includes("time")
                ? convertSecondsToTime(value)
                : numberWithCommas(value)
            }
          />
        ) : (
          <Flex
            h="40vh"
            alignItems="center"
            textAlign="center"
            justifyContent="center"
          >
            <Text textStyle="xl" fontWeight="semibold">
              No data
            </Text>
          </Flex>
        )}
      </Card.Body>
    </Card.Root>
  );
};

const chartdata = [
  { date: "Jan 23", SolarPanels: 2890, Inverters: 2338 },
  { date: "Feb 23", SolarPanels: 2756, Inverters: 2103 },
  { date: "Mar 23", SolarPanels: 3322, Inverters: 2194 },
  { date: "Apr 23", SolarPanels: 3470, Inverters: 2108 },
  { date: "May 23", SolarPanels: 3475, Inverters: 1812 },
  { date: "Jun 23", SolarPanels: 3129, Inverters: 1726 },
  { date: "Jul 23", SolarPanels: 3490, Inverters: 1982 },
  { date: "Aug 23", SolarPanels: 2903, Inverters: 2012 },
  { date: "Sep 23", SolarPanels: 2643, Inverters: 2342 },
  { date: "Oct 23", SolarPanels: 2837, Inverters: 2473 },
  { date: "Nov 23", SolarPanels: 2954, Inverters: 3848 },
  { date: "Dec 23", SolarPanels: 3239, Inverters: 3736 },
];
