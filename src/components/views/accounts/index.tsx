"use client";

import {
  useAccountConnectOptions,
  useGetInboxAccounts,
} from "@simpu/inbox-sdk";
import { Stack, Text } from "@chakra-ui/react";
import { ConnectedAccount } from "./connected-account";

export const ConnectedAccounts = () => {
  const { inbox } = useAccountConnectOptions({ inboxType: "shared" });

  const { data } = useGetInboxAccounts(inbox?.uuid ?? "", { enabled: !!inbox });

  return (
    <Stack px={4}>
      <Text textStyle="sm" fontWeight="medium">
        Your connected accounts
      </Text>
      {!!data?.length ? (
        data.map((account) => (
          <ConnectedAccount
            key={account.uuid}
            account={account}
            inboxType={inbox?.type}
          />
        ))
      ) : (
        <Text textStyle="xs" color="fg.muted">
          You have no connected accounts. Use the buttons above to connect an
          account.
        </Text>
      )}
    </Stack>
  );
};
