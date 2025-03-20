import { useSimpuProvider } from "@simpu/inbox-sdk";
import {
  ChannelIntegration,
  CSATRatingDistribution,
  InboxMetaResponse,
  Organization,
  Rule,
  RuleTemplateItem,
} from "simpu-api-sdk";
import {
  useQuery,
  UseQueryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";

type QueryOptions<T> = Omit<UseQueryOptions<T>, "queryFn" | "queryKey">;

export enum AppQueryKeys {
  "getRules" = "get-rules",
  "getOrganisation" = "get-organisation",
  "getQuickReplies" = "get-quick-replies",
  "getCSATAverageRating" = "get-csat-average-rating",
  "getReportMainMetrics" = "get-report-main-metrics",
  "getReportMetricsOvertime" = "get-report-metrics-over-time",
  "getCSATRatingDistribution" = "get-csat-rating-distribution",
  "getSimpuChannelIntegrations" = "get-simpu-supported-channel-integrations",
}

export const useGetOrganisation = (options?: QueryOptions<Organization>) => {
  const { apiClient } = useSimpuProvider();

  return useQuery<Organization>({
    queryKey: [AppQueryKeys.getOrganisation],
    queryFn: apiClient.organisation.getOrganisation,
    ...options,
  });
};

export const useGetCSATAverageRating = (
  params: {
    end_date: string;
    start_date: string;
  },
  options?: QueryOptions<
    {
      average_rating: string;
      organisation_id: string;
    }[]
  >
) => {
  const { start_date, end_date } = params;
  const { apiClient } = useSimpuProvider();

  return useSuspenseQuery<
    {
      average_rating: string;
      organisation_id: string;
    }[]
  >({
    queryKey: [AppQueryKeys.getCSATAverageRating],
    queryFn: () =>
      apiClient.reports.getOrganisationAvergeRating({
        start_date,
        end_date,
      }),
    ...options,
  });
};

export const useGetCSATRatingDistribution = (
  params: {
    end_date: string;
    start_date: string;
  },
  options?: QueryOptions<CSATRatingDistribution[]>
) => {
  const { start_date, end_date } = params;
  const { apiClient } = useSimpuProvider();

  return useSuspenseQuery<CSATRatingDistribution[]>({
    queryKey: [AppQueryKeys.getCSATRatingDistribution, start_date, end_date],
    queryFn: () =>
      apiClient.reports.getOrganisationRatingDistribution({
        start_date,
        end_date,
      }),
    ...options,
  });
};

export const useGetReportMainMetrics = (
  params: {
    end?: string;
    start?: string;
    reports: string[];
    period_unit?: string;
    period_value?: number;
  },
  options?: QueryOptions<any>
) => {
  const { start, end, reports, period_unit, period_value } = params;
  const { apiClient } = useSimpuProvider();

  return useSuspenseQuery<any>({
    queryKey: [
      AppQueryKeys.getReportMainMetrics,
      end,
      start,
      reports,
      period_unit,
      period_value,
    ],
    queryFn: () =>
      apiClient.reports.getInboxMetricsReport({
        end,
        start,
        reports,
        period_unit,
        period_value,
      }),
    ...options,
  });
};

export const useGetReportMetricsOvertime = (
  params: {
    end?: string;
    start?: string;
    reports: string[];
    period_unit?: string;
    period_value?: number;
  },
  options?: QueryOptions<any>
) => {
  const { start, end, reports, period_unit, period_value } = params;
  const { apiClient } = useSimpuProvider();

  return useSuspenseQuery<any>({
    queryKey: [
      AppQueryKeys.getReportMetricsOvertime,
      end,
      start,
      reports,
      period_unit,
      period_value,
    ],
    queryFn: () =>
      apiClient.reports.getInboxMetricsOvertimeReport({
        end,
        start,
        reports,
        period_unit,
        period_value,
      }),
    ...options,
  });
};

export const useGetSimpuSupportedChannels = (
  params?: {
    q?: string | undefined;
    page?: number | undefined;
    per_page?: number | undefined;
    channel_id?: string[] | undefined;
  },
  options?: UseQueryOptions<{
    meta: InboxMetaResponse;
    integrations: ChannelIntegration[];
  }>
) => {
  const { apiClient } = useSimpuProvider();

  return useQuery<{
    meta: InboxMetaResponse;
    integrations: ChannelIntegration[];
  }>({
    queryKey: [AppQueryKeys.getSimpuChannelIntegrations],
    queryFn: () => apiClient.inbox.integrations.getIntegrations(params),
    ...options,
  });
};

export const useGetQuickReplies = () => {
  const { apiClient } = useSimpuProvider();

  return useQuery({
    queryKey: [AppQueryKeys.getQuickReplies],
    queryFn: () =>
      apiClient.inbox.quick_replies.getQuickReplies("shared", {
        page: 1,
        per_page: 1000,
      }),
  });
};

export const useGetAutomations = (
  params?: { q?: string; page?: number; per_page?: number },
  options?: UseQueryOptions<{
    rules: Rule[];
    meta: InboxMetaResponse;
  }>
) => {
  const { apiClient } = useSimpuProvider();

  const { q, page = 1, per_page = 25 } = params ?? {};

  return useQuery<{
    meta: InboxMetaResponse;
    rules: Rule[];
  }>({
    queryKey: [AppQueryKeys.getRules, q, page, per_page],
    queryFn: () => apiClient.inbox.rules.getRules({ q, page, per_page }),
    ...options,
  });
};

export const useGetAutomation = (
  id: string,
  options?: UseQueryOptions<Rule>
) => {
  const { apiClient } = useSimpuProvider();

  return useQuery<Rule>({
    queryKey: [AppQueryKeys.getRules, id],
    queryFn: () => apiClient.inbox.rules.getRule(id),
    ...options,
  });
};

export const useGetRuleTemplates = (
  type: "trigger" | "condition" | "action" | "all" = "all",
  params?: {
    name?: string;
    page?: number;
    per_page?: number;
    category?: string;
    status?: "active" | "inactive" | "all";
  },
  options?: UseQueryOptions<{
    meta: InboxMetaResponse;
    templates: RuleTemplateItem[];
  }>
) => {
  const {
    name,
    category,
    page = 1,
    per_page = 100,
    status = "active",
  } = params ?? {};

  const { apiClient } = useSimpuProvider();

  return useQuery<{
    meta: InboxMetaResponse;
    templates: RuleTemplateItem[];
  }>({
    queryKey: [`rule-templates-${type}`, page, per_page, category, status],
    queryFn: () =>
      apiClient.inbox.rules.getRuleTemplates(type, {
        name,
        page,
        status,
        per_page,
        category,
      }),
    ...options,
  });
};
