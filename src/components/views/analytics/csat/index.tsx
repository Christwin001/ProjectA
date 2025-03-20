"use client";

import { DonutChart } from "@/components/charts/pie-chart";
import { useGetCSATRatingDistribution } from "@/queries";
import { Card, Flex, Heading, Text } from "@chakra-ui/react";

interface CSATAnalyticsProps {
  dateRange: { to: string; from: string };
}

export const CSATAnalytics = ({ dateRange }: CSATAnalyticsProps) => {
  const { data = [] } = useGetCSATRatingDistribution({
    end_date: dateRange.to,
    start_date: dateRange.from,
  });

  const ratingDistributionTotal =
    data?.reduce((acc, item) => acc + item.count, 0) ?? 0;

  const ratingDistributionData = data?.map(({ count }) => ({
    name: "",
    count,
  }));

  return (
    <Card.Root w={["100%", "100%", "100%", "50%"]}>
      <Card.Header pb="0">
        <Heading as="h4" fontWeight="medium" textStyle="sm">
          CSAT rating distribution
        </Heading>
      </Card.Header>
      <Card.Body justifyContent="center">
        {!!data?.length ? (
          <DonutChart
            mx="auto"
            value="count"
            category="label"
            showLabel={true}
            data={ratingDistributionData}
            colors={["teal", "cyan", "green", "orange"]}
            valueFormatter={(number: number) =>
              `${((number / ratingDistributionTotal) * 100).toFixed(1)}`
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
