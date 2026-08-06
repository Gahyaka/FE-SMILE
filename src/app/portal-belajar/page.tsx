import { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Portal Belajar & Administrasi - RA Sahabat",
  description: "Portal masuk khusus untuk guru dan wali murid KB/RA Sahabat Berbah Sleman.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalBelajarPage() {
  return <LoginClient />;
}
