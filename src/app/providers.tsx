"use client";

import { StoreProvider } from "@/context/StoreContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoreProvider>{children}</StoreProvider>;
}
