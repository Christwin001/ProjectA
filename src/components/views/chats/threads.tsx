"use client";

import { ChatsList, useAccountConnectOptions } from "@simpu/inbox-sdk";
import { Thread } from "simpu-api-sdk";
import { Button } from "@/components/ui/button";
import { Flex, Tabs, Text } from "@chakra-ui/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { LuMessageCircle } from "react-icons/lu";
import { SearchInput } from "./search";
import { useState } from "react";
import { Link as NextLink } from "next-view-transitions";
import { createQueryString } from "@/utils";

export const ThreadsView = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const { thread_id } = useParams<{ thread_id: string }>();
  const { inbox } = useAccountConnectOptions({ inboxType: "shared" });

  const [chatQuery, setChatQuery] = useState("");

  const newChat = searchParams.get("new-chat") as string;
  const filter = searchParams.get("filter") as "open" | "closed" | "assigned";

  const showNewChat = newChat && newChat === "show";

  return (
    !showNewChat && (
      <>
        <Flex
          px={6}
          h="60px"
          w="full"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text textStyle="lg" fontWeight="bold">
            Chats
          </Text>
          <Button
            size="xs"
            onClick={() =>
              push(
                `?${createQueryString(searchParams, {
                  filter,
                  "new-chat": "show",
                })}`
              )
            }
          >
            <LuMessageCircle /> New chat
          </Button>
        </Flex>
        <Tabs.Root
          pb={2}
          px={6}
          size="sm"
          variant="subtle"
          defaultValue={filter}
          navigate={({ value }) =>
            push(
              `/app?${createQueryString(searchParams, {
                filter: value,
              })}`
            )
          }
        >
          <Tabs.List>
            <Tabs.Trigger rounded="full" value="assigned" asChild>
              <NextLink
                href={`/app?${createQueryString(searchParams, {
                  filter: "assigned",
                })}`}
              >
                Ongoing
              </NextLink>
            </Tabs.Trigger>
            <Tabs.Trigger rounded="full" value="open" asChild>
              <NextLink
                href={`/app?${createQueryString(searchParams, {
                  filter: "open",
                })}`}
              >
                Unread
              </NextLink>
            </Tabs.Trigger>
            <Tabs.Trigger rounded="full" value="closed" asChild>
              <NextLink
                href={`/app?${createQueryString(searchParams, {
                  filter: "closed",
                })}`}
              >
                Closed
              </NextLink>
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <Flex px={3} h="50px" alignItems="center">
          <SearchInput
            value={chatQuery}
            placeholder="Search"
            onChange={(e) => setChatQuery(e.target.value)}
          />
        </Flex>
        <ChatsList
          filter={filter}
          inbox_id={inbox?.uuid}
          params={{ q: chatQuery }}
          onChatListItemClick={(c) =>
            push(
              `/app/${c.uuid}?${createQueryString(searchParams, { filter })}`
            )
          }
          isChatItemActive={(c: Thread) => c.uuid === thread_id}
        />
      </>
    )
  );
};
