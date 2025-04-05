"use client";

import { toaster } from "@/components/ui/toaster";
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard";
import { CalEventType } from "@/types";
import {
  CardBody,
  CardDescription,
  CardRoot,
  CardTitle,
  Flex,
  HStack,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { IoCalendarNumber } from "react-icons/io5";
import { LuCopy, LuTrash2 } from "react-icons/lu";

export const BookingEventCard = (props: {
  event: CalEventType;
  onDeleteEvent(): void;
}) => {
  const { event, onDeleteEvent } = props;

  const { data: session } = useSession();
  const [copyState, copyToClipboard] = useCopyToClipboard();

  const handleCopyBookingLink = () => {
    copyToClipboard(
      `${process.env.NEXT_PUBLIC_API_URL}/create-booking/${session?.user.profile.user_id}?event=${event.slug}`
    );
    toaster.success({
      title: "Copied",
      description:
        "The booking link for this event is copied and you can share with your customers",
    });
  };

  return (
    <CardRoot>
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
            <CardTitle textStyle="sm">{event.title}</CardTitle>
            <CardDescription textStyle="xs">
              {event.description}
            </CardDescription>
          </Stack>
        </Stack>
        <HStack>
          <IconButton
            size="xs"
            rounded="full"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyBookingLink();
            }}
          >
            <LuCopy />
          </IconButton>
          <IconButton
            size="xs"
            rounded="full"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteEvent();
            }}
          >
            <LuTrash2 />
          </IconButton>
        </HStack>
      </CardBody>
    </CardRoot>
  );
};
