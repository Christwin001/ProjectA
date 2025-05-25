"use client";
import { AppCalProvider } from "@/components/ui/provider";
import { useGetCalManagedUser } from "@/queries";
import { Booker } from "@calcom/atoms";
import { Container, Flex, Heading, Spinner, Stack, ChakraProvider, defaultSystem} from "@chakra-ui/react";
import { useSearchParams, useParams } from "next/navigation";

export default function CreateBookingPage() {
  const searchParams = useSearchParams();
  const { user_id } = useParams<{ user_id: string }>();

  const eventTypeSlug = searchParams.get("event") as string;

  const { data, isLoading } = useGetCalManagedUser(
   user_id ?? ""
  );

  return (
    <ChakraProvider value={defaultSystem}>
      <AppCalProvider user_id={user_id}>
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
    </AppCalProvider>
    </ChakraProvider>
  );
}
