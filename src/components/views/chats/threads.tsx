"use client";

import { ChatsList, Thread } from "@simpu/inbox-sdk";
import { Button } from "@/components/ui/button";
import { Flex, Text } from "@chakra-ui/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { LuMessageCircle } from "react-icons/lu";
import { SearchInput } from "./search";
import { useState } from "react";

export const ThreadsView = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const { thread_id } = useParams<{ thread_id: string }>();

  const [chatQuery, setChatQuery] = useState("");

  const newChat = searchParams.get("new-chat") as string;
  const contactInfo = searchParams.get("contact-info") as string;

  const showNewChat = newChat && newChat === "show";
  const showContactInfo = contactInfo && contactInfo === "show";

  const newSearchParams = showContactInfo
    ? {
        "contact-info": "show",
      }
    : undefined;

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
                `?${new URLSearchParams({
                  "new-chat": "show",
                  ...newSearchParams,
                })}`
              )
            }
          >
            <LuMessageCircle /> New chat
          </Button>
        </Flex>
        <Flex px={3} h="50px" alignItems="center">
          <SearchInput
            value={chatQuery}
            placeholder="Search"
            onChange={(e) => setChatQuery(e.target.value)}
          />
        </Flex>
        <ChatsList
          params={{ q: chatQuery }}
          onChatListItemClick={(c) => push(`/app/${c.uuid}`)}
          isChatItemActive={(c: Thread) => c.uuid === thread_id}
        />
      </>
    )
  );
};
