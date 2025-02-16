"use client";

import { Suspense } from "react";
import { NewChatView } from "./new";
import { ThreadsView } from "./threads";

export const ChatsView = () => {
  return (
    <>
      <Suspense>
        <ThreadsView />
      </Suspense>
      <Suspense>
        <NewChatView />
      </Suspense>
    </>
  );
};
