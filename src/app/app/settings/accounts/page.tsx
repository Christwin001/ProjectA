import {
  MainContent,
  ViewContent,
  ViewHeader,
} from "@/components/layout/content";
import { ConnectedAccounts } from "@/components/views/accounts";
import { Stack, Text } from "@chakra-ui/react";
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
          <ConnectAccount />
          <Stack px={4}>
            <Text textStyle="sm" fontWeight="medium">
              Your connected accounts
            </Text>
            <ConnectedAccounts />
          </Stack>
        </Stack>
      </ViewContent>
      <MainContent />
    </>
  );
}
