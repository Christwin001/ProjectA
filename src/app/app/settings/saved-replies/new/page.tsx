"use client";

import {
  MainContent,
  ViewContent,
  ViewHeader,
} from "@/components/layout/content";
import { toaster } from "@/components/ui/toaster";
import { SavedReplyForm } from "@/components/views/saved-replies/saved-reply-form";
import { Stack } from "@chakra-ui/react";
import { useSimpuProvider } from "@simpu/inbox-sdk";
import { useRouter } from "next/navigation";
import React from "react";
import { QuickReply, QuickReplyPayload } from "simpu-api-sdk";

export default function NewSavedReplyPage() {
  const router = useRouter();
  const { apiClient } = useSimpuProvider();

  const handleCreateSavedReply = async (values: QuickReplyPayload) => {
    try {
      await apiClient.inbox.quick_replies.createQuickReply("shared", values);
      router.push("/app/settings/saved-replies");
      toaster.create({
        type: "success",
        title: "Saved Reply Created",
        description: "The saved reply has been created successfully.",
      });
    } catch (error: any) {
      toaster.create({
        type: "error",
        title: "Error",
        description: error?.message ?? error,
      });
    }
  };

  return (
    <>
      <ViewContent>
        <Stack gap={6}>
          <ViewHeader href="/app/settings/saved-replies">
            Create Saved Reply
          </ViewHeader>
          <SavedReplyForm onSubmit={handleCreateSavedReply} />
        </Stack>
      </ViewContent>
      <MainContent />
    </>
  );
}
