"use client";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
});

// export const metadata: Metadata = {
//   title: "CATAI PHARM",
//   description: "Identify Look-Alike Sound-Alike medications to prevent errors",
// };

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
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
