"use client";

import { useGetQuickReplies, useGetSimpuSupportedChannels } from "@/queries";
import {
  RuleCardTypeProps,
  RuleFormItemCardProps,
  RuleFormValues,
} from "@/types";
import {
  Box,
  CardBody,
  CardRoot,
  Flex,
  IconButton,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import { ElementType, ReactNode, useEffect, useMemo, useState } from "react";
import { LuChevronDown, LuX } from "react-icons/lu";
import { ChannelIntegration, QuickReply, Rule } from "simpu-api-sdk";
import { OptionsMenu } from "./options-menu";

export const AutomationFormItemCard = (props: RuleFormItemCardProps) => {
  const { schema, name, params, onChange, onDelete } = props;

  return (
    <CardRoot>
      <CardBody py={2} px={4}>
        <Flex gap={2} alignItems="center" justifyContent="space-between">
          <Stack flex={1} direction="row" alignItems="center">
            <Text textStyle="sm" color="fg.muted" fontWeight="medium">
              {name}
            </Text>
            {schema && (
              <>
                {schema.map((s) => {
                  const Component = schemaTypeComponentRegister[s.type];
                  return (
                    <Component
                      key={s.key}
                      schemaKey={s.key}
                      onChange={onChange}
                      data={params?.[s.key]}
                    />
                  );
                })}
              </>
            )}
          </Stack>
          <IconButton
            size="xs"
            variant="subtle"
            rounded="full"
            onClick={onDelete}
          >
            <LuX />
          </IconButton>
        </Flex>
      </CardBody>
    </CardRoot>
  );
};

const ChannelCard = (props: RuleCardTypeProps<ChannelIntegration>) => {
  const { schemaKey: key, data, onChange } = props;

  const [search, setSearch] = useState("");

  const { data: userIntegrations } = useGetSimpuSupportedChannels();

  const channels = useMemo(
    () =>
      (userIntegrations?.integrations ?? []).filter(({ name }) =>
        name?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      ),
    [userIntegrations, search]
  );

  const [selectedOption, setSelectedOption] = useState<
    ChannelIntegration | undefined
  >(data);

  const handleChannelSelect = (channel: ChannelIntegration) => {
    setSelectedOption(channel);
    onChange?.({ [key]: channel }, key);
  };

  return (
    <OptionsMenu<ChannelIntegration>
      type="multi"
      options={channels ?? []}
      onSelectItem={handleChannelSelect}
      onSearch={(query) => setSearch(query)}
      renderItem={({ name }) => <Text textStyle="xs">{name}</Text>}
      isItemSelected={(item) => item.uuid === selectedOption?.uuid}
      triggerButtonProps={{
        children: (
          <>
            {!selectedOption ? (
              <Text textStyle="xs">Select account</Text>
            ) : (
              <Text textStyle="xs">
                {
                  channels.find((item) => item.uuid === selectedOption.uuid)
                    ?.name
                }
              </Text>
            )}
            <LuChevronDown />
          </>
        ),
      }}
    />
  );
};

const FilterCard = (props: RuleCardTypeProps<string>) => {
  const { schemaKey: key, data, onChange } = props;

  const [fieldType, setFieldType] = useState(data ?? "contains");

  const handleFieldTypeSelect = ({
    value,
  }: {
    label: string;
    value: string;
  }) => {
    setFieldType(value);

    onChange?.({ [key]: value }, key);
  };

  useEffect(() => {
    if (data) {
      setFieldType(data);
    } else {
      setFieldType("contains");
    }
  }, [data]);

  return (
    <OptionsMenu<{ label: string; value: string }>
      options={filterOptions}
      popoverContentProps={{
        maxW: "150px",
      }}
      onSelectItem={handleFieldTypeSelect}
      renderItem={(item: { label: string; value: string }) => (
        <Stack direction="row" alignItems="center">
          <Text textStyle="xs">{item.label}</Text>
        </Stack>
      )}
      triggerButtonProps={{
        children: (
          <>
            <Text textStyle="xs">
              {filterOptions.find((item) => item.value === fieldType)?.label}
            </Text>
            <LuChevronDown />
          </>
        ),
      }}
      isItemSelected={(item) => item.value === fieldType}
    />
  );
};

const FilterInputCard = (props: RuleCardTypeProps<string>) => {
  const { schemaKey: key, data, onChange } = props;

  const handleSubmitFieldData = (values: { data: string }) => {
    onChange?.({ [key]: values.data }, key);
  };

  const { values, handleChange, submitForm } = useFormik<{ data: string }>({
    enableReinitialize: true,
    onSubmit: handleSubmitFieldData,
    initialValues: { data: data ?? "" },
  });

  return (
    <Input
      size="xs"
      name="data"
      value={values.data}
      onBlur={submitForm}
      onChange={handleChange}
      placeholder="Enter content"
    />
  );
};

const TemplateCard = (props: RuleCardTypeProps<QuickReply>) => {
  const { schemaKey: key, data, onChange } = props;

  const [search, setSearch] = useState("");

  const [selectedOption, setSelectedOption] = useState<QuickReply | undefined>(
    data
  );

  const { data: quickReplies } = useGetQuickReplies();

  const templates = useMemo(
    () =>
      (quickReplies?.quick_replies ?? []).filter(({ name }) =>
        name?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      ),
    [quickReplies, search]
  );

  const handleTemplateSelect = (template: QuickReply) => {
    setSelectedOption(template);
    onChange?.({ [key]: template }, key);
  };

  return (
    <OptionsMenu<QuickReply>
      options={templates ?? []}
      onSelectItem={handleTemplateSelect}
      onSearch={(query) => setSearch(query)}
      isItemSelected={(item) => item.uuid === selectedOption?.uuid}
      renderItem={(item: QuickReply) => (
        <Stack direction="row" alignItems="center">
          <Text textStyle="xs">{item.name}</Text>
        </Stack>
      )}
      triggerButtonProps={{
        width: "auto",
        textAlign: "left",
        justifyContent: "flex-start",
        children: (
          <>
            <Text textStyle="xs">
              {templates.find((t) => t.uuid === selectedOption?.uuid)?.name ??
                "Select a template"}
            </Text>
            <LuChevronDown />
          </>
        ),
      }}
    />
  );
};

const TemplateReplyFrequencyCard = (props: RuleCardTypeProps<boolean>) => {
  const { data, schemaKey: key, onChange } = props;

  const [frequency, setFrequency] = useState(!!data ? "Once" : "Always");

  const handleFrequencySelect = (frequency: string) => {
    setFrequency(frequency);

    const replyOnce = frequency.toLowerCase() === "once" ? true : false;

    onChange?.({ [key]: replyOnce }, key);
  };

  return (
    <OptionsMenu<string>
      options={["Once", "Always"]}
      onSelectItem={handleFrequencySelect}
      popoverContentProps={{ maxW: "150px" }}
      renderItem={(item: string) => (
        <Stack direction="row" alignItems="center">
          <Text textStyle="xs">{item}</Text>
        </Stack>
      )}
      triggerButtonProps={{
        children: (
          <>
            <Text textStyle="xs">{frequency}</Text>
            <LuChevronDown />
          </>
        ),
      }}
      isItemSelected={(item) => item.toLowerCase() === frequency.toLowerCase()}
    />
  );
};

const filterOptions: { label: string; value: string }[] = [
  { label: "Contains", value: "contains" },
  { label: "Starts with", value: "starts-with" },
  { label: "Ends with", value: "ends-with" },
  { label: "Is equal to", value: "is-equal-to" },
  { label: "Is in domain", value: "is-in-domain" },
  { label: "Does not contain", value: "does-not-contain" },
  { label: "Is not in domain", value: "is-not-in-domain" },
];

const schemaTypeComponentRegister: Record<string, ElementType> = {
  text: FilterInputCard,
  integration: ChannelCard,
  "quick-reply": TemplateCard,
  "text-operator": FilterCard,
  boolean: TemplateReplyFrequencyCard,
};

export function SelectedOption<T>(props: {
  label: string;
  leftSection?: (option?: T) => ReactNode;
}) {
  const { leftSection, label } = props;

  return (
    <Stack direction="row" alignItems="center">
      {leftSection?.()}
      <Text flex={1} truncate textStyle="xs" textTransform="capitalize">
        {label}
      </Text>
    </Stack>
  );
}

export function SelectedOptions<
  T extends { id?: string; label?: string }
>(props: {
  options: T[];
  conjunctionText?: string;
  leftSection?: (option?: T) => ReactNode;
}) {
  const { options, leftSection, conjunctionText = "or" } = props;

  return (
    <Stack direction="row" alignItems="center" overflow="hidden">
      {options
        .filter((_, index) => index <= 1)
        .map((option, index) => (
          <Stack
            pr="0.25rem"
            direction="row"
            alignItems="center"
            key={option.id}
          >
            <Box>
              <SelectedOption
                label={option.label ?? ""}
                leftSection={leftSection}
              />
            </Box>
            {index !== options.length - 1 && (
              <Text textStyle="xs" color="fg.muted" textAlign="center">
                {conjunctionText}
              </Text>
            )}
          </Stack>
        ))}
      {options.length > 2 && (
        <Stack
          gap={0}
          px={2}
          py={1}
          direction="row"
          rounded="100px"
          borderWidth="1px"
          alignItems="center"
        >
          <Text textStyle="xs" fontWeight="medium">
            + {options.length - 2}
          </Text>
        </Stack>
      )}
    </Stack>
  );
}

export const getRuleFormItemParamsDefaultValue = (
  schema: Record<string, any>
) => {
  if (schema) {
    if ("array" in schema) {
      return [];
    }

    if (schema.type === "text-operator") {
      return "contains";
    }

    if (schema.type === "assigning-type") {
      return "random";
    }

    return null;
  }
  return null;
};

export const getRuleFormInitialValues = (rule: Rule): RuleFormValues => {
  const triggers = (rule.triggers ?? []).map((i) => ({
    name: i.name,
    uuid: i.uuid,
    schema: i.schema,
    params: i.params,
    slug: i.slug,
  }));
  const actions = (rule.actions ?? []).map((i) => ({
    name: i.name,
    uuid: i.uuid,
    schema: i.schema,
    params: i.params,
    slug: i.slug,
  }));
  const conditions = (rule.conditions ?? []).map((g) => ({
    ...g,
    group: g.group.map((i) => ({
      name: i.name,
      uuid: i.uuid,
      schema: i.schema,
      params: i.params,
      slug: i.slug,
    })),
  }));

  return {
    actions,
    triggers,
    conditions,
    name: rule.name,
    is_active: rule.is_active,
  };
};

export const formatRuleItemParams = (params: Record<string, any>) => {
  const obj: Record<string, any> = {};
  Object.keys(params).forEach((k) => {
    const value = params[k];

    if (isArray(value)) {
      obj[k] = value.map((i: any) => i.uuid ?? i.id);
    } else if (isPlainObject(value)) {
      obj[k] = value.uuid;
    } else {
      obj[k] = value;
    }
  });

  return obj;
};
