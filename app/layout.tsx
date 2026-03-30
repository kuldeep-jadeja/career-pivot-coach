import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career Pivot Coach",
  description: "AI displacement risk assessment and career pivot planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
