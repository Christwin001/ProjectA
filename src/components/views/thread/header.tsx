"use client";

import {
  Thread,
  QueryKeys,
  Conversation,
  useSimpuProvider,
} from "@simpu/inbox-sdk";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { toaster } from "@/components/ui/toaster";
import { IconButton } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "next-view-transitions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GrMoreVertical } from "react-icons/gr";

export const ThreadHeader = ({ thread_id }: { thread_id: string }) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { apiClient } = useSimpuProvider();

  const newChat = searchParams.get("new-chat") as string;

  const showNewChat = newChat && newChat === "show";

  const newSearchParams = showNewChat
    ? {
        "new-chat": "show",
      }
    : undefined;

  const url = `${pathname}?${new URLSearchParams({
    "contact-info": "show",
    ...newSearchParams,
  })}`;

  const handlePinChat = async () => {
    try {
      await apiClient.inbox.threads.favorite(thread_id);
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.getThread, thread_id],
      });
      toaster.create({
        type: "success",
        title: "Success",
        description: "Pinned chat",
      });
    } catch (error) {
      toaster.create({
        type: "error",
        title: "Error",
        //@ts-expect-error: error
        description: error?.message ?? error,
      });
    }
  };

  const handleUnPinChat = async () => {
    try {
      await apiClient.inbox.threads.unfavorite(thread_id);
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.getThread, thread_id],
      });
      toaster.create({
        type: "success",
        title: "Success",
        description: "Unpinned chat",
      });
    } catch (error) {
      toaster.create({
        type: "error",
        title: "Error",
        //@ts-expect-error: error
        description: error?.message ?? error,
      });
    }
  };

  const handlePinningAction = (thread?: Thread) => {
    if (thread) {
      if (!thread.is_favorited) {
        handlePinChat();
      } else {
        handleUnPinChat();
      }
    }
  };

  return (
    <Conversation.Header
      cursor="pointer"
      thread_id={thread_id}
      onClick={() => push(url)}
    >
      {(thread) => (
        <MenuRoot
          positioning={{
            placement: "bottom-end",
          }}
          onSelect={({ value }) => {
            if (value === "pin-chat") {
              handlePinningAction(thread);
            }
          }}
        >
          <MenuTrigger asChild>
            <IconButton cursor="pointer" size="sm" variant="subtle">
              <GrMoreVertical />
            </IconButton>
          </MenuTrigger>
          <MenuContent>
            <MenuItem cursor="pointer" asChild value="contact-info">
              <Link href={url}>Contact info</Link>
            </MenuItem>
            <MenuItem cursor="pointer" value="pin-chat">
              {thread?.is_favorited ? "Unpin" : "Pin"} chat
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      )}
    </Conversation.Header>
  );
};
