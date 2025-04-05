"use client";

import { AppCalProvider } from "@/components/ui/provider";
import { useSession } from "next-auth/react";
import React, { PropsWithChildren } from "react";

export default function BookingsPageLayout({ children }: PropsWithChildren) {
  const { data: session } = useSession();

  return (
    <AppCalProvider user_id={session?.user.profile.user_id}>
      {children}
    </AppCalProvider>
  );
}
