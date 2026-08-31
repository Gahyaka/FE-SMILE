import type { Metadata } from "next";
import { Baloo_2, Quicksand, Fredoka } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";

const baloo2 = Baloo_2({
  variable: "--font-baloo-2",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "KB/RA Sahabat — Berbah, Sleman, Yogyakarta",
  description: "Membangun ekosistem pendidikan anak usia dini yang cerdas, berakhlak mulia, dan berkarakter Islami di KB/RA Sahabat Berbah Sleman.",
  keywords: ["RA Sahabat", "KB Sahabat", "Raudhatul Athfal Sleman", "PAUD Berbah", "Pendidikan Anak Usia Dini", "Kemenag", "Nahdlatul Ulama"],
  icons: {
    icon: "/images/logo.jpg",
    shortcut: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${baloo2.variable} ${quicksand.variable} ${fredoka.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-quicksand text-neutral-dark antialiased bg-white">
        <NavbarWrapper />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}



