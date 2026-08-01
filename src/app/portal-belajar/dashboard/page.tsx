import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard - Portal RA Sahabat",
  description: "Dashboard administrasi dan dokumentasi kegiatan belajar RA Sahabat.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
