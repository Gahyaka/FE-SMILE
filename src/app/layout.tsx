import type { Metadata } from "next";
import { Baloo_2, Quicksand } from "next/font/google";
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

export const metadata: Metadata = {
  title: "G-SEE — Gajahwong Smart Education Ecosystem",
  description: "Membangun ekosistem pendidikan cerdas, ramah anak, dan peduli lingkungan di Sekolah Gajahwong melalui program Smart Learning, Smart Environment, dan Pendampingan Anak.",
  keywords: ["G-SEE", "Sekolah Gajahwong", "Smart Learning", "Smart Environment", "Pendidikan Anak", "Komunitas Nonformal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${baloo2.variable} ${quicksand.variable} h-full scroll-smooth`}
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



