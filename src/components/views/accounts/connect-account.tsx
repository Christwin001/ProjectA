"use client";

import { PlatformAccount as Account } from "@simpu/inbox-sdk";
import { InboxType } from "simpu-api-sdk";
import { Stack, Text } from "@chakra-ui/react";
import React from "react";
import { BsInstagram, BsMessenger, BsWhatsapp } from "react-icons/bs";

export const ConnectAccount = ({
  inboxType = "personal",
}: {
  inboxType?: InboxType;
}) => {
  const referer = window.location.href;

  return (
    <Stack px={4}>
      <Text textStyle="sm" fontWeight="medium">
        Connect your accounts
      </Text>
      <Account.Connect
        size="xs"
        inboxType={inboxType}
        platform="whatsapp-web-md"
        onError={console.log}
      >
        <BsWhatsapp />
        Connect WhatsApp
      </Account.Connect>
      <Account.Connect
        size="xs"
        inboxType={inboxType}
        platform="instagram"
        connectSuccessUrl={referer ?? ""}
        connectFailureUrl={referer ?? ""}
      >
        <BsInstagram />
        Connect Instagram
      </Account.Connect>
      <Account.Connect
        size="xs"
        inboxType={inboxType}
        platform="messenger"
        connectSuccessUrl={referer ?? ""}
        connectFailureUrl={referer ?? ""}
      >
        <BsMessenger />
        Connect Messenger
      </Account.Connect>
    </Stack>
  );
};
