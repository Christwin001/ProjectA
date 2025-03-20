"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import {
  PlatformAccount as Account,
  AccountPlatformIcon,
} from "@simpu/inbox-sdk";
import { InboxType, Account as SimpuAccountType } from "simpu-api-sdk";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LuCircleX, LuPencil, LuTrash } from "react-icons/lu";
import { AccountSettingsForm } from "./account-settings-form";

export const ConnectedAccount = (props: {
  inboxType?: InboxType;
  account: SimpuAccountType;
}) => {
  const { inboxType = "personal", account } = props;

  const [showSettings, setShowSettings] = useState(false);

  return (
    <Box py={2} px={3} shadow="xs" rounded="sm">
      <AnimatePresence mode="wait">
        <Flex align="center" justify="space-between">
          <HStack flex={1} align="center">
            <Box position="relative">
              <AccountPlatformIcon platform={account.channel_name ?? ""} />
              <Avatar
                src={account.user.image_url ?? ""}
                name={account.name ?? account.user.name ?? ""}
              />
            </Box>
            <Text textStyle="sm" fontWeight="medium">
              {showSettings
                ? "Account settings"
                : account.name ?? account.user.name}
            </Text>
          </HStack>
          <HStack gap={1} align="center" position="relative">
            {inboxType === "shared" && (
              <motion.div
                transition={{
                  duration: 0.3,
                  ease: "easeIn",
                }}
                animate={{
                  x: showSettings ? 40 : 0,
                }}
              >
                {showSettings ? (
                  <Button
                    size="2xs"
                    rounded="full"
                    variant="ghost"
                    onClick={() => setShowSettings(false)}
                  >
                    <LuCircleX />
                  </Button>
                ) : (
                  <Button
                    size="2xs"
                    rounded="full"
                    variant="ghost"
                    onClick={() => setShowSettings(true)}
                  >
                    <LuPencil />
                  </Button>
                )}
              </motion.div>
            )}
            <motion.div
              transition={{
                duration: 0.3,
                ease: "easeIn",
              }}
              animate={{
                x: showSettings ? 20 : 0,
                visibility: showSettings ? "hidden" : "visible",
              }}
            >
              <Account.Disconnect
                size="2xs"
                variant="ghost"
                rounded="full"
                account={account}
                colorPalette="red"
                inboxType={inboxType}
              >
                <LuTrash />
              </Account.Disconnect>
            </motion.div>
          </HStack>
        </Flex>
        {showSettings && (
          <motion.div
            transition={{
              duration: 0.3,
              ease: "easeIn",
            }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
          >
            <AccountSettingsForm
              accountId={account.uuid}
              accountSettings={{
                name: account.name ?? account.channel_name ?? "",
                allow_rating: account.meta?.allow_rating ?? false,
              }}
              onSaveSuccess={() => setShowSettings(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
