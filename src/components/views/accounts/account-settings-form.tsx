"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";
import { HStack, Input, Stack, Text } from "@chakra-ui/react";
import { QueryKeys, useSimpuProvider } from "@simpu/inbox-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { FormikHelpers, useFormik } from "formik";

interface AccountSettings {
  name: string;
  allow_rating: boolean;
}

export const AccountSettingsForm = (props: {
  accountId: string;
  accountSettings: AccountSettings;
  onSaveSuccess?(): void;
}) => {
  const { accountId, accountSettings, onSaveSuccess } = props;

  const queryClient = useQueryClient();
  const { apiClient } = useSimpuProvider();

  const handleAccountSettingsUpdate = async (
    values: AccountSettings,
    formikHelpers: FormikHelpers<AccountSettings>
  ) => {
    formikHelpers.setSubmitting(true);
    try {
      await apiClient.inbox.accounts.updateAccount(accountId, values);
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.getInboxAccounts],
      });
      onSaveSuccess?.();
    } catch (error: any) {
      formikHelpers.setSubmitting(false);
      toaster.create({
        title: "Error",
        description: error.message ?? error,
      });
    }
  };

  const { values, errors, touched, isSubmitting, handleSubmit, handleChange } =
    useFormik<AccountSettings>({
      enableReinitialize: true,
      initialValues: accountSettings,
      onSubmit: handleAccountSettingsUpdate,
    });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={3} mt={4} pt={4} borderTopWidth={1}>
        <Stack>
          <Text textStyle="sm" fontWeight="medium">
            Account name
          </Text>
          <Field
            errorText={errors.name}
            invalid={!!touched.name && !!errors.name}
          >
            <Input
              size="sm"
              type="text"
              name="name"
              value={values.name}
              placeholder="Account name"
              onChange={handleChange}
            />
          </Field>
        </Stack>
        <HStack>
          <Stack gap={0} flex={1}>
            <Text textStyle="sm" fontWeight="medium">
              Allow CSAT rating
            </Text>
            <Text textStyle="xs" color="fg.muted">
              Use CSAT ratings to get real-time feedback from your customers.
            </Text>
          </Stack>
          <Switch
            name="allow_rating"
            onChange={handleChange}
            checked={values.allow_rating}
          />
        </HStack>
        <Button
          size="xs"
          w="150px"
          type="submit"
          alignSelf="flex-start"
          loading={isSubmitting}
        >
          Save
        </Button>
      </Stack>
    </form>
  );
};
