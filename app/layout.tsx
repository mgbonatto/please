import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { getApprovedSpaces } from "@/lib/queries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Please — structured community feedback",
  description:
    "Turn scattered community feedback into structured, votable Issues and Proposals.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const spaces = await getApprovedSpaces();
  const navSpaces = spaces.map((s) => ({ slug: s.slug, name: s.name }));

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppSidebar spaces={navSpaces} />
        <main className="px-4 py-16 md:ml-60 md:px-8 md:py-10">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
