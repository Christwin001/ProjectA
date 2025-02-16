import {
  MainContent,
  ViewContent,
  ViewHeader,
} from "@/components/layout/content";
import { Stack } from "@chakra-ui/react";
import { ProfileForm, ProfileImage } from "@simpu/inbox-sdk";

export default async function ProfilePage() {
  return (
    <>
      <ViewContent>
        <Stack gap={6}>
          <ViewHeader href="/app/settings">Profile</ViewHeader>
          <ProfileImage />
          <ProfileForm />
        </Stack>
      </ViewContent>
      <MainContent />
    </>
  );
}
