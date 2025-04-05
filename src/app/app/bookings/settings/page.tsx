"use client";

import { MainContent, ViewHeader } from "@/components/layout/content";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { toaster } from "@/components/ui/toaster";
import { BookingEventCard } from "@/components/views/bookings/booking-event-card";
import { useGetCalAccessToken, useGetCalManagedUser } from "@/queries";
import { CalEventType } from "@/types";
import { AvailabilitySettings, useEventTypes } from "@calcom/atoms";
import {
  Button,
  Container,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function BookingsSettingsPage() {
  const { data: session } = useSession();

  const user_id = session?.user.profile.user_id;

  const { data: accessTokenData } = useGetCalAccessToken(user_id ?? "", {
    enabled: !!user_id,
  });
  const { data } = useGetCalManagedUser(user_id ?? "", { enabled: !!user_id });

  const { isLoading: isLoadingEvents, data: eventTypes } = useEventTypes(
    data?.username ?? ""
  );

  const [eventToDelete, setEventToDelete] = useState<
    CalEventType | undefined
  >();
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);

  const handleDeleteEvent = async () => {
    try {
      setIsDeletingEvent(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CAL_API_URL}/event-types/${eventToDelete?.id}`,
        {
          method: "DELETE",
          headers: {
            "cal-api-verion": "2024-06-14",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessTokenData?.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting event");
      }

      setEventToDelete(undefined);
      toaster.success({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error: any) {
      toaster.error({
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsDeletingEvent(false);
    }
  };

  return (
    <MainContent w="calc(100% - 64px)" overflowY="auto">
      <Container py={8} maxW="4xl">
        <Stack gap={8}>
          <ViewHeader
            px={0}
            flex={1}
            href="/app/bookings"
            labelProps={{ textStyle: "lg", fontWeight: "bold" }}
          >
            Booking settings
          </ViewHeader>

          <Stack gap={4}>
            <Stack direction="row" align="center" justify="space-between">
              <HStack>
                <Heading textStyle="md" fontWeight="semibold">
                  Events
                </Heading>
                {isLoadingEvents && <Spinner size="xs" />}
              </HStack>
              <Link href="/app/bookings/new-event">
                <Button size="xs">Create New Event</Button>
              </Link>
            </Stack>
            {eventTypes?.length ? (
              <Stack>
                {eventTypes.map((event) => (
                  <BookingEventCard
                    event={event}
                    key={event.id}
                    onDeleteEvent={() => setEventToDelete(event)}
                  />
                ))}
              </Stack>
            ) : (
              <Text color="fg.muted" textStyle="sm" fontWeight="medium">
                No event created yet. Create one by clicking the button above.
              </Text>
            )}
          </Stack>

          <Stack gap={4}>
            <Heading textStyle="md" fontWeight="semibold">
              Availability Settings
            </Heading>
            <AvailabilitySettings
              onUpdateSuccess={() => {
                console.log("Updated schedule successfully");
              }}
              onDeleteSuccess={() => {
                console.log("Deleted schedule successfully");
              }}
              customClassNames={{
                containerClassName: "availability-settings__container",
                editableHeadingClassName:
                  "availability-settings__editable-heading",
              }}
            />
          </Stack>
        </Stack>
      </Container>
      <DeleteDialog
        title="Delete Event"
        open={!!eventToDelete}
        confirmBtnText="Delete Event"
        isDeleting={isDeletingEvent}
        caption="Are you sure you want to delete this event? You can't undo this action once it's done."
        onDelete={handleDeleteEvent}
        onOpenChange={({ open }) =>
          setEventToDelete(open ? eventToDelete : undefined)
        }
      />
    </MainContent>
  );
}
