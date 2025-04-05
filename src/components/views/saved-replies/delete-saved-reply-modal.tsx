"use client";

import { Button } from "@/components/ui/button";
import { CloseButton } from "@/components/ui/close-button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { DialogActionTrigger, IconButton, Stack, Text } from "@chakra-ui/react";
import { Tooltip, useSimpuProvider } from "@simpu/inbox-sdk";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LuTrash2 } from "react-icons/lu";

export const DeleteSavedReplyModal = ({ id }: { id?: string }) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const { apiClient } = useSimpuProvider();

  const handleDeleteSavedReply = async () => {
    if (id) {
      try {
        setIsDeleting(true);
        await apiClient.inbox.quick_replies.deleteQuickReply([id]);
        router.push("/app/settings/saved-replies");
      } catch (error: any) {
        toaster.create({
          type: "error",
          title: "Error",
          description: error?.message ?? error,
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <Tooltip content="Delete" openDelay={100}>
        <DialogTrigger asChild>
          <IconButton
            size="xs"
            type="button"
            variant="subtle"
            colorPalette="red"
            aria-label="Delete"
          >
            <LuTrash2 />
          </IconButton>
        </DialogTrigger>
      </Tooltip>
      <DialogContent>
        <DialogCloseTrigger asChild>
          <CloseButton size="xs" />
        </DialogCloseTrigger>
        <DialogHeader>
          <DialogTitle>Delete Saved Reply</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Stack gap={4}>
            <Text textStyle="sm" color="fg.muted">
              Are you sure you want to delete this saved reply?
            </Text>
          </Stack>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button size="xs" variant="outline">
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button
            size="xs"
            colorPalette="red"
            loading={isDeleting}
            onClick={handleDeleteSavedReply}
          >
            Yes, delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
