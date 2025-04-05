"use client";

import { MainContent } from "@/components/layout/content";
import { AnimatedSearchBox } from "@/components/ui/animated-search-box";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { toaster } from "@/components/ui/toaster";
import { AutomationItemCard } from "@/components/views/automations/automation-item-card";
import { CreateAutomationModal } from "@/components/views/automations/create-automation-modal";
import { AppQueryKeys, useGetAutomations } from "@/queries";
import {
  ButtonGroup,
  CardBody,
  CardDescription,
  CardRoot,
  CardTitle,
  Container,
  Flex,
  HStack,
  IconButton,
  Pagination,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useDebounce, useSimpuProvider } from "@simpu/inbox-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
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
                    p={3}
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
                  <AutomationItemCard
                    rule={rule}
                    key={rule.uuid}
                    onDeleteRule={() => setRuleToDelete(rule)}
                  />
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
        <DeleteDialog
          open={!!ruleToDelete}
          title="Delete Automation"
          confirmBtnText="Delete Automation"
          isDeleting={isDeletingAutomation}
          caption="Are you sure you want to delete this automation? You can't undo this action once it's done."
          onDelete={handleDeleteAutomation}
          onOpenChange={({ open }) =>
            setRuleToDelete(open ? ruleToDelete : undefined)
          }
        />
      </Container>
    </MainContent>
  );
}
