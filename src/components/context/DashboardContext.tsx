"use client";
import React, { createContext, useContext, useState } from "react";

type cntxt = {
   sideOpen: boolean;
   setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DashboardContext = createContext<cntxt>({
   sideOpen: true || false,
   setSideOpen: () => false || true,
});

export function DashboardContextWrapper({ children }: { children: React.ReactNode }) {
   const [sideOpen, setSideOpen] = useState(false);
   return (
      <DashboardContext.Provider
         value={{
            sideOpen,
            setSideOpen,
         }}
      >
         {children}
      </DashboardContext.Provider>
   );
}

// Custom Hook for easy use
export function useDashboardContext() {
   return useContext(DashboardContext);
}
