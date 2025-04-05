"use client";

import { CloseButton } from "@/components/ui/close-button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { IconButton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { LuInfo } from "react-icons/lu";

export const AnalyticsGlossaryModal = (props: {
  glossary?: { label: string; description: string }[];
}) => {
  const { glossary = defaultGlossary } = props;

  const [open, setOpen] = useState(false);

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <Tooltip openDelay={100} content="Glossary" aria-label="Glossary">
        <DialogTrigger asChild>
          <IconButton size="xs" variant="outline">
            <LuInfo />
          </IconButton>
        </DialogTrigger>
      </Tooltip>
      <DialogContent>
        <DialogCloseTrigger asChild>
          <CloseButton size="xs" />
        </DialogCloseTrigger>
        <DialogHeader>
          <DialogTitle>Analytics Glossary</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Stack height="500px" gap={4} overflowY="auto">
            {glossary?.map((item, i) => (
              <Stack gap={1} key={`${item.label}-${i}`}>
                <Text fontWeight="semibold" textStyle="sm">
                  {item.label}
                </Text>
                <Text color="fg.muted" textStyle="sm">
                  {item.description}
                </Text>
              </Stack>
            ))}
          </Stack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export const defaultGlossary = [
  {
    key: "response_time",
    label: "Response time",
    description: "Length of time a customer has to wait to get a response.",
  },
  {
    key: "processing_time",
    label: "Chat duration",
    description:
      "Length of time from chat response to customer to the chat closing.",
  },
  {
    key: "first_response_time",
    label: "First response time",
    description:
      "Time from chat first assignment to first response to customer.",
  },
  {
    key: "ongoing_conversation",
    label: "Ongoing chats",
    description: "Chats that are currently being responded to.",
  },
  {
    key: "open_conversation",
    label: "Unread chats",
    description: "Chats that have not been assigned to any agent.",
  },
  {
    key: "closed_conversation",
    label: "Closed chats",
    description: "Chats marked as resolved.",
  },
  {
    key: "sent_message",
    label: "Messages sent",
    description: "Count of individual messages sent (not chats).",
  },
  {
    label: "New chats",
    key: "new_conversation",
    description:
      "Count of messages that came in during a certain period. Chats that are entirely new during a certain period i.e they were not in the open state.",
  },
];
