// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/shared/components/Header";
import { Toaster } from "react-hot-toast"; // 1. استيراد حاوية الإشعارات

const cairo = Cairo({ subsets: ["latin", "arabic"] });

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "مركز الباسل - أحدث الهواتف الذكية والإكسسوارات",
  description: "أفضل العروض على الهواتف الذكية، الإكسسوارات، وخدمات استبدال الأجهزة في مركز الباسل.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <Header />
        
        {/* 2. وضع الحاوية هنا مع تحديد مكان ظهور الإشعار (أسفل الوسط) */}
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '12px',
              fontFamily: 'inherit',
              padding: '12px 24px',
            },
          }}
        />

        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}