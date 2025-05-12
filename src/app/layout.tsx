import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "TSender",
};

/** Everything rendered starts from here. This is the root layout.
 * Everything in the app is wrapped in this layout.
 * Gives every page access the everyting in here.
 */

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {/* The main content of the app */}
          {props.children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
