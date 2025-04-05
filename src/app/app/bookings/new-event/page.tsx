"use client";

import { MainContent, ViewHeader } from "@/components/layout/content";
import { toaster } from "@/components/ui/toaster";
import { CreateEventType } from "@calcom/atoms";
import { Container, Stack } from "@chakra-ui/react";
import React from "react";

export default function NewEventPage() {
  return (
    <MainContent w="calc(100% - 64px)" overflowY="auto">
      <Container py={8} maxW="4xl">
        <Stack gap={8}>
          <ViewHeader
            px={0}
            flex={1}
            href="/app/bookings/settings"
            labelProps={{ textStyle: "lg", fontWeight: "bold" }}
          >
            New event
          </ViewHeader>
          <CreateEventType
            onSuccess={(eventType) => {
              toaster.success({
                title: "Success",
                description: `Event created successfully`,
              });
              console.log("EventType created successfully", eventType);
            }}
            onError={() => {
              toaster.error({
                title: "Error",
                description: `An error occurred while creating the event`,
              });
            }}
            customClassNames={{
              atomsWrapper: "border p-4 rounded-md",
              buttons: { submit: "bg-red-500", cancel: "bg-gray-300" },
            }}
          />
        </Stack>
      </Container>
    </MainContent>
  );
}
