import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import Logo from "../components/logo";
import { Toaster } from "sonner";
import { ReduxProvider } from "@/store/reduxProvider";
import PendingModal from "@/components/pending-modal";
import TwemojiWrapper from "@/components/TwemojiWrapper";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <TwemojiWrapper>
          <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <main className="min-h-screen flex flex-col items-center">
                <div className="flex-1 w-full h-full flex flex-col  ">
                  <div className="flex flex-col h-full  flex-1">{children}</div>
                </div>
                <Toaster
                  className={geistSans.className}
                  position="top-center"
                />

                <PendingModal />
              </main>
            </ThemeProvider>
          </ReduxProvider>
        </TwemojiWrapper>
      </body>
    </html>
  );
}
