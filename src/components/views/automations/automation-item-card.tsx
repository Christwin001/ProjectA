"use client";

import {
  CardBody,
  CardDescription,
  CardRoot,
  CardTitle,
  Flex,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { LuTrash2, LuWorkflow } from "react-icons/lu";
import { Rule } from "simpu-api-sdk";

export const AutomationItemCard = (props: {
  rule: Rule;
  onDeleteRule(): void;
}) => {
  const { rule, onDeleteRule } = props;

  const { push } = useRouter();

  return (
    <CardRoot
      key={rule.uuid}
      cursor="pointer"
      _hover={{
        bg: "bg.muted",
      }}
      onClick={() => push(`/app/automations/${rule.uuid}`)}
    >
      <CardBody
        p={3}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack gap={3} flex={1} direction="row" alignItems="center">
          <Flex
            bg="green"
            color="white"
            boxSize="40px"
            align="center"
            rounded="full"
            justify="center"
          >
            <LuWorkflow />
          </Flex>
          <Stack gap={0} flex={1}>
            <CardTitle textStyle="sm">{rule.name}</CardTitle>
            <CardDescription textStyle="xs">
              Created{" "}
              {dayjs(new Date(rule.created_datetime)).format("DD MMMM YYYY")}
            </CardDescription>
          </Stack>
        </Stack>
        <IconButton
          size="xs"
          rounded="full"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRule();
          }}
        >
          <LuTrash2 />
        </IconButton>
      </CardBody>
    </CardRoot>
  );
};
