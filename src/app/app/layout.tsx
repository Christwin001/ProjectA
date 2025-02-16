import { auth } from "@/auth";
import { Nav } from "@/components/layout/nav";
import { Toaster } from "@/components/ui/toaster";
import { HStack } from "@chakra-ui/react";
import { SimpuProvider } from "@simpu/inbox-sdk";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SimpuProvider
      colorPalette="green"
      accessToken={session?.user.token ?? ""}
      organisationID={session?.user.profile.organisation_id ?? ""}
    >
      <HStack gap={0} h="100vh" w="full" overflowY="hidden">
        <Nav />
        {children}
      </HStack>
      <Toaster />
    </SimpuProvider>
  );
}
