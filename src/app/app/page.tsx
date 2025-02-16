import { MainContent, ViewContent } from "@/components/layout/content";
import { ChatsView } from "@/components/views/chats";

export default function AppHome() {
  return (
    <>
      <ViewContent>
        <ChatsView />
      </ViewContent>
      <MainContent />
    </>
  );
}
