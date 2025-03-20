"use client";

import {
  MainContent,
  ViewContent,
  ViewHeader,
} from "@/components/layout/content";
import { Stack } from "@chakra-ui/react";

export default function SavedRepliesPage() {
  return (
    <>
      <ViewContent>
        <Stack gap={6}>
          <ViewHeader href="/app/settings">Saved Replies</ViewHeader>
        </Stack>
      </ViewContent>
      <MainContent />
    </>
  );
}
