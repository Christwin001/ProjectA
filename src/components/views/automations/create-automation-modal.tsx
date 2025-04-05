"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { CloseButton } from "@/components/ui/close-button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";
import { AppQueryKeys } from "@/queries";
import { DialogActionTrigger, FieldErrorText, Input } from "@chakra-ui/react";
import { useAccountConnectOptions, useSimpuProvider } from "@simpu/inbox-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { FormikHelpers, useFormik } from "formik";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import * as yup from "yup";

export const CreateAutomationModal = (props: ButtonProps) => {
  const queryClient = useQueryClient();
  const { apiClient } = useSimpuProvider();
  const { inbox } = useAccountConnectOptions({ inboxType: "shared" });

  const [open, setOpen] = useState(false);

  const handleCreateRule = async (
    values: { name: string },
    helpers: FormikHelpers<{ name: string }>
  ) => {
    try {
      helpers.setSubmitting(true);
      const rule = await apiClient.inbox.rules.createRule(values);
      inbox && apiClient.inbox.inboxes.addInboxRule(inbox?.uuid, rule.uuid);
      await queryClient.invalidateQueries({
        queryKey: [AppQueryKeys.getRules],
      });
      helpers.setSubmitting(false);
    } catch (error: any) {
      helpers.setSubmitting(false);
      toaster.create({
        type: "error",
        title: "Error",
        description: error?.message ?? error,
      });
    } finally {
      setOpen(false);
    }
  };

  const { values, errors, touched, isSubmitting, handleChange, handleSubmit } =
    useFormik({
      initialValues: { name: "" },
      validationSchema: yup.object().shape({
        name: yup.string().required("Automation name is required"),
      }),
      onSubmit: handleCreateRule,
    });

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button size="xs" {...props}>
          <LuPlus />
          New Automation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Automation</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Field
              required
              label="Name"
              invalid={!!(touched.name && errors.name)}
            >
              <Input
                size="xs"
                id="name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                placeholder="Enter a name for the automation"
              />
              <FieldErrorText>{errors.name}</FieldErrorText>
            </Field>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button size="xs" type="button" variant="outline">
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              size="xs"
              type="submit"
              colorPalette="green"
              loading={isSubmitting}
            >
              Create Automation
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger asChild>
          <CloseButton type="button" size="xs" />
        </DialogCloseTrigger>
      </DialogContent>
    </DialogRoot>
  );
};
