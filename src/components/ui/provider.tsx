"use client";

import { useGetCalAccessToken } from "@/queries";
import { CalProvider } from "@calcom/atoms";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { PropsWithChildren } from "react";
import { ColorModeProvider } from "./color-mode";
import { SimpuProvider } from "@simpu/inbox-sdk";

export function Provider(props: React.PropsWithChildren) {
  return (
   
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider>{props.children}</ColorModeProvider>
      </ChakraProvider>
  
  );
}

export const AppCalProvider = ({
  user_id,
  children,
}: PropsWithChildren<{ user_id?: string }>) => {
  const { data } = useGetCalAccessToken(user_id ?? "", {
    enabled: !!user_id,
  });

  return (
    <CalProvider
      accessToken={data?.accessToken}
      clientId={process.env.NEXT_PUBLIC_CAL_CLIENT_ID ?? ""}
      options={{
        apiUrl: process.env.NEXT_PUBLIC_CAL_API_URL ?? "",
        refreshUrl: `/api/refresh/${user_id}`,
      }}
    >
      {children}
    </CalProvider>
  );
};

export const WrappedSimpuProvider = (props: PropsWithChildren) => {
  const { data: session } = useSession();

  return (
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
      {props.children}
    </SimpuProvider>
  );
};
