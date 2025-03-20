import { SystemStyleObject } from "@chakra-ui/react";
import { TooltipProps } from "recharts";
import { Rule, RuleItem, Account, Tag, QuickReply, Inbox } from "simpu-api-sdk";

export type { CurveType } from "recharts/types/shape/Curve";

export interface BaseChartProps {
  /**
   * The data to be displayed in the chart.
   */
  data: Record<string, string | number>[];
  /**
   * The data keys to be displayed in the chart.
   */
  categories?: string[];
  /**
   * The colors to use for each category.
   */
  colors?: string[];
  /**
   * The y-axis data key to use.
   * @default 'date'
   */
  index?: string;
  /**
   * If set 0, all the ticks will be shown. If set preserveStart", "preserveEnd" or "preserveStartEnd", the ticks which is to be shown or hidden will be calculated automatically.
   */
  intervalType?:
    | "preserveStartEnd"
    | "equidistantPreserveStart"
    | "preserveStart"
    | "preserveEnd"
    | number;
  /**
   * The height of the chart.
   */
  height: SystemStyleObject["height"];
  /**
   * Format the value of the x-axis.
   * @param value
   */
  valueFormatter?(value: number): string;
  /**
   * Show decimals on the y-axis.
   */
  allowDecimals?: boolean;
  /**
   * Wether to show the animation or not.
   */
  showAnimation?: boolean;
  /**
   * Wether to show the grid or not.
   */
  showGrid?: boolean;
  /**
   * Wether to show the legend or not.
   */
  showLegend?: boolean;
  /**
   * Wether to show the tooltip or not.
   */
  showTooltip?: boolean;
  /**
   * Wether to show the x-axis or not.
   */
  showXAxis?: boolean;
  /**
   * Wether to show the y-axis or not.
   */
  showYAxis?: boolean;
  /**
   * Animation duration in milliseconds.
   */
  animationDuration?: number;
  /**
   * Only show the start and end ticks on the x-axis.
   */
  startEndOnly?: boolean;
  /**
   * Render custom tooltip content.
   */
  tooltipContent?(props: TooltipProps<any, any>): React.ReactNode;
  /**
   * Width of the y-axis labels.
   */
  yAxisWidth?: number;
  /**
   * Height of the legend.
   */
  legendHeight?: number;
  /**
   * Children to render.
   */
  children?: React.ReactNode;
}

export interface RuleFormProps {
  title: string;
  initialValues?: Rule;
}

export interface RuleFormItem
  extends Pick<RuleItem, "name" | "schema" | "uuid" | "params"> {
  slug?: string;
}

export interface RuleFormValues extends Pick<Rule, "name" | "is_active"> {
  triggers: RuleFormItem[];
  actions: RuleFormItem[];
  conditions: { uuid: string; rule_id: string; group: RuleFormItem[] }[];
}

export interface RuleFormItemCardProps extends RuleFormItem {
  onDelete?: () => void;
  onChange?: (data: Record<string, any>) => void;
}

export interface RuleFormItemProfileType {
  uuid: string;
  type: string;
  name: string;
  image_url?: string;
}

export interface RuleCardProps {
  tags?: Tag[];
  inboxes?: Inbox[];
  data: RuleFormItem;
  channels?: Account[];
  simpuChannels?: any[];
  quickReplies?: QuickReply[];
  onDelete?: () => void;
  onChange?: (data: RuleFormItem) => void;
}

export interface RuleCardTypeProps<T> {
  data: T;
  icon: string;
  label: string;
  schemaKey: string;
  showAssignmentOption?: boolean;
  onDelete: RuleCardProps["onDelete"];
  onChange?: (items: any, key: string) => void;
}
