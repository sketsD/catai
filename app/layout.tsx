"use client";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
});

// export const metadata: Metadata = {
//   title: "CATAI PHARM",
//   description: "Identify Look-Alike Sound-Alike medications to prevent errors",
// };

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <html lang="en" className={notoSans.variable}>
      <head>
        <style>{`
          .global-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
            position: fixed;
            top: 0;
            left: 0;
            background: white;
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.2s;
          }
          .global-loading.hidden {
            opacity: 0;
            pointer-events: none;
          }
          .spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </head>
      <body
        className={`font-sans ${notoSans.className} font-weight-500 text-color-gray-950`}
      >
        <div
          id="global-loading"
          className={`global-loading ${isHydrated ? "hidden" : ""}`}
        >
          <div className="spinner"></div>
        </div>
        <Provider store={store}>
          {isHydrated ? children : null}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutContent>{children}</RootLayoutContent>;
}
