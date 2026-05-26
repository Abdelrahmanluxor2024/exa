import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "الأستاذ أبو الفتيان فهمي - التاريخ الوطني",
  description: "المنصة التعليمية الاحترافية للأستاذ أبو الفتيان فهمي - مدرس التاريخ الوطني للصف الثاني الثانوي. معاً نحو تفوقك.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-customBg text-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
