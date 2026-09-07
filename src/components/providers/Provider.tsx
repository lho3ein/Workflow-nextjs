"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { DashboardContextWrapper } from "@/components/context/DashboardContext";

export default function Providers({ children }: { children: React.ReactNode }) {
   return (
      <SessionProvider>
         <DashboardContextWrapper>{children}</DashboardContextWrapper>
      </SessionProvider>
   );
}
