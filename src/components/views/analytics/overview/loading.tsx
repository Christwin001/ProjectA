"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Grid, Stack, Text } from "@chakra-ui/react";

export const AnalyticsOverviewLoading = () => {
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
      <Stack alignItems="flex-start">
        <Text textStyle="sm" fontWeight="semibold">
          Ongoing chats
        </Text>
        <Skeleton h={4} w={20} />
        <Skeleton h={4} w={10} />
      </Stack>
      <Stack alignItems="flex-start">
        <Text textStyle="sm" fontWeight="semibold">
          Closed chats
        </Text>
        <Skeleton h={4} w={20} />
        <Skeleton h={4} w={10} />
      </Stack>
      <Stack alignItems="flex-start">
        <Text textStyle="sm" fontWeight="semibold">
          Unread chats
        </Text>
        <Skeleton h={4} w={20} />
        <Skeleton h={4} w={10} />
      </Stack>
      <Stack alignItems="flex-start">
        <Text textStyle="sm" fontWeight="semibold">
          First response time
        </Text>
        <Skeleton h={4} w={20} />
        <Skeleton h={4} w={10} />
      </Stack>
      <Stack alignItems="flex-start">
        <Text textStyle="sm" fontWeight="semibold">
          Chat duration
        </Text>
        <Skeleton h={4} w={20} />
        <Skeleton h={4} w={10} />
      </Stack>
      <Stack alignItems="flex-start">
        <Text textStyle="sm" fontWeight="semibold">
          CSAT score
        </Text>
        <Skeleton h={4} w={20} />
        <Skeleton h={4} w={10} />
      </Stack>
    </Grid>
  );
};
