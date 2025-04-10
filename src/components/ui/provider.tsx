"use client";

import { useGetCalAccessToken } from "@/queries";
import { CalProvider } from "@calcom/atoms";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { SessionProvider, useSession } from "next-auth/react";
import { PropsWithChildren } from "react";
import { ColorModeProvider } from "./color-mode";
import { SimpuProvider } from "@simpu/inbox-sdk";

export function Provider(props: React.PropsWithChildren) {
  return (
    <SessionProvider>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider>{props.children}</ColorModeProvider>
      </ChakraProvider>
    </SessionProvider>
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
    >
      {props.children}
    </SimpuProvider>
  );
};
