"use client";

import { SessionProvider } from "next-auth/react";
import { StoreProvider } from "@/context/StoreContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <StoreProvider>{children}</StoreProvider>
    </SessionProvider>
  );
}
