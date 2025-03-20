"use client";

import { useGetRuleTemplates } from "@/queries";
import { Input, Popover, Stack } from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { RuleTemplateItem } from "simpu-api-sdk";
import { AutomationActionButton } from "./action-button";
import { RuleMenuList } from "./components";

export const useTemplatesMenuOptions = (
  type: "trigger" | "condition" | "action" | "all"
) => {
  const [search, setSearch] = useState("");

  const { data } = useGetRuleTemplates(type, { category: search });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return {
    search,
    options: data?.templates,
    handleSearch,
  };
};

export const TemplatesMenu = (props: {
  label?: string;
  width?: string;
  search?: string;
  options?: RuleTemplateItem[];
  handleSearch?(value: string): void;
  onSelectItem(item: RuleTemplateItem): void;
}) => {
  let { label = "Filter", options, onSelectItem } = props;

  const [open, setOpen] = useState(false);

  const searchInputRef = useRef<any>();

  const data = useMemo(() => {
    return options?.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, RuleTemplateItem[]>);
  }, [options]);

  const [search, setSearch] = useState<string | undefined>(undefined);

  const handleClose = () => {
    setSearch(undefined);
    setOpen(false);
  };

  const handleSelectItem = (item: RuleTemplateItem) => {
    onSelectItem(item);
    handleClose();
  };

  return (
    <Popover.Root
      open={open}
      positioning={{ sameWidth: true }}
      initialFocusEl={() => searchInputRef.current}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <Popover.Trigger asChild>
        <AutomationActionButton onClick={() => setOpen(!open)} label={label} />
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content zIndex={10} width="100%">
          <Popover.Body p={4}>
            <Input
              size="xs"
              width="full"
              type="search"
              value={search}
              ref={searchInputRef}
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Stack pt={4} maxH="300px" overflowY="auto">
              {Object.keys(data ?? {})?.map((t) => (
                <RuleMenuList
                  key={t}
                  label={t}
                  onSelectItem={handleSelectItem}
                  icon={triggerIconRegister[t.toLowerCase()]}
                  options={data?.[t] ?? []}
                />
              ))}
            </Stack>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};

export const triggerIconRegister: { [key: string]: string } = {
  tag: "inbox-tag",
  time: "inbox-clock",
  tags: "inbox-tag",
  "recipient (email)": "inbox-mail",
  contacts: "inbox-contact",
  contact: "inbox-contact",
  team: "inbox-participants",
  teams: "inbox-participants",
  message: "inbox-plane",
  teammate: "inbox-person",
  teammates: "inbox-person",
  status: "inbox-empty-box",
  inbox: "inbox-new",
  comment: "inbox-chat-bubble",
  organization: "inbox-tag",
  content: "inbox-multiline-text",
};
