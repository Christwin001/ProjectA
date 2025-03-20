"use client";

import { Conversation } from "@simpu/inbox-sdk";
import { Box, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { Link } from "next-view-transitions";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { MdClose } from "react-icons/md";
import { createQueryString } from "@/utils";

export const ThreadContactInfo = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { thread_id } = useParams<{ thread_id: string }>();

  const contactInfo = searchParams.get("contact-info") as string;

  const showContactInfo = contactInfo === "show";

  return (
    showContactInfo && (
      <Stack h="full" w="400px" maxW="400px" bg="bg.panel" borderLeftWidth={1}>
        <Box h="60px" bg="bg.subtle" px={4}>
          <HStack h="full" align="center" gap={6}>
            <Link
              href={`${pathname}?${createQueryString(searchParams, {
                "contact-info": null,
              })}`}
            >
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
        </Stack>
      </Stack>
    )
  );
};
