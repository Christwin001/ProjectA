import { auth } from "@/auth";
import { Nav } from "@/components/layout/nav";
import { Toaster } from "@/components/ui/toaster";
import { HStack } from "@chakra-ui/react";
import { SimpuProvider } from "@simpu/inbox-sdk";
import { SessionProvider } from "next-auth/react";


export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider>
    <SimpuProvider
      colorPalette="green"
      accessToken={session?.user.token ?? ""}
      organisationID={session?.user.profile.organisation_id ?? ""}
      options={{
        env: "production",
        coreApiUrl: process.env.NEXT_PUBLIC_SIMPU_CORE_API_URL ?? "",
        conversationApiUrl:
          process.env.NEXT_PUBLIC_SIMPU_CONVERSATION_API_URL ?? "",
      }}
    >
      <HStack gap={0} h="100vh" w="full" overflowY="hidden">
        <Nav />
        {children}
      </HStack>
      <Toaster />
    </SimpuProvider>
    </SessionProvider>
  );
}
