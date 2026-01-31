import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "利群 (Liquun) - 个人科研综合管理系统",
  description: "Manage your research projects, experiments, and literature.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex h-full">
                {/* Sidebar (Desktop) */}
                <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-50">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <main className="md:pl-72 flex-1 h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                    {children}
                </main>
            </div>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
