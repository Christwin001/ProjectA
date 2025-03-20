import { MainContent } from "@/components/layout/content";
import { Container, Stack } from "@chakra-ui/react";
import React from "react";

export default function BookingsPage() {
  return (
    <MainContent w="calc(100% - 64px)" overflowY="auto">
      <Container py={8}>
        <Stack gap={8}>BookingsPage</Stack>
      </Container>
    </MainContent>
  );
}
