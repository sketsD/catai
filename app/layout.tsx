import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "CATAI PHARM",
  description: "Identify Look-Alike Sound-Alike medications to prevent errors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={notoSans.variable}>
      <body
        className={`font-sans ${notoSans.className} font-weight-500 text-color-gray-950`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
