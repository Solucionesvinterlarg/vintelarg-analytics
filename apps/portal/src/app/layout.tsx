import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const jakarta = localFont({
  src: [
    { path: "../fonts/PlusJakartaSans-VariableFont_wght.ttf", style: "normal" },
    { path: "../fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf", style: "italic" },
  ],
  variable: "--font-jakarta",
  weight: "200 800",
  display: "swap",
});

const merriweather = localFont({
  src: [
    { path: "../fonts/Merriweather-VariableFont.ttf", style: "normal" },
    { path: "../fonts/Merriweather-Italic-VariableFont.ttf", style: "italic" },
  ],
  variable: "--font-merriweather",
  weight: "300 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portal · A-ware®",
  description: "Portal A-ware® — ecosistema Vintelarg",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-AR"
      suppressHydrationWarning
      className={`${jakarta.variable} ${merriweather.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delay={200}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
