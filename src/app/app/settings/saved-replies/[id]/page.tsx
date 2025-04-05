"use client";

import {
  MainContent,
  ViewContent,
  ViewHeader,
} from "@/components/layout/content";
import { toaster } from "@/components/ui/toaster";
import { SavedReplyForm } from "@/components/views/saved-replies/saved-reply-form";
import { useGetQuickReply } from "@/queries";
import { Flex, Spinner, Stack } from "@chakra-ui/react";
import { useSimpuProvider } from "@simpu/inbox-sdk";
import { useParams, useRouter } from "next/navigation";
import { QuickReplyPayload } from "simpu-api-sdk";

export default function SavedReplyPage() {
  const router = useRouter();
  const { apiClient } = useSimpuProvider();
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useGetQuickReply(params.id);

  const handleUpdateSavedReply = async (values: QuickReplyPayload) => {
    try {
      await apiClient.inbox.quick_replies.updateQuickReply(params.id, values);
      router.push("/app/settings/saved-replies");
      toaster.create({
        type: "success",
        title: "Saved Reply Updated",
        description: "The saved reply has been updated successfully.",
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
            Saved Reply
          </ViewHeader>
          {isLoading ? (
            <Flex h="50vh" alignItems="center" justifyContent="center">
              <Spinner />
            </Flex>
          ) : (
            <SavedReplyForm
              id={params.id}
              initialValues={{
                name: data?.name ?? "",
                template: {
                  body: data?.template.body ?? "",
                },
              }}
              onSubmit={handleUpdateSavedReply}
            />
          )}
        </Stack>
      </ViewContent>
      <MainContent />
    </>
  );
}
