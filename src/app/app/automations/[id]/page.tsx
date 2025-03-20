"use client";

import { MainContent } from "@/components/layout/content";
import { AutomationView } from "@/components/views/automations/automation-view";
import { useGetAutomation } from "@/queries";
import { Container, Flex, Spinner } from "@chakra-ui/react";
import { useParams } from "next/navigation";

export default function AutomationPage() {
  const { id } = useParams();

  const { data: rule, isLoading } = useGetAutomation(id as string);

  return (
    <MainContent w="calc(100% - 64px)" overflowY="auto">
      <Container py={8} maxW="4xl">
        {isLoading ? (
          <Flex height="80vh" alignItems="center" justifyContent="center">
            <Spinner size="md" />
          </Flex>
        ) : (
          <AutomationView title="Edit Automation" initialValues={rule} />
        )}
      </Container>
    </MainContent>
  );
}
