"use client";

import { MainContent } from "@/components/layout/content";
import { Button } from "@/components/ui/button";
import { CloseButton } from "@/components/ui/close-button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { toaster } from "@/components/ui/toaster";
import { AnimatedSearchBox } from "@/components/ui/animated-search-box";
import { CreateAutomationModal } from "@/components/views/automations/create-automation-modal";
import { AppQueryKeys, useGetAutomations } from "@/queries";
import {
  ButtonGroup,
  CardBody,
  CardDescription,
  CardRoot,
  CardTitle,
  Container,
  DialogActionTrigger,
  DialogRoot,
  Flex,
  HStack,
  IconButton,
  Pagination,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useDebounce, useSimpuProvider } from "@simpu/inbox-sdk";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuTrash2,
  LuWorkflow,
} from "react-icons/lu";
import { Rule } from "simpu-api-sdk";

export default function AutomationsPage() {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { apiClient } = useSimpuProvider();

  const q = searchParams.get("q");
  const pageParam = searchParams.get("page");

  const page = pageParam ? Number(pageParam) : 1;

  const [search, setSearch] = useState(q);
  const [ruleToDelete, setRuleToDelete] = useState<Rule | undefined>();
  const [isDeletingAutomation, setIsDeletingAutomation] = useState(false);

  const debouncedSearch = useDebounce(search ?? "", 1000);

  const { isLoading, data } = useGetAutomations({
    page,
    q: debouncedSearch || undefined,
  });

  const { meta, rules } = data ?? {};

  const handleSearch = (value: string) => {
    setSearch(value);
    push(value ? `?q=${value}&page=${page}` : `?page=${page}`);
  };

  const handleDeleteAutomation = async () => {
    if (ruleToDelete) {
      try {
        setIsDeletingAutomation(true);
        await apiClient.inbox.rules.deleteRule([ruleToDelete.uuid ?? ""]);
        await queryClient.invalidateQueries({
          queryKey: [AppQueryKeys.getRules],
        });
        setRuleToDelete(undefined);
      } catch (error: any) {
        toaster.create({
          title: "Error",
          description: error?.message ?? error,
        });
      } finally {
        setIsDeletingAutomation(false);
      }
    }
  };

  return (
    <MainContent w="calc(100% - 64px)" overflowY="auto">
      <Container py={8} maxW="4xl">
        <Stack gap={8}>
          <Flex
            spaceY={2}
            flexWrap="wrap"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text textStyle="lg" fontWeight="bold">
              Automations ({meta?.count ?? 0})
            </Text>
            <HStack alignItems="center" flexWrap="wrap">
              <AnimatedSearchBox
                value={search ?? ""}
                placeholder="Search automations by name"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <CreateAutomationModal />
            </HStack>
          </Flex>
          {isLoading ? (
            <Stack gap={4}>
              {Array.from({ length: 5 }, (v, i) => (
                <CardRoot key={`${i.toString()}-${new Date().getTime()}`}>
                  <CardBody
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack flex={1} direction="row" alignItems="center">
                      <SkeletonCircle height="50px" width="50px" />
                      <Stack flex={1}>
                        <Skeleton h="8px" w="160px" />
                        <Skeleton w="80px" h="8px" mt="8px" />
                      </Stack>
                    </Stack>
                    <Skeleton rounded="sm" boxSize="20px" />
                  </CardBody>
                </CardRoot>
              ))}
            </Stack>
          ) : !!rules?.length ? (
            <>
              <Stack gap={4}>
                {rules?.map((rule: Rule) => (
                  <CardRoot
                    key={rule.uuid}
                    cursor="pointer"
                    _hover={{
                      bg: "bg.muted",
                    }}
                    onClick={() => push(`/app/automations/${rule.uuid}`)}
                  >
                    <CardBody
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack
                        gap={3}
                        flex={1}
                        direction="row"
                        alignItems="center"
                      >
                        <Flex
                          bg="green"
                          color="white"
                          boxSize="40px"
                          align="center"
                          rounded="full"
                          justify="center"
                        >
                          <LuWorkflow />
                        </Flex>
                        <Stack gap={0} flex={1}>
                          <CardTitle textStyle="sm">{rule.name}</CardTitle>
                          <CardDescription textStyle="xs">
                            Created{" "}
                            {dayjs(new Date(rule.created_datetime)).format(
                              "DD MMMM YYYY"
                            )}
                          </CardDescription>
                        </Stack>
                      </Stack>
                      <IconButton
                        size="xs"
                        rounded="full"
                        variant="subtle"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRuleToDelete(rule);
                        }}
                      >
                        <LuTrash2 />
                      </IconButton>
                    </CardBody>
                  </CardRoot>
                ))}
              </Stack>
              <Pagination.Root
                page={page}
                maxW="240px"
                count={meta?.count ?? 0}
                pageSize={meta?.page_size}
                onPageChange={({ page }) =>
                  push(
                    `?${new URLSearchParams({
                      page: page.toString(),
                      q: search ?? "",
                    })}`
                  )
                }
              >
                <ButtonGroup variant="ghost" size="xs" w="full">
                  <Pagination.PrevTrigger asChild>
                    <IconButton>
                      <LuChevronLeft />
                    </IconButton>
                  </Pagination.PrevTrigger>
                  <Pagination.NextTrigger asChild>
                    <IconButton>
                      <LuChevronRight />
                    </IconButton>
                  </Pagination.NextTrigger>
                </ButtonGroup>
              </Pagination.Root>
            </>
          ) : (
            <Flex h="70vh" align="center" justify="center">
              <CardRoot borderWidth={0} shadow="sm" maxW="400px">
                <CardBody gap={3}>
                  <CardTitle textStyle="sm">
                    {search ? "No Automations Found" : "No Automations Created"}
                  </CardTitle>
                  <CardDescription textStyle="xs">
                    {search
                      ? `You don't have an automation with the name ${search}`
                      : "Automations help you with automating messages responses to your customers.\n\n You don't have any automations created yet, use the button below to create an automation"}
                  </CardDescription>
                  {!search && <CreateAutomationModal alignSelf="flex-start" />}
                </CardBody>
              </CardRoot>
            </Flex>
          )}
        </Stack>
        {ruleToDelete && (
          <DialogRoot
            open={!!ruleToDelete}
            onOpenChange={({ open }) =>
              setRuleToDelete(open ? ruleToDelete : undefined)
            }
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Automation</DialogTitle>
              </DialogHeader>
              <DialogBody>
                Are you sure you want to delete this automation? You can&apos;t
                undo this action once it&apos;s done.
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button size="xs" type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogActionTrigger>
                <Button
                  size="xs"
                  colorPalette="red"
                  loading={isDeletingAutomation}
                  onClick={handleDeleteAutomation}
                >
                  Delete Automation
                </Button>
              </DialogFooter>
              <DialogCloseTrigger asChild>
                <CloseButton type="button" size="xs" />
              </DialogCloseTrigger>
            </DialogContent>
          </DialogRoot>
        )}
      </Container>
    </MainContent>
  );
}
