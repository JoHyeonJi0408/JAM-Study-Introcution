import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { MemberProvider } from "../app/context/member-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-primary`}>
        <ThemeProvider attribute="class">
          <MemberProvider>
            {children}
          </MemberProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
