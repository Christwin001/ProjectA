import {
  MainContent,
  ViewContent,
  ViewHeader,
} from "@/components/layout/content";
import { ConnectedAccounts } from "@/components/views/accounts";
import { BusinessNameForm } from "@/components/views/accounts/business-name-form";
import { Stack } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const ConnectAccount = dynamic(
  () =>
    import("@/components/views/accounts/connect-account").then(
      (mod) => mod.ConnectAccount
    ),
  { ssr: false }
);

export default function AccountsPage() {
  return (
    <>
      <ViewContent>
        <Stack gap={6}>
          <ViewHeader href="/app/settings">Accounts</ViewHeader>
          <BusinessNameForm />
          <ConnectedAccounts />
          <ConnectAccount inboxType="shared" />
        </Stack>
      </ViewContent>
      <MainContent />
    </>
  );
}
