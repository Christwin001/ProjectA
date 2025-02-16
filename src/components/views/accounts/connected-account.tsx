"use client";

import {
  PlatformAccount as Account,
  AccountPlatformIcon,
  Account as SimpuAccountType,
} from "@simpu/inbox-sdk";
import { Avatar } from "@/components/ui/avatar";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";

export const ConnectedAccount = (props: { account?: SimpuAccountType }) => {
  const { account } = props;

  return (
    <Flex
      py={2}
      px={3}
      shadow="xs"
      rounded="sm"
      align="center"
      justify="space-between"
    >
      <HStack flex={1} align="center">
        <Box position="relative">
          <AccountPlatformIcon platform={account?.channel_name ?? ""} />
          <Avatar
            name={account?.name ?? ""}
            src={account?.user.image_url ?? ""}
          />
        </Box>
        <Text textStyle="sm" fontWeight="medium">
          {account?.name ?? account?.user.name}
        </Text>
      </HStack>
      <HStack align="center">
        <Account.Disconnect
          size="sm"
          variant="ghost"
          account={account}
          colorPalette="red"
        >
          <BsTrash />
        </Account.Disconnect>
      </HStack>
    </Flex>
  );
};
