"use client";

import { MainContent } from "@/components/layout/content";
import { AnimatedSearchBox } from "@/components/ui/animated-search-box";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { toaster } from "@/components/ui/toaster";
import { BookingCard } from "@/components/views/bookings/booking-card";
import { useGetCalAccessToken } from "@/queries";
import { useBookings } from "@calcom/atoms";
import {
  CardBody,
  CardDescription,
  CardRoot,
  CardTitle,
  Container,
  Flex,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useDebounce } from "@simpu/inbox-sdk";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { LuSettings } from "react-icons/lu";

export default function BookingsPage() {
  const { push, refresh } = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const q = searchParams.get("q");
  const pageParam = searchParams.get("page");

  const page = pageParam ? Number(pageParam) : 1;
  const user_id = session?.user.profile.user_id;

  const [search, setSearch] = useState(q);
  const [isCreatingCalUser, setIsCreatingCalUser] = useState(false);
  const [isCancellingBooking, setIsCancellingBooking] = useState(false);
  const [status, setStatus] = useState<"upcoming" | "past">("upcoming");
  const [bookingToCancel, setBookingToCancel] = useState<any | undefined>();

  const debouncedSearch = useDebounce(search ?? "", 1000);

  const { data } = useGetCalAccessToken(user_id ?? "", {
    enabled: !!user_id,
  });

  const { isLoading: isLoadingBookings, data: bookings } = useBookings({
    take: 50,
    skip: page - 1,
    status: [status],
    attendeeName: debouncedSearch || undefined,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    push(value ? `?q=${value}&page=${page}` : `?page=${page}`);
  };

  const handleCreateCalManagedUser = async () => {
    try {
      setIsCreatingCalUser(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-cal-managed-user`,
        {
          method: "POST",
          body: JSON.stringify({
            timeZone: "Africa/Lagos",
            email: session?.user.profile.email,
            userId: session?.user.profile.user_id,
            name: `${session?.user.profile.first_name} ${session?.user.profile.last_name}`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error creating cal managed user");
      }

      refresh();
      push("/app/bookings/settings");
    } catch (error: any) {
      toaster.create({
        type: "error",
        title: "Error",
        description: error.message ?? error,
      });
    } finally {
      setIsCreatingCalUser(false);
    }
  };

  const handleSetupBooking = async () => {
    if (!data?.accessToken) {
      await handleCreateCalManagedUser();
    } else {
      push("/app/bookings/settings");
    }
  };

  const handleCancelBooking = async () => {
    try {
      setIsCancellingBooking(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CAL_API_URL}/bookings/${bookingToCancel?.id}/cancel`,
        {
          method: "DELETE",
          headers: {
            "cal-api-verion": "2024-06-14",
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting event");
      }

      setBookingToCancel(undefined);
      toaster.success({
        title: "Success",
        description: "Booking cancelled successfully",
      });
    } catch (error: any) {
      toaster.error({
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsCancellingBooking(false);
    }
  };

  return (
    <MainContent w="calc(100% - 64px)" overflowY="auto">
      <Container py={8} maxW="4xl">
        <Stack gap={8}>
          <Flex
            spaceY={2}
            flexWrap="wrap"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text textStyle="lg" fontWeight="bold">
              Bookings ({bookings?.length ?? 0})
            </Text>
            <HStack alignItems="center" flexWrap="wrap">
              <AnimatedSearchBox
                value={search ?? ""}
                placeholder="Search bookings by attendee name"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Button
                size="xs"
                loading={isCreatingCalUser}
                onClick={handleSetupBooking}
              >
                <LuSettings /> Booking settings
              </Button>
            </HStack>
          </Flex>
          {isLoadingBookings ? (
            <Stack gap={4}>
              {Array.from({ length: 5 }, (v, i) => (
                <CardRoot key={`${i.toString()}-${new Date().getTime()}`}>
                  <CardBody
                    p={3}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack flex={1} direction="row" alignItems="center">
                      <SkeletonCircle height="50px" width="50px" />
                      <Stack flex={1}>
                        <Skeleton h="8px" w="160px" />
                        <Skeleton w="80px" h="8px" mt="8px" />
                      </Stack>
                    </Stack>
                    <Skeleton rounded="sm" boxSize="20px" />
                  </CardBody>
                </CardRoot>
              ))}
            </Stack>
          ) : !!bookings?.length ? (
            <Stack gap={4}>
              {bookings?.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onDeleteBooking={() => setBookingToCancel(b)}
                />
              ))}
            </Stack>
          ) : (
            <Flex h="70vh" align="center" justify="center">
              <CardRoot borderWidth={0} shadow="sm" maxW="400px">
                <CardBody gap={3}>
                  <CardTitle textStyle="sm">
                    {search ? "No Bookings Found" : "No Bookings Created"}
                  </CardTitle>
                  <CardDescription textStyle="xs">
                    {search
                      ? `You don't have an booking with the attendee ${search}`
                      : "You don't have any bookings created yet, use the button copy your booking link and share it with your customers."}
                  </CardDescription>
                  <HStack>
                    <Button
                      size="xs"
                      loading={isCreatingCalUser}
                      onClick={handleSetupBooking}
                    >
                      <LuSettings /> Setup booking options
                    </Button>
                  </HStack>
                </CardBody>
              </CardRoot>
            </Flex>
          )}
        </Stack>
      </Container>
      <DeleteDialog
        title="Cancel Booking"
        open={!!bookingToCancel}
        confirmBtnText="Cancel Booking"
        isDeleting={isCancellingBooking}
        caption="Are you sure you want to cancel this booking? You can't undo this action once it's done."
        onDelete={handleCancelBooking}
        onOpenChange={({ open }) =>
          setBookingToCancel(open ? bookingToCancel : undefined)
        }
      />
    </MainContent>
  );
}
