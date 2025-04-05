"use client";

import { useGetCalManagedUser } from "@/queries";
import { Booker } from "@calcom/atoms";
import { Container, Flex, Heading, Spinner, Stack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function CreateBookingPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const eventTypeSlug = searchParams.get("event") as string;

  const { data, isLoading } = useGetCalManagedUser(
    session?.user.profile.user_id ?? ""
  );

  return (
    <Container maxW="5xl">
      {isLoading ? (
        <Flex align="center" justify="center" h="100vh">
          <Spinner />
        </Flex>
      ) : (
        <Stack py={12} gap={8}>
          <Heading>Book a session with us</Heading>
          <Booker
            eventSlug={eventTypeSlug}
            username={data?.username ?? ""}
            onCreateBookingSuccess={() => {
              console.log("booking created successfully");
            }}
          />
        </Stack>
      )}
    </Container>
  );
}
