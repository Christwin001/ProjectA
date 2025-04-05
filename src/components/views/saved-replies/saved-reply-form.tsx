"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { FormikConfig, useFormik } from "formik";
import { QuickReplyPayload } from "simpu-api-sdk";
import * as yup from "yup";
import { DeleteSavedReplyModal } from "./delete-saved-reply-modal";

export const SavedReplyForm = (props: {
  id?: string;
  initialValues?: QuickReplyPayload;
  onSubmit: FormikConfig<QuickReplyPayload>["onSubmit"];
}) => {
  const { id, initialValues, onSubmit } = props;

  const { values, errors, touched, isSubmitting, handleSubmit, handleChange } =
    useFormik<QuickReplyPayload>({
      onSubmit,
      enableReinitialize: true,
      validationSchema: yup.object().shape({
        name: yup.string().required("Name is required"),
        template: yup.object().shape({
          body: yup.string().required("Content is required"),
        }),
      }),
      initialValues: initialValues ?? {
        name: "",
        template: {
          body: "",
        },
      },
    });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={6}>
        <Stack px={4}>
          <Text textStyle="sm" fontWeight="medium">
            Name
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
              placeholder="Saved reply name"
              onChange={handleChange}
            />
          </Field>
        </Stack>
        <Stack px={4}>
          <Text textStyle="sm" fontWeight="medium">
            Content
          </Text>
          <Field
            errorText={errors.template?.body}
            invalid={!!touched.template?.body && !!errors.template?.body}
          >
            <Textarea
              size="sm"
              variant="flushed"
              name="template.body"
              value={values.template?.body}
              placeholder="Example: Hello, how can I help you today?"
              onChange={handleChange}
            />
          </Field>
        </Stack>
        <Stack direction="row" px={4} justify="flex-end">
          {id && <DeleteSavedReplyModal id={id} />}
          <Button w="80px" type="submit" size="xs" loading={isSubmitting}>
            Save
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
