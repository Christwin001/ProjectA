"use client";

import { MainContent } from "@/components/layout/content";
import { Button } from "@/components/ui/button";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChangesOvertimeAnalytics } from "@/components/views/analytics/changes-overtime";
import { ChangesOvertimeAnalyticsLoading } from "@/components/views/analytics/changes-overtime/loading";
import { CSATAnalytics } from "@/components/views/analytics/csat";
import { CSATAnalyticsLoading } from "@/components/views/analytics/csat/loading";
import { AnalyticsOverview } from "@/components/views/analytics/overview";
import { AnalyticsOverviewLoading } from "@/components/views/analytics/overview/loading";
import { Badge, Container, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { Suspense, useState } from "react";
import { LuCheck, LuInfo, LuListFilter } from "react-icons/lu";
import { RxDividerVertical } from "react-icons/rx";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(7);
  const [dateRange, setDateRange] = useState(getDateRangeFromDays(7));

  const periodFilterOptions = [
    { label: "Last 7 days", value: 7 },
    { label: "Last 14 days", value: 14 },
    { label: "Last 30 days", value: 30 },
    { label: "Last 90 days", value: 90 },
  ];

  const periodOption = periodFilterOptions.find((o) => o.value === period);

  const handlePeriodChange = (value: number) => {
    setPeriod(value);
  };

  const handleDateRangeChange = (values: { from: any; to: any }) => {
    setDateRange({ ...dateRange, ...values });
  };

  const handlePeriodFilterChange = (option: number) => {
    handlePeriodChange(option);

    if (option === 7) {
      const { to, from } = getDateRangeFromDays(7);
      handleDateRangeChange({ from, to });
    } else if (option === 14) {
      const { to, from } = getDateRangeFromDays(14);
      handleDateRangeChange({ from, to });
    } else if (option === 30) {
      const { to, from } = getDateRangeFromDays(30);
      handleDateRangeChange({ from, to });
    } else if (option === 90) {
      const { to, from } = getDateRangeFromDays(90);
      handleDateRangeChange({ from, to });
    }
  };

  return (
    <MainContent w="calc(100% - 64px)" overflowY="auto">
      <Container py={8}>
        <Stack gap={12}>
          <Stack gap={8}>
            <Text textStyle="lg" fontWeight="bold">
              Analytics
            </Text>
            <Flex
              gap={4}
              direction={["column", "column", "column", "row"]}
              justifyItems={["unset", "unset", "unset", "space-between"]}
              alignItems={["flex-start", "flex-start", "flex-start", "center"]}
            >
              <Suspense fallback={<AnalyticsOverviewLoading />}>
                <AnalyticsOverview
                  period={period}
                  dateRange={dateRange}
                  reports={[
                    "first_response_time",
                    "open_conversation",
                    "ongoing_conversation",
                    "closed_conversation",
                    "processing_time",
                  ]}
                />
              </Suspense>
              <HStack order={[0, 0, 0, 1]}>
                <PopoverRoot positioning={{ sameWidth: true }}>
                  <PopoverTrigger asChild>
                    <Button size="xs" variant="outline" borderStyle="dashed">
                      <LuListFilter />
                      Filter{" "}
                      {periodOption && (
                        <>
                          <RxDividerVertical />
                          <Badge>{periodOption.label}</Badge>
                        </>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent w="auto" p={1}>
                    <Stack gap={0}>
                      {periodFilterOptions.map((d) => (
                        <Button
                          size="xs"
                          rounded="xs"
                          key={d.value}
                          variant="ghost"
                          textAlign="left"
                          justifyContent="space-between"
                          onClick={() => handlePeriodFilterChange(d.value)}
                        >
                          {d.label}
                          {period === d.value && <LuCheck />}
                        </Button>
                      ))}
                    </Stack>
                  </PopoverContent>
                </PopoverRoot>

                <Button size="xs" variant="outline">
                  <LuInfo />
                </Button>
              </HStack>
            </Flex>
          </Stack>
          <Stack gap={6} direction={["column", "column", "column", "row"]}>
            <Suspense fallback={<ChangesOvertimeAnalyticsLoading />}>
              <ChangesOvertimeAnalytics period={period} />
            </Suspense>
            <Suspense fallback={<CSATAnalyticsLoading />}>
              <CSATAnalytics dateRange={dateRange} />
            </Suspense>
          </Stack>
        </Stack>
      </Container>
    </MainContent>
  );
}

const getDateRangeFromDays = (days: number) => {
  const dateFormat = "YYYY-MM-DD";

  return {
    to: dayjs(dayjs().endOf("day")).format(dateFormat),
    from: dayjs(dayjs().subtract(days, "day")).format(dateFormat),
  };
};
