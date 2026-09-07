import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
   title: {
      default: "سیستم گردش کار",
      template: "%s | سیستم گردش کار",
   },
   description: "سیستم مدیریت گردش کار، دپارتمان‌ها و تسک‌ها",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="fa" dir="rtl">
         <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
         </head>
         <body className="min-h-screen font-sans antialiased">
            <ToastProvider>{children}</ToastProvider>
         </body>
      </html>
   );
}
