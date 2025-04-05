"use client";

import {
  AppCalProvider,
  Provider,
  WrappedSimpuProvider,
} from "@/components/ui/provider";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

export default function CreateBookingPageLayout({
  children,
}: PropsWithChildren) {
  const { user_id } = useParams<{ user_id: string }>();

  return (
    <Provider>
      <WrappedSimpuProvider>
        <AppCalProvider user_id={user_id}>{children}</AppCalProvider>
      </WrappedSimpuProvider>
    </Provider>
  );
}
