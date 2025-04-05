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
import { IoCalendarNumber } from "react-icons/io5";
import { LuTrash2 } from "react-icons/lu";

export const BookingCard = (props: {
  booking: any;
  onDeleteBooking(): void;
}) => {
  const { booking: b, onDeleteBooking } = props;

  return (
    <CardRoot key={b.id}>
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
            <IoCalendarNumber />
          </Flex>
          <Stack gap={0} flex={1}>
            <CardTitle textStyle="sm">{b.title}</CardTitle>
            <CardDescription textStyle="xs">
              Happening{" "}
              {dayjs(new Date(b.start)).format("DD MMMM YYYY, hh:mma")} -{" "}
              {dayjs(new Date(b.end)).format("DD MMMM YYYY, hh:mma")}
            </CardDescription>
            <CardDescription textStyle="xs">
              Created {dayjs(new Date(b.createdAt)).format("DD MMMM YYYY")}
            </CardDescription>
          </Stack>
        </Stack>
        {["pending", "accepted"].includes(b.status) && (
          <IconButton
            size="xs"
            rounded="full"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteBooking();
            }}
          >
            <LuTrash2 />
          </IconButton>
        )}
      </CardBody>
    </CardRoot>
  );
};
