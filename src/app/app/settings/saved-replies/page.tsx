"use client";

import {
  MainContent,
  ViewContent,
  ViewHeader,
} from "@/components/layout/content";
import { SettingsItem } from "@/components/layout/settings";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useGetQuickReplies } from "@/queries";
import {
  CardBody,
  CardDescription,
  CardRoot,
  CardTitle,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";
import { MdAssignmentAdd } from "react-icons/md";

export default function SavedRepliesPage() {
  const { data, isLoading } = useGetQuickReplies();

  return (
    <>
      <ViewContent>
        <Stack gap={4}>
          <HStack px={6} alignItems="center" justifyContent="space-between">
            <ViewHeader px={0} flex={1} href="/app/settings">
              Saved Replies
            </ViewHeader>
            <Link href="/app/settings/saved-replies/new">
              <Tooltip content="Create saved reply" openDelay={100}>
                <IconButton size="xs" rounded="full">
                  <LuPlus />
                </IconButton>
              </Tooltip>
            </Link>
          </HStack>
          {isLoading ? (
            <Flex h="50vh" alignItems="center" justifyContent="center">
              <Spinner />
            </Flex>
          ) : data?.quick_replies.length ? (
            <Stack gap={0}>
              {data?.quick_replies.map((reply) => (
                <SettingsItem.Root
                  key={reply.uuid}
                  href={`/app/settings/saved-replies/${reply.uuid}`}
                >
                  <SettingsItem.Icon>
                    <MdAssignmentAdd size={20} />
                  </SettingsItem.Icon>
                  <SettingsItem.Content>{reply.name}</SettingsItem.Content>
                </SettingsItem.Root>
              ))}
            </Stack>
          ) : (
            <Flex px={6} h="20vh" align="center" justify="center">
              <CardRoot borderWidth={0} shadow="sm" maxW="400px">
                <CardBody gap={2}>
                  <CardTitle textStyle="sm">No Saved Reply Created</CardTitle>
                  <CardDescription textStyle="xs">
                    Saved replies help you with quickly sending responses to
                    your customers. <br />
                    You don't have any saved reply created yet, use the button
                    below to create an saved reply.
                  </CardDescription>
                  <Link href="/app/settings/saved-replies/new">
                    <Button size="xs">
                      <LuPlus />
                      Create saved reply
                    </Button>
                  </Link>
                </CardBody>
              </CardRoot>
            </Flex>
          )}
        </Stack>
      </ViewContent>
      <MainContent />
    </>
  );
}
