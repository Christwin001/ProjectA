"use client";

import {
  Box,
  Button,
  FieldErrorText,
  Flex,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { RuleFormItem, RuleFormProps } from "@/types";
import { RuleTemplateItem } from "simpu-api-sdk";
import { useRuleForm } from "./hook";
import {
  formatRuleItemParams,
  getRuleFormItemParamsDefaultValue,
  AutomationFormItemCard,
} from "./automation-card";
import { TemplatesMenu, useTemplatesMenuOptions } from "./templates-menu";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { LuArrowLeft } from "react-icons/lu";
import { Link } from "next-view-transitions";

export const AutomationView = (props: RuleFormProps) => {
  const { title, initialValues } = props;

  const { back } = useRouter();

  const initialInputRef = useRef<HTMLInputElement>(null);

  const {
    formikProps,
    handleUpdateRule,
    handleAddRuleItem,
    handleUpdateRuleItem,
    handleRemoveRuleItem,
    handleAddRuleConditionItem,
  } = useRuleForm({
    initialValues,
  });

  const actionTemplatesMenuOptions = useTemplatesMenuOptions("action");
  const triggerTemplatesMenuOptions = useTemplatesMenuOptions("trigger");
  const conditionTemplatesMenuOptions = useTemplatesMenuOptions("condition");

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    submitForm,
    setFieldValue,
  } = formikProps;

  const handleInputBlur = () => {
    handleUpdateRule();
  };

  const handleAddTrigger = (option: RuleTemplateItem) => {
    const { uuid, name, schema, slug } = option;
    const params = (schema ? {} : null) as any;

    schema?.forEach((s) => {
      params[s.key] = getRuleFormItemParamsDefaultValue(s);
    });

    const ruleItem = {
      slug,
      name,
      uuid,
      schema,
      params,
    };
    const newTriggers = [...values.triggers, ruleItem];

    setFieldValue("triggers", newTriggers);

    handleAddRuleItem({ items: [{ slug, params }] });
  };

  const handleUpdateTrigger = (
    triggerToUpdate: RuleFormItem,
    params: Record<string, any>
  ) => {
    const newParams = { ...triggerToUpdate.params, ...params };
    const ruleItemParams = formatRuleItemParams(newParams);

    setFieldValue(
      "triggers",
      values.triggers.map((trigger) => {
        if (trigger.uuid === triggerToUpdate.uuid) {
          return { ...triggerToUpdate, params: newParams };
        }
        return trigger;
      })
    );

    handleUpdateRuleItem(triggerToUpdate.uuid, ruleItemParams);
  };

  const handleRemoveTrigger = async (triggerToRemove: RuleFormItem) => {
    setFieldValue(
      "triggers",
      values.triggers.filter((trigger) => trigger.uuid !== triggerToRemove.uuid)
    );

    handleRemoveRuleItem(triggerToRemove.uuid);
  };

  const handleAddAction = (option: RuleTemplateItem) => {
    const { uuid, name, schema, slug } = option;
    const params = (schema ? {} : null) as any;

    schema?.forEach((s) => {
      params[s.key] = getRuleFormItemParamsDefaultValue(s);
    });

    const ruleItem = {
      slug,
      name,
      uuid,
      schema,
      params,
    };
    const newActions = [...values.actions, ruleItem];

    setFieldValue("actions", newActions);

    handleAddRuleItem({ items: [{ slug, params }] });
  };

  const handleUpdateAction = (
    actionToUpdate: RuleFormItem,
    params: Record<string, any>
  ) => {
    const newParams = { ...actionToUpdate.params, ...params };
    const ruleItemParams = formatRuleItemParams(newParams);

    const newActions = values.actions.map((action) => {
      if (action.uuid === actionToUpdate.uuid) {
        return { ...actionToUpdate, params: newParams };
      }
      return action;
    });

    setFieldValue("actions", newActions);

    handleUpdateRuleItem(actionToUpdate.uuid, ruleItemParams);
  };

  const handleRemoveAction = (actionToRemove: RuleFormItem) => {
    const actions = values.actions.filter(
      (action) => action.uuid !== actionToRemove.uuid
    );

    setFieldValue("actions", actions);

    handleRemoveRuleItem(actionToRemove.uuid);
  };

  const handleAddConditionGroup = (
    option: RuleTemplateItem,
    conditionGroupIndex?: number
  ) => {
    const { uuid, name, schema, slug } = option;
    const params = (schema ? {} : null) as any;

    schema?.forEach((s) => {
      params[s.key] = getRuleFormItemParamsDefaultValue(s);
    });

    const ruleItem = {
      slug,
      name,
      uuid,
      schema,
      params,
    };

    if (conditionGroupIndex === undefined) {
      setFieldValue("conditions", [
        ...values?.conditions,
        {
          group: [ruleItem],
        },
      ]);
    } else {
      const conditionToUpdate = values.conditions.find(
        (_, index) => index === conditionGroupIndex
      );
      const updatedConditions = values.conditions.map((item, index) => {
        if (conditionGroupIndex === index) {
          return {
            ...conditionToUpdate,
            group: [...(conditionToUpdate?.group ?? []), ruleItem],
          };
        } else {
          return item;
        }
      });

      setFieldValue("conditions", updatedConditions);
    }

    handleAddRuleItem({ items: [{ slug, params }] });
  };

  const handleAddConditionGroupItem = (
    option: RuleTemplateItem,
    conditionGroupUuid: string,
    conditionGroupIndex?: number
  ) => {
    const { uuid, name, schema, slug } = option;
    const params = (schema ? {} : null) as any;

    schema?.forEach((s) => {
      params[s.key] = getRuleFormItemParamsDefaultValue(s);
    });

    const ruleItem = {
      slug,
      name,
      uuid,
      schema,
      params,
    };

    if (conditionGroupIndex === undefined) {
      setFieldValue("conditions", [
        ...values?.conditions,
        {
          group: [ruleItem],
        },
      ]);
    } else {
      const conditionToUpdate = values.conditions.find(
        (_, index) => index === conditionGroupIndex
      );
      const updatedConditions = values.conditions.map((item, index) => {
        if (conditionGroupIndex === index) {
          return {
            ...conditionToUpdate,
            group: [...(conditionToUpdate?.group ?? []), ruleItem],
          };
        } else {
          return item;
        }
      });

      setFieldValue("conditions", updatedConditions);
    }

    handleAddRuleConditionItem(conditionGroupUuid, {
      items: [{ slug, params }],
    });
  };

  const handleUpdateCondition = (
    conditionToUpdate: RuleFormItem,
    params: Record<string, any>,
    conditionIndex: number,
    conditionGroupIndex: number
  ) => {
    const newParams = { ...conditionToUpdate.params, ...params };
    const ruleItemParams = formatRuleItemParams(newParams);

    const updatedConditionGroups = (values.conditions ?? []).map(
      (conditionGroup, groupIndex) => {
        if (conditionGroupIndex === groupIndex) {
          return {
            ...conditionGroup,
            group: conditionGroup.group.map((condition: any, index: number) => {
              if (conditionIndex === index) {
                return { ...conditionToUpdate, params: newParams };
              }
              return condition;
            }),
          };
        }
        return conditionGroup;
      }
    );

    setFieldValue("conditions", updatedConditionGroups);

    handleUpdateRuleItem(conditionToUpdate.uuid, ruleItemParams);
  };

  const handleRemoveCondition = (
    conditionToRemove: RuleFormItem,
    conditionGroupIndex?: number
  ) => {
    const updatedConditionGroups = (values.conditions ?? []).map(
      (item, index) => {
        if (conditionGroupIndex === index) {
          if (item.group.length === 1) {
            return undefined;
          } else {
            return {
              ...item,
              group: item.group.filter(
                (condition: any) => condition.uuid !== conditionToRemove.uuid
              ),
            };
          }
        }
        return item;
      }
    );

    setFieldValue(
      "conditions",
      updatedConditionGroups.filter((item) => !!item)
    );

    handleRemoveRuleItem(conditionToRemove.uuid);
  };

  useEffect(() => {
    if (initialInputRef.current) {
      initialInputRef.current.focus();
    }
  }, []);

  return (
    <>
      <Flex
        spaceY={2}
        pb="1.5rem"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack>
          <Link href="/app/automations">
            <IconButton size="sm" rounded="full" variant="ghost">
              <LuArrowLeft />
            </IconButton>
          </Link>
          <Text textStyle="lg" fontWeight="bold">
            {title}
          </Text>
        </HStack>
        <Stack gap={4} direction="row">
          {isSubmitting && (
            <Text textStyle="xs" color="fg.muted">
              Saving...
            </Text>
          )}
          <Stack direction="row" alignItems="center">
            <Text textStyle="sm" fontWeight="medium" color="fg.muted">
              Automation is active
            </Text>
            <Switch
              size="sm"
              name="is_active"
              onBlur={handleInputBlur}
              checked={values.is_active}
              onCheckedChange={({ checked }) =>
                setFieldValue("is_active", checked)
              }
            />
          </Stack>
        </Stack>
      </Flex>
      <Stack gap={6}>
        <Field label="Name" invalid={!!touched.name && !!errors.name}>
          <Input
            size="sm"
            name="name"
            type="text"
            value={values.name}
            ref={initialInputRef}
            onChange={handleChange}
            onBlur={handleInputBlur}
            placeholder="Enter the name of your automation"
          />
          <FieldErrorText>{errors.name}</FieldErrorText>
        </Field>
        <Stack>
          <Text textStyle="sm" fontWeight="medium">
            When...
          </Text>
          {!!(values.triggers ?? []).length && (
            <Stack pb={4}>
              {(values.triggers ?? []).map((trigger) => {
                return (
                  <Stack pb={2} key={trigger.uuid}>
                    <AutomationFormItemCard
                      {...trigger}
                      onDelete={() => handleRemoveTrigger(trigger)}
                      onChange={(params) =>
                        handleUpdateTrigger(trigger, params)
                      }
                    />
                    <Text
                      textStyle="xs"
                      textAlign="center"
                      textTransform="uppercase"
                    >
                      or
                    </Text>
                  </Stack>
                );
              })}
            </Stack>
          )}
          <TemplatesMenu
            label="Trigger"
            onSelectItem={handleAddTrigger}
            options={triggerTemplatesMenuOptions.options
              ?.filter((o) => o.category.toLowerCase() === "message")
              .filter(
                (o) => !values.triggers.map((t) => t.slug).includes(o.slug)
              )}
            search={triggerTemplatesMenuOptions.search}
            handleSearch={triggerTemplatesMenuOptions.handleSearch}
          />
        </Stack>
        <Stack>
          <Text textStyle="sm" fontWeight="medium">
            If...
          </Text>
          {!!(values.conditions ?? []).length && (
            <Stack pb={4}>
              {values.conditions.map((condition, conditionGroupIndex) => (
                <Box
                  p={2}
                  mb={2}
                  rounded="sm"
                  bg="bg.muted"
                  key={`${conditionGroupIndex}`}
                >
                  <Stack pb={2}>
                    {condition.group.map((groupItem, conditionIndex) => (
                      <Stack key={groupItem.slug}>
                        <AutomationFormItemCard
                          {...groupItem}
                          key={groupItem.uuid}
                          onDelete={() =>
                            handleRemoveCondition(
                              groupItem,
                              conditionGroupIndex
                            )
                          }
                          onChange={(params) =>
                            handleUpdateCondition(
                              groupItem,
                              params,
                              conditionIndex,
                              conditionGroupIndex
                            )
                          }
                        />
                        <Text
                          textStyle="xs"
                          color="fg.muted"
                          textAlign="center"
                          textTransform="uppercase"
                        >
                          or
                        </Text>
                      </Stack>
                    ))}
                  </Stack>
                  <TemplatesMenu
                    label="Or condition"
                    onSelectItem={(item) =>
                      handleAddConditionGroupItem(
                        item,
                        condition.uuid,
                        conditionGroupIndex
                      )
                    }
                    options={conditionTemplatesMenuOptions.options
                      ?.filter((o) => o.category.toLowerCase() === "content")
                      .filter(
                        (o) =>
                          !values.conditions[conditionGroupIndex].group
                            .map((t) => t.slug)
                            .includes(o.slug)
                      )}
                    search={conditionTemplatesMenuOptions.search}
                    handleSearch={conditionTemplatesMenuOptions.handleSearch}
                  />
                </Box>
              ))}
            </Stack>
          )}
          <TemplatesMenu
            label="And condition"
            onSelectItem={handleAddConditionGroup}
            options={conditionTemplatesMenuOptions.options?.filter(
              (o) => o.category.toLowerCase() === "content"
            )}
            search={conditionTemplatesMenuOptions.search}
            handleSearch={conditionTemplatesMenuOptions.handleSearch}
          />
        </Stack>
        <Stack>
          <Text textStyle="sm" fontWeight="medium">
            Then...
          </Text>
          {!!(values.actions ?? []).length && (
            <Stack pb={4}>
              {(values.actions ?? []).map((action) => {
                return (
                  <AutomationFormItemCard
                    {...action}
                    key={action.uuid}
                    onDelete={() => handleRemoveAction(action)}
                    onChange={(params) => handleUpdateAction(action, params)}
                  />
                );
              })}
            </Stack>
          )}
          <TemplatesMenu
            label="Action"
            onSelectItem={handleAddAction}
            options={actionTemplatesMenuOptions.options
              ?.filter((o) => o.category.toLowerCase() === "message")
              .filter(
                (o) => !values.actions.map((t) => t.slug).includes(o.slug)
              )}
            search={actionTemplatesMenuOptions.search}
            handleSearch={actionTemplatesMenuOptions.handleSearch}
          />
        </Stack>
        <Stack justifyContent="flex-end" direction="row" alignItems="center">
          <Button size="xs" variant="outline" onClick={() => back()}>
            Cancel
          </Button>
          <Button size="xs" loading={isSubmitting} onClick={submitForm}>
            Save
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
