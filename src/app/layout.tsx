import type { Metadata } from "next";
import { Toaster } from "react-hot-toast"; 
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "./context/AuthContext";
import AuthModal from "./components/AuthModal/AuthModal";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Food Tracker",
  description: "Track your daily office food intake expenses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AuthModal />
          {children}
        </AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
};
