import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/auth0-provider";

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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}