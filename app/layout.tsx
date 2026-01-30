import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/auth0-provider";
import { GenerationProvider } from "@/context/generation-context";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Intelligence Video",
    template: "%s | Intelligence Video",
  },
  description:
    "AI-powered platform for creating, managing, and optimizing intelligent video content for maximum engagement and visibility.",

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "Intelligence Video",
    description:
      "Turn every video into intelligence with AI-powered creation, optimization, and performance tools.",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Intelligence Video",
    description:
      "Create, manage, and optimize AI-powered video content for maximum engagement and visibility.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <GenerationProvider>
            {children}
          </GenerationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
