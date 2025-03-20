"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";
import { AppQueryKeys, useGetOrganisation } from "@/queries";
import { Box, Input, Stack, Text } from "@chakra-ui/react";
import { useSimpuProvider } from "@simpu/inbox-sdk";
import { Organization } from "simpu-api-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";

export const BusinessNameForm = () => {
  const queryClient = useQueryClient();
  const { apiClient } = useSimpuProvider();
  const { data: organisation } = useGetOrganisation();

  const handleBusinessNameUpdate = async (
    values: Partial<Organization>,
    formikHelpers: FormikHelpers<Partial<Organization>>
  ) => {
    formikHelpers.setSubmitting(true);
    try {
      await apiClient.organisation.updateOrganisation({
        ...organisation,
        name: values.name ?? "",
      });
      await queryClient.invalidateQueries({
        queryKey: [AppQueryKeys.getOrganisation],
      });
    } catch (error: any) {
      formikHelpers.setSubmitting(false);
      toaster.create({
        title: "Error",
        description: error.message ?? error,
      });
    }
  };

  const { values, errors, touched, isSubmitting, handleSubmit, handleChange } =
    useFormik<Partial<Organization>>({
      enableReinitialize: true,
      onSubmit: handleBusinessNameUpdate,
      initialValues: organisation ?? {
        name: "",
      },
      validationSchema: yup.object().shape({
        name: yup.string().required("Name is required"),
      }),
    });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={3}>
        <Stack px={4}>
          <Text textStyle="sm" fontWeight="medium">
            Your business name
          </Text>
          <Field
            errorText={errors.name}
            invalid={!!touched.name && !!errors.name}
          >
            <Input
              size="sm"
              type="text"
              name="name"
              variant="flushed"
              value={values.name}
              placeholder="Business name"
              onChange={handleChange}
            />
          </Field>
        </Stack>
        <Box px={4}>
          <Button w="full" type="submit" size="xs" loading={isSubmitting}>
            Save
          </Button>
        </Box>
      </Stack>
    </form>
  );
};
