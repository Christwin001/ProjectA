"use client";

import { Conversation } from "@simpu/inbox-sdk";
import { Box, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { Link } from "next-view-transitions";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { MdClose } from "react-icons/md";

export const ThreadContactInfo = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { thread_id } = useParams<{ thread_id: string }>();

  const newChat = searchParams.get("new-chat") as string;
  const contactInfo = searchParams.get("contact-info") as string;

  const showContactInfo = contactInfo === "show";
  const showNewChat = newChat && newChat === "show";

  const newSearchParams = showNewChat
    ? {
        "new-chat": "show",
      }
    : undefined;

  return (
    showContactInfo && (
      <Stack h="full" w="400px" maxW="400px" bg="bg.panel" borderLeftWidth={1}>
        <Box h="60px" bg="bg.subtle" px={4}>
          <HStack h="full" align="center" gap={6}>
            <Link href={`${pathname}?${new URLSearchParams(newSearchParams)}`}>
              <IconButton cursor="pointer" size="sm" variant="ghost">
                <MdClose />
              </IconButton>
            </Link>
            <Text textStyle="lg" fontWeight={500}>
              Contact info
            </Text>
          </HStack>
        </Box>
        <Stack overflowY="auto" flex={1}>
          <Conversation.ContactInfo thread_id={thread_id} />
          <Conversation.Media thread_id={thread_id} />
        </Stack>
      </Stack>
    )
  );
};
