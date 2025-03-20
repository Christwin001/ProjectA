"use client";

import React, { useState } from "react";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toaster } from "@/components/ui/toaster";
import { QueryKeys, useSimpuProvider } from "@simpu/inbox-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { createQueryString } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LuCheckCheck } from "react-icons/lu";
import { Box, Stack, Text } from "@chakra-ui/react";
import { Switch } from "@/components/ui/switch";
import { Thread } from "simpu-api-sdk";

export const CloseChatPopover = ({ thread }: { thread?: Thread }) => {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { apiClient } = useSimpuProvider();

  const [isClosingChat, setIsClosingChat] = useState(false);

  const handleCloseChat = async () => {
    try {
      setIsClosingChat(true);
      await apiClient.inbox.threads.resolveThread(thread?.uuid ?? "", {
        request_rating: true,
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.getThread, thread?.uuid],
      });
      push(`/app?${createQueryString(searchParams, { filter: "assigned" })}`);
    } catch (error: any) {
      toaster.create({
        type: "error",
        title: "Error",
        description: error?.message ?? error,
      });
    } finally {
      setIsClosingChat(false);
    }
  };

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Button size="xs" variant="subtle">
          <LuCheckCheck />
          Close chat
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <Stack gap={3}>
            <Box>
              <PopoverTitle textStyle="sm" fontWeight="medium">
                You are about to close the chat with {thread?.receiver.name}
              </PopoverTitle>
              <Text textStyle="xs" color="fg.muted">
                Once a chat is closed it is moved to the closed tab.
              </Text>
            </Box>
            <Switch size="sm">Request CSAT rating</Switch>
            <Button
              size="xs"
              loading={isClosingChat}
              loadingText="Closing chat"
              onClick={handleCloseChat}
            >
              <LuCheckCheck />
              Close chat
            </Button>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};
