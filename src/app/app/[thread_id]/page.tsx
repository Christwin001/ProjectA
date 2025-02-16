import { MainContent, ViewContent } from "@/components/layout/content";
import { ChatsView } from "@/components/views/chats";
import { ThreadView } from "@/components/views/thread";
import { ThreadContactInfo } from "@/components/views/thread/contact-info";
import { HStack, VStack } from "@chakra-ui/react";
import { Suspense } from "react";

export default function Thread() {
  return (
    <>
      <ViewContent>
        <ChatsView />
      </ViewContent>
      <MainContent>
        <HStack gap={0} w="full" h="full" alignItems="flex-start">
          <VStack gap={0} flex={1} h="full" position="relative">
            <ThreadView />
          </VStack>
          <Suspense>
            <ThreadContactInfo />
          </Suspense>
        </HStack>
      </MainContent>
    </>
  );
}
