import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Mentor Mentee Management System",
  description: "A platform for managing mentor-mentee relationships",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

