import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/auth0-provider";
import { GenerationProvider } from "@/context/generation-context"

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Envolvemos la app con el componente cliente que creamos */}
        <AuthProvider>
        <GenerationProvider>
          {children}
          </GenerationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}