import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Preloader } from "@/components/preloader";
import { AppProviders } from "@/components/app-providers";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cafenoir.example"),
  title: {
    default: "کافه‌نویر | قهوه تخصصی و پریمیوم",
    template: "%s | کافه‌نویر",
  },
  description:
    "کافه‌نویر، فروشگاه آنلاین قهوه تخصصی. خرید انواع دانه قهوه، اسپرسو، کولد برو و تجهیزات باریستا با بالاترین کیفیت و ارسال سریع.",
  keywords: [
    "قهوه",
    "خرید قهوه",
    "اسپرسو",
    "کولد برو",
    "دانه قهوه",
    "کافه‌نویر",
    "قهوه تخصصی",
    "آرابیکا",
  ],
  authors: [{ name: "Café Noir" }],
  openGraph: {
    title: "کافه‌نویر | قهوه تخصصی و پریمیوم",
    description: "فروشگاه آنلاین قهوه تخصصی با کیفیت پریمیوم",
    siteName: "کافه‌نویر",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "کافه‌نویر",
    description: "فروشگاه آنلاین قهوه تخصصی",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${vazirmatn.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AppProviders>
            <Preloader />
            {children}
          </AppProviders>
          <Toaster />
          <SonnerToaster position="top-center" dir="rtl" />
        </ThemeProvider>
      </body>
    </html>
  );
}
