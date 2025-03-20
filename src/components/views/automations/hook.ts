import { useFormik } from "formik";
import debounce from "lodash/debounce";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RuleItemPayload } from "simpu-api-sdk";
import * as yup from "yup";
import { getRuleFormInitialValues } from "./automation-card";
import { useRouter } from "next/navigation";
import { AppQueryKeys } from "@/queries";
import { RuleFormProps, RuleFormValues } from "@/types";
import { useSimpuProvider } from "@simpu/inbox-sdk";
import { toaster } from "@/components/ui/toaster";

export const useRuleForm = ({
  initialValues,
}: Pick<RuleFormProps, "initialValues">) => {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { apiClient } = useSimpuProvider();

  const handleSaveForm = async () => {
    try {
      await queryClient.invalidateQueries({
        queryKey: [AppQueryKeys.getRules, initialValues?.uuid],
      });
      push("/app/automations");
    } catch (error) {}
  };

  const formikProps = useFormik<RuleFormValues>({
    enableReinitialize: true,
    onSubmit: handleSaveForm,
    validationSchema: yup.object().shape({
      name: yup.string().required("Automation name is required"),
    }),
    initialValues: initialValues
      ? getRuleFormInitialValues(initialValues)
      : {
          name: "",
          actions: [],
          triggers: [],
          conditions: [],
          is_active: true,
        },
  });

  const { values, setSubmitting } = formikProps;

  const handleUpdateRule = useCallback(
    debounce(async () => {
      try {
        setSubmitting(true);
        await apiClient.inbox.rules.updateRule(initialValues?.uuid ?? "", {
          name: values.name ?? "",
          is_active: values.is_active,
        });
      } catch (error: any) {
        toaster.create({
          title: "Error",
          description: error?.message ?? error,
        });
      } finally {
        setSubmitting(false);
        await queryClient.invalidateQueries({
          queryKey: [AppQueryKeys.getRules, initialValues?.uuid],
        });
      }
    }, 1000),
    [values.name, values.is_active, initialValues?.uuid]
  );

  const handleAddRuleItem = useCallback(
    debounce(
      async (payload: {
        items: RuleItemPayload[] | Array<RuleItemPayload[]>;
      }) => {
        try {
          setSubmitting(true);
          await apiClient.inbox.rules.addRuleItem(
            initialValues?.uuid ?? "",
            payload
          );
        } catch (error: any) {
          toaster.create({
            title: "Error",
            description: error?.message ?? error,
          });
        } finally {
          setSubmitting(false);
          await queryClient.invalidateQueries({
            queryKey: [AppQueryKeys.getRules, initialValues?.uuid],
          });
        }
      },
      500
    ),
    [initialValues?.uuid]
  );

  const handleUpdateRuleItem = useCallback(
    debounce(async (item_id: string, payload: RuleItemPayload["params"]) => {
      try {
        setSubmitting(true);
        await apiClient.inbox.rules.updateRuleItem(
          initialValues?.uuid ?? "",
          item_id,
          payload
        );
      } catch (error: any) {
        toaster.create({
          title: "Error",
          description: error?.message ?? error,
        });
      } finally {
        setSubmitting(false);
        await queryClient.invalidateQueries({
          queryKey: [AppQueryKeys.getRules, initialValues?.uuid],
        });
      }
    }, 500),
    [initialValues?.uuid]
  );

  const handleRemoveRuleItem = useCallback(
    debounce(async (item_id: string) => {
      try {
        setSubmitting(true);
        await apiClient.inbox.rules.removeRuleItem(initialValues?.uuid ?? "", [
          item_id,
        ]);
      } catch (error: any) {
        toaster.create({
          title: "Error",
          description: error?.message ?? error,
        });
      } finally {
        setSubmitting(false);
        await queryClient.invalidateQueries({
          queryKey: [AppQueryKeys.getRules, initialValues?.uuid],
        });
      }
    }, 500),
    [initialValues?.uuid]
  );

  const handleAddRuleConditionItem = useCallback(
    debounce(
      async (
        item_id: string,
        payload: { items: RuleItemPayload[] | Array<RuleItemPayload[]> }
      ) => {
        try {
          setSubmitting(true);
          await apiClient.inbox.rules.addRuleConditionItem(
            initialValues?.uuid ?? "",
            item_id,
            payload
          );
        } catch (error: any) {
          toaster.create({
            title: "Error",
            description: error?.message ?? error,
          });
        } finally {
          setSubmitting(false);
          await queryClient.invalidateQueries({
            queryKey: [AppQueryKeys.getRules, initialValues?.uuid],
          });
        }
      },
      500
    ),
    [initialValues?.uuid]
  );

  return {
    formikProps,
    handleUpdateRule,
    handleAddRuleItem,
    handleUpdateRuleItem,
    handleRemoveRuleItem,
    handleAddRuleConditionItem,
  };
};
