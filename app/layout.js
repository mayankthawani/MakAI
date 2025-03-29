import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { dark } from '@clerk/themes'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MakAI",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{baseTheme: dark}}>
    <html lang="en" suppressHydrationWarning> {/* ✅ Fix hydration error */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="theme"  // ✅ Stores theme in localStorage
          enableSystem
          disableTransitionOnChange
        >
          {/* header */}
          <Header />
         <main className="min-h-screen"> {children} </main>{/* 🚀 Removed unnecessary `{}` */}
         <Toaster richColors />
          {/* footer */}
          <footer className="bg-muted/50 py-12">
            <div className="container mx-auto text-center px-4">
              <p>Made by Mayank Thawani</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
