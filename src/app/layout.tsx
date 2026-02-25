import { Jomolhari } from "next/font/google";
import "./globals.css";

const jomolhari = Jomolhari({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jomolhari",
});

export const metadata = {
  title: "TSEDQ - Orthodox Faith Platform",
  description: "Empowering Orthodox Communities Through Digitalized Faith Giving & Finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={jomolhari.className}>{children}</body>
    </html>
  );
}
