"use client";

import {
  useAccountConnectOptions,
  useGetInboxAccounts,
} from "@simpu/inbox-sdk";
import { Stack, Text } from "@chakra-ui/react";
import { ConnectedAccount } from "./connected-account";

export const ConnectedAccounts = () => {
  const { inbox } = useAccountConnectOptions();

  const { data } = useGetInboxAccounts(inbox?.uuid ?? "", { enabled: !!inbox });

  return (
    <Stack>
      {!!data?.length ? (
        data?.map((account) => (
          <ConnectedAccount key={account.uuid} account={account} />
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
