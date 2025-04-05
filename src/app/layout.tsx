import { Provider } from "@/components/ui/provider";
import { Box } from "@chakra-ui/react";
import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import "@calcom/atoms/globals.min.css";
import "./global.css";

export const metadata: Metadata = {
  title: "CRM Project",
  description:
    "Omichannel CRM for social apps like Facebook Messenger, WhatsApp and Instagram",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html dir="ltr" lang="en" suppressHydrationWarning>
        <body>
          <Provider>
            <Box colorPalette="green">{children}</Box>
          </Provider>
        </body>
      </html>
    </ViewTransitions>
  );
}
