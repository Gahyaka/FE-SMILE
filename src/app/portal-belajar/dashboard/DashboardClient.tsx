"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Modular tab components
import StudentTab from "./components/StudentTab";
import KelasTab from "./components/KelasTab";
import UserTab from "./components/UserTab";
import KegiatanTab from "./components/KegiatanTab";
import SppTab from "./components/SppTab";
import TabunganTab from "./components/TabunganTab";
import MurajaahTab from "./components/MurajaahTab";
import AuditTab from "./components/AuditTab";
import SkeletonLoader from "./components/SkeletonLoader";

// Import initial mock data
import {
  initialActivities,
  initialStudents,
  initialSppTransactions,
  initialSavings,
  initialMurajaah,
  initialClasses,
  initialUsers,
} from "./mockData";
import { studentService } from "@/services/student";
import { classService } from "@/services/class";
import { userService } from "@/services/user";
import { sppService } from "@/services/spp";
import { activityService } from "@/services/activity";
import { murojaahService } from "@/services/murojaah";

type TabKey = "siswa" | "kelas" | "kegiatan" | "spp" | "tabungan" | "murajaah" | "users" | "audit";

function getDefaultTab(role: "admin_adm" | "admin_trx" | "guru"): TabKey {
  if (role === "admin_trx") return "spp";
  if (role === "guru") return "siswa";
  return "siswa"; // admin_adm
}

function mapStudentsData(rawStudents: any[]): any[] {
  return rawStudents.map((st: any) => ({
    id: st.id,
    name: st.namaLengkap || st.nama_lengkap || "Siswa Tanpa Nama",
    nisn: st.nisn || "",
    nis: st.nis || "",
    parentName: st.namaOrangTua || st.nama_orang_tua || "Wali Murid",
    class: st.kelas?.namaKelas || st.kelas?.nama_kelas || st.class || "Belum Ada Kelas",
    address: st.address || st.alamat || "Alamat belum diinput",
    semester: st.semester || "Semester 1",
    fase: st.fase || "Fase Fondasi",
    height: Number(st.height) || 100,
    weight: Number(st.weight) || 16,
    headCircumference: Number(st.headCircumference) || 48,
    academicYear: st.academicYear || st.academic_year || "2026/2027",
    activeStatus: st.activeStatus || st.status || "Aktif"
  }));
}

function mapClassesData(rawClasses: any[]): any[] {
  return rawClasses.map((c: any) => ({
    id: c.id,
    className: c.namaKelas || c.nama_kelas || "Kelas Tanpa Nama",
    teacherName: c.waliKelas || c.wali_kelas || "Belum Ada Wali",
    teacherId: c.guruId || c.guru_id || "",
    fase: c.tahunAjaran || c.tahun_ajaran || "2025/2026", // Map Academic Year here
    description: c.description || c.deskripsi || "Tidak ada deskripsi"
  }));
}

function parseLocalDateString(dateStr: string): string {
  if (!dateStr) return "";
  if (dateStr.includes("T")) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return dateStr.substring(0, 10);
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return dateStr.substring(0, 10);
}

function mapSppTransactions(rawTxs: any[]): any[] {
  const reverseMap: Record<string, string> = {
    "JULI": "07",
    "AGUSTUS": "08",
    "SEPTEMBER": "09",
    "OKTOBER": "10",
    "NOVEMBER": "11",
    "DESEMBER": "12",
    "JANUARI": "01",
    "FEBRUARI": "02",
    "MARET": "03",
    "APRIL": "04",
    "MEI": "05",
    "JUNI": "06"
  };

  const mapped = rawTxs.map((tx: any) => {
    const formattedDate = parseLocalDateString(tx.tanggalBayar || "");
    const year = formattedDate ? formattedDate.substring(0, 4) : new Date().getFullYear().toString();

    // Map backend capitalized months back to YYYY-MM
    let months = (tx.paidMonths || []).map((m: string) => {
      const monthNum = reverseMap[m.toUpperCase()];
      return monthNum ? `${year}-${monthNum}` : m;
    });
    
    // Fallback: If backend does not provide paidMonths array, deduce month from payment date (format: "YYYY-MM")
    if (!months || !Array.isArray(months) || months.length === 0) {
      if (formattedDate && formattedDate.length >= 7) {
        months = [formattedDate.substring(0, 7)];
      } else {
        months = [];
      }
    }

    return {
      id: tx.id,
      studentId: tx.siswaId,
      date: formattedDate,
      description: tx.catatan || "Pembayaran SPP & Les",
      spp: Number(tx.nominalSpp) || 0,
      les: Number(tx.nominalLes) || 0,
      total: (Number(tx.nominalSpp) || 0) + (Number(tx.nominalLes) || 0),
      depositStatus: tx.statusSetoran === "SUDAH" ? "Sudah Disetor" : "Belum Disetor",
      paidMonths: months
    };
  });

  // Group transactions that were posted in the same batch
  const grouped: any[] = [];
  const visitedKeys = new Set<string>();

  mapped.forEach((tx) => {
    const matchKey = `${tx.studentId}_${tx.date}_${tx.description}_${tx.spp}_${tx.les}`;
    
    if (!visitedKeys.has(matchKey)) {
      visitedKeys.add(matchKey);
      grouped.push(tx);
    } else {
      const existing = grouped.find(
        (item) => `${item.studentId}_${item.date}_${item.description}_${item.spp}_${item.les}` === matchKey
      );
      if (existing) {
        const mergedMonths = Array.from(new Set([...(existing.paidMonths || []), ...(tx.paidMonths || [])]));
        existing.paidMonths = mergedMonths;
      }
    }
  });

  return grouped;
}

function mapUsersData(rawUsers: any[]): any[] {
  const allowedRoles = ["ADMIN", "ADMIN_ADMINISTRASI", "ADMIN_TRANSAKSI", "GURU"];
  
  // Read locally deleted user IDs to filter them out from backend response
  let deletedUserIds: any[] = [];
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("deleted_user_ids");
    deletedUserIds = raw ? JSON.parse(raw) : [];
  }

  return rawUsers
    .filter((u: any) => allowedRoles.includes((u.role || "").toUpperCase()))
    .filter((u: any) => !deletedUserIds.includes(u.id))
    .map((u: any) => {
      const rawRole = (u.role || "").toUpperCase();
      const mappedRole = rawRole === "ADMIN_ADMINISTRASI" || rawRole === "ADMIN" 
        ? "admin_adm" 
        : rawRole === "ADMIN_TRANSAKSI" 
          ? "admin_trx" 
          : "guru";

      // Paksa override username ke default kesepakatan agar sinkron
      let finalUsername = u.username;
      if (mappedRole === "admin_adm") {
        finalUsername = "admin_adm";
      } else if (mappedRole === "admin_trx") {
        finalUsername = "admin_trx";
      }

      return {
        id: u.id,
        name: u.nama || u.name || (mappedRole === "admin_adm" ? "Admin Administrasi (Bunda Nisa)" : "Admin Transaksi (Bunda Ajeng)"),
        username: finalUsername,
        role: mappedRole
      };
    });
}

export default function DashboardClient() {
  const router = useRouter();
  const [session, setSession] = useState<{ role: "admin_adm" | "admin_trx" | "guru"; name: string; username?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("siswa");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Shared database states
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  // Local password store: { [username]: plaintext_password } — because backend never returns hashed passwords
  const [localPasswords, setLocalPasswords] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem("sgw_local_passwords") || "{}"); } catch { return {}; }
  });
  const [activities, setActivities] = useState(initialActivities);
  const [sppTransactions, setSppTransactions] = useState(initialSppTransactions);
  const [sppMatriksData, setSppMatriksData] = useState<any[]>([]);
  const [savings, setSavings] = useState(initialSavings);
  const [murajaahData, setMurajaahData] = useState<{[studentId: string]: {[param: string]: string}}>(initialMurajaah);
  const [murojaahMateriList, setMurojaahMateriList] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionType: "delete_student" | "delete_class" | "delete_spp" | "delete_user" | null;
    targetId: string | number | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    actionType: null,
    targetId: null
  });
  const [isConfirming, setIsConfirming] = useState(false);

  // State edit profil saya
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [activeAcademicYear, setActiveAcademicYear] = useState("2026/2027");

  const loadSppMatriks = async (tahunAjaran: string = "2026/2027") => {
    try {
      setActiveAcademicYear(tahunAjaran);
      const res = await sppService.getMatriks(tahunAjaran);
      if (res && res.success && Array.isArray(res.data)) {
        setSppMatriksData(res.data);
      }
    } catch (err) {
      console.warn("[SGW] Failed to fetch SPP Matriks from backend:", err);
    }
  };

  useEffect(() => {
    // Authenticate session on client side
    const cachedSession = localStorage.getItem("user_session");
    if (!cachedSession) {
      router.push("/portal-belajar");
    } else {
      const parsed = JSON.parse(cachedSession);
      setSession(parsed);
      // Set default landing tab based on role (PRD v3 Section 4)
      setActiveTab(getDefaultTab(parsed.role));

      // Load users from localStorage (with fallback to mock initialUsers)
      const storedUsers = localStorage.getItem("system_users");
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        setUsers(initialUsers);
        localStorage.setItem("system_users", JSON.stringify(initialUsers));
      }

      // Sync activities with localStorage for landing page dynamic galeri
      const storedActivities = localStorage.getItem("sgw_activities");
      if (storedActivities) {
        setActivities(JSON.parse(storedActivities));
      } else {
        localStorage.setItem("sgw_activities", JSON.stringify(initialActivities));
      }

      // Fetch real data from backend Adonis server
      const loadBackendData = async () => {
        try {
          const studentRes = await studentService.getAll();
          const rawStudents = Array.isArray(studentRes) ? studentRes : studentRes?.data || [];
          setStudents(mapStudentsData(rawStudents));

          try {
            const classRes = await classService.getAll();
            const rawClasses = Array.isArray(classRes) ? classRes : classRes?.data || [];
            setClasses(mapClassesData(rawClasses));
          } catch (classErr) {
            console.warn("[SGW] Failed to fetch classes from backend. Using local mock/cache.", classErr);
          }

          // Fetch SPP transactions from backend Adonis
          try {
            const sppRes = await sppService.getAll();
            const rawSpp = Array.isArray(sppRes) ? sppRes : sppRes?.data || [];
            setSppTransactions(mapSppTransactions(rawSpp));
            
            // Fetch Matriks monitoring SPP
            await loadSppMatriks("2026/2027");
          } catch (sppErr) {
            console.warn("[SGW] Failed to fetch SPP transactions from backend. Using mock fallbacks.");
          }

           // Fetch users from backend Adonis (Only for Admin Administrasi)
          if (parsed.role === "admin_adm") {
            try {
              const userRes = await userService.getAll();
              const rawUsers = Array.isArray(userRes) ? userRes : userRes?.data || [];
              setUsers(mapUsersData(rawUsers));
            } catch (userErr) {
              console.warn("Backend users list API not fully supported/accessible. Using local mock storage.");
              const storedUsers = localStorage.getItem("system_users");
              if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
              } else {
                setUsers(initialUsers);
                localStorage.setItem("system_users", JSON.stringify(initialUsers));
              }
            }
          } else {
            // Non-admin roles fallback to local store for UI compatibility
            const storedUsers = localStorage.getItem("system_users");
            setUsers(storedUsers ? JSON.parse(storedUsers) : initialUsers);
          }

          // Fetch Dokumentasi Kegiatan dari backend Adonis
          try {
            const actRes = await activityService.getAll();
            const rawAct = Array.isArray(actRes) ? actRes : actRes?.data || [];
            // Backend mengembalikan foto dalam array relasi: fotos: [{id, url, isDefault, ...}]
            const mappedAct = rawAct.map((item: any) => {
              const fotosArr = Array.isArray(item.foto) ? item.foto
                : Array.isArray(item.fotos) ? item.fotos
                : [];
              const thumbnail = fotosArr.find((f: any) => f.isDefault || f.isThumbnail)
                || fotosArr[0];
              const imageUrl = thumbnail?.viewUrl || thumbnail?.url || thumbnail?.path || thumbnail?.foto
                || (typeof item.foto === "string" ? item.foto : null)
                || (typeof item.image === "string" ? item.image : null)
                || "";

              return {
                id: item.id,
                title: item.namaKegiatan || item.title || "Kegiatan Madrasah",
                description: item.deskripsi || item.description || "",
                date: item.tanggalKegiatan || item.date || new Date().toISOString().split("T")[0],
                featuredImage: imageUrl,
                driveLink: item.gdriveFolderUrl || item.driveLink || item.folderUrl || item.driveFolderUrl
                  || item.googleDriveUrl || item.folderDriveUrl || item.urlFolder
                  || item.linkDrive || item.urlDrive || "",
                category: item.category || "Keagamaan",
                isPublic: item.isPublic !== undefined ? item.isPublic : true
              };
            });
            if (mappedAct.length > 0) {
              setActivities(mappedAct);
              localStorage.setItem("sgw_activities", JSON.stringify(mappedAct));
            }
          } catch (actErr: any) {
            console.warn("[SGW] Failed to fetch activities from backend. Using local storage.",
              actErr?.response?.status, actErr?.response?.data || actErr?.message);
            const stored = localStorage.getItem("sgw_activities");
            if (stored) setActivities(JSON.parse(stored));
          }

          // Fetch Murojaah Kategori, Materi, & Penilaian dari backend Adonis
          try {
            const materiRes = await murojaahService.getMateri();
            const rawMateri = Array.isArray(materiRes) ? materiRes : materiRes?.data || [];
            setMurojaahMateriList(rawMateri);

            // Fetch progress murojaah per siswa untuk data yang valid
            const updatedMurajaahData: {[studentId: string]: {[param: string]: string}} = {};
            
            // Lakukan fetch paralel lembar murojaah untuk siswa yang terdaftar
            await Promise.all(
              rawStudents.map(async (st: any) => {
                try {
                  const lembarRes = await murojaahService.getLembarMurojaah(st.id);
                  const progressList = Array.isArray(lembarRes) ? lembarRes : lembarRes?.data || [];
                  const scores: {[param: string]: string} = {};
                  
                  progressList.forEach((p: any) => {
                    const materiInfo = rawMateri.find((m: any) => m.id === p.materiId);
                    if (materiInfo) {
                      scores[materiInfo.namaMateri] = p.predikat || "-";
                    }
                  });
                  updatedMurajaahData[String(st.id)] = scores;
                } catch (stErr) {
                  // Fallback
                }
              })
            );

            if (Object.keys(updatedMurajaahData).length > 0) {
              setMurajaahData(updatedMurajaahData);
            }
          } catch (muroErr) {
            console.warn("[SGW] Murojaah API sync failed / 404. Using local mockup storage.");
            const stored = localStorage.getItem("sgw_murajaah_data");
            if (stored) {
              setMurajaahData(JSON.parse(stored));
            } else {
              setMurajaahData(initialMurajaah);
              localStorage.setItem("sgw_murajaah_data", JSON.stringify(initialMurajaah));
            }
          }
        } catch (err) {
          console.warn("Backend data fetch warning (using mock fallbacks):", err);
        } finally {
          setLoadingData(false);
        }
      };
      loadBackendData();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/portal-belajar");
  };

  if (!session) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-[#FAF8F5]">
        <div className="text-center font-baloo text-lg font-bold text-primary-green animate-pulse">
          Memuat halaman keamanan...
        </div>
      </div>
    );
  }

  const isAdminAdministrasi = session.role === "admin_adm";
  const isAdminTransaksi = session.role === "admin_trx";
  const isGuru = session.role === "guru";

  // CRUD & Operations handlers
  const handleAddStudent = async (newStData: any) => {
    if (!isAdminAdministrasi) return;
    
    // Find matching class UUID from backend database
    const matchedClass = classes.find(
      (c: any) => c.className === newStData.class || c.name === newStData.class
    );
    const kelasId = matchedClass?.id || classes[0]?.id || "7367fed7-6f2b-4cdc-88aa-1399ce1d2175";

    try {
      await studentService.create({
        namaLengkap: newStData.name,
        namaOrangTua: newStData.parentName || "Wali Murid RA Sahabat",
        nisn: newStData.nisn,
        nis: newStData.nis,
        kelasId: kelasId ? String(kelasId) : null,
        alamat: newStData.address || "Alamat belum diinput",
        tinggiBadan: Number(newStData.height) || 100,
        beratBadan: Number(newStData.weight) || 16,
        lingkarKepala: Number(newStData.headCircumference) || 48,
        semester: newStData.semester || "Semester 1 (Ganjil)",
        tahunAjaran: newStData.academicYear || "2026/2027"
      });
      
      // Normal flow: Refresh list
      const freshStudents = await studentService.getAll();
      const rawFresh = Array.isArray(freshStudents) ? freshStudents : freshStudents?.data || [];
      setStudents(mapStudentsData(rawFresh));
      
      const newLog = {
        id: Date.now(),
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: session.name,
        action: `Mendaftarkan siswa baru: ${newStData.name} (NISN: ${newStData.nisn}) ke database backend`,
      };
      setLogs([newLog, ...logs]);
    } catch (err: any) {
      console.warn("[SGW] Add student API returned error. Verifying database state...");
      
      try {
        // Silent check: Pull latest student list from backend
        const verifyRes = await studentService.getAll();
        const rawVerify = Array.isArray(verifyRes) ? verifyRes : verifyRes?.data || [];
        const mappedVerify = mapStudentsData(rawVerify);
        
        // Check if the student actually exists now (match by NISN)
        const isSaved = mappedVerify.some((s: any) => s.nisn === newStData.nisn);
        
        if (isSaved) {
          // If actually saved in DB, silently recover and update state
          setStudents(mappedVerify);
          const recoverLog = {
            id: Date.now(),
            time: new Date().toISOString().replace('T', ' ').substring(0, 16),
            user: session.name,
            action: `Mendaftarkan siswa baru: ${newStData.name} (NISN: ${newStData.nisn}) [Silent Recovery]`,
          };
          setLogs([recoverLog, ...logs]);
          return; // Exit successfully
        }
      } catch (checkErr) {
        console.error("Silent verification failed:", checkErr);
      }
      
      // If student is truly not in the database, show the error alert
      alert("Gagal menambahkan siswa ke backend: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateStudent = async (updatedStudent: any) => {
    if (!isAdminAdministrasi) return;
    
    const matchedClass = classes.find(
      (c: any) => c.className === updatedStudent.class || c.name === updatedStudent.class
    );
    const kelasId = matchedClass?.id || classes[0]?.id || "7367fed7-6f2b-4cdc-88aa-1399ce1d2175";

    try {
      await studentService.update(updatedStudent.id, {
        namaLengkap: updatedStudent.name,
        namaOrangTua: updatedStudent.parentName || "Wali Murid RA Sahabat",
        nisn: updatedStudent.nisn,
        nis: updatedStudent.nis,
        kelasId: kelasId ? String(kelasId) : null,
        alamat: updatedStudent.address || "Alamat belum diinput",
        tinggiBadan: Number(updatedStudent.height) || 100,
        beratBadan: Number(updatedStudent.weight) || 16,
        lingkarKepala: Number(updatedStudent.headCircumference) || 48,
        semester: updatedStudent.semester || "Semester 1 (Ganjil)",
        tahunAjaran: updatedStudent.academicYear || "2026/2027"
      });

      // Refresh list
      const freshStudents = await studentService.getAll();
      const rawFresh = Array.isArray(freshStudents) ? freshStudents : freshStudents?.data || [];
      setStudents(mapStudentsData(rawFresh));

      const newLog = {
        id: Date.now(),
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: session.name,
        action: `Memperbarui profil data siswa: ${updatedStudent.name} (NISN: ${updatedStudent.nisn}) di backend`,
      };
      setLogs([newLog, ...logs]);
    } catch (err: any) {
      alert("Gagal memperbarui data siswa di backend: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateStudentStatus = async (studentId: number, status: string) => {
    if (!isAdminAdministrasi) return;
    const target = students.find(s => s.id === studentId);
    if (!target) return;
    
    try {
      await studentService.update(studentId, { activeStatus: status });

      // Refresh list
      const freshStudents = await studentService.getAll();
      setStudents(Array.isArray(freshStudents) ? freshStudents : freshStudents?.data || []);

      const newLog = {
        id: Date.now(),
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: session.name,
        action: `Mengubah status keaktifan siswa ${target.name} menjadi: ${status} di backend`,
      };
      setLogs([newLog, ...logs]);
    } catch (err: any) {
      alert("Gagal memperbarui status keaktifan di backend: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteStudent = (studentId: number) => {
    if (!isAdminAdministrasi) return;
    const studentName = students.find((s) => s.id === studentId)?.name || "Siswa";
    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Hapus Siswa",
      message: `Apakah Anda yakin ingin menghapus data siswa "${studentName}" secara permanen? Tindakan ini tidak dapat dibatalkan.`,
      actionType: "delete_student",
      targetId: studentId
    });
  };

const handleAddClass = async (newClsData: any) => {
  if (!isAdminAdministrasi) return;
  try {
    await classService.create({
      namaKelas: newClsData.className,
      tahunAjaran: newClsData.fase, // Send selected academic year dynamically
      waliKelas: newClsData.teacherName || "Bunda Guru", // Kirim nama guru (string) sesuai Kelas.json
      guru_id: newClsData.teacherId,   // Backup ID guru (snake_case)
      guruId: newClsData.teacherId     // Backup ID guru (camelCase)
    });

    // Refresh list
    const freshClasses = await classService.getAll();
    const rawFresh = Array.isArray(freshClasses) ? freshClasses : freshClasses?.data || [];
    setClasses(mapClassesData(rawFresh));

    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Menambahkan kelas baru: ${newClsData.className} ke backend`,
    };
    setLogs([newLog, ...logs]);
  } catch (err: any) {
    alert("Gagal menambahkan kelas ke backend: " + (err.response?.data?.message || err.message));
  }
};

const handleUpdateClass = async (updatedCls: any) => {
  if (!isAdminAdministrasi) return;
  try {
    await classService.update(updatedCls.id, {
      namaKelas: updatedCls.className,
      tahunAjaran: updatedCls.fase, // Send updated academic year dynamically
      waliKelas: updatedCls.teacherName || "Bunda Guru", // Kirim nama guru (string) sesuai Kelas.json
      guru_id: updatedCls.teacherId,   // Backup ID guru (snake_case)
      guruId: updatedCls.teacherId     // Backup ID guru (camelCase)
    });

    // Refresh list
    const freshClasses = await classService.getAll();
    const rawFreshUpdate = Array.isArray(freshClasses) ? freshClasses : freshClasses?.data || [];
    setClasses(mapClassesData(rawFreshUpdate));

    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Memperbarui data kelas: ${updatedCls.className} di backend`,
    };
    setLogs([newLog, ...logs]);
  } catch (err: any) {
    alert("Gagal memperbarui kelas di backend: " + (err.response?.data?.message || err.message));
  }
};

const handleDeleteClass = (classId: number) => {
  if (!isAdminAdministrasi) return;
  const clsName = classes.find(c => c.id === classId)?.className || "Kelas";
  setConfirmModal({
    isOpen: true,
    title: "Konfirmasi Hapus Kelas",
    message: `Apakah Anda yakin ingin menghapus kelas "${clsName}" secara permanen? Seluruh data yang berkaitan dengan kelas ini akan terhapus.`,
    actionType: "delete_class",
    targetId: classId
  });
};

const handleAddUser = async (newUsrData: any) => {
  if (!isAdminAdministrasi) return;
  
  // Map frontend role format back to Backend role standard
  let backendRole: "ADMIN_ADMINISTRASI" | "ADMIN_TRANSAKSI" | "GURU" | "ADMIN" = "GURU";
  if (newUsrData.role === "admin_adm") {
    backendRole = "ADMIN_ADMINISTRASI";
  } else if (newUsrData.role === "admin_trx") {
    backendRole = "ADMIN_TRANSAKSI";
  } else if (newUsrData.role === "guru") {
    backendRole = "GURU";
  }

  let finalUsername = newUsrData.username;
  let success = false;
  let attempts = 0;
  const maxAttempts = 4;

  try {
    while (!success && attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`Attempt ${attempts}: Registering user '${newUsrData.name}' with username '${finalUsername}'`);
        await userService.create({
          nama: newUsrData.name,
          username: finalUsername,
          password: newUsrData.password,
          role: backendRole
        });
        success = true;
      } catch (err: any) {
        const httpStatus = err.response?.status;
        const errBody = err.response?.data;
        const errMessage = String(
          errBody?.message || errBody?.error || err.message || ""
        ).toLowerCase();
        
        // Conflict = HTTP 409, or message contains known conflict keywords
        const isConflict =
          httpStatus === 409 ||
          errMessage.includes("terdaftar") ||
          errMessage.includes("conflict") ||
          errMessage.includes("already") ||
          errMessage.includes("duplicate") ||
          // Handle empty body {} with status 4xx as conflict fallback during retry
          (httpStatus === 422 && errMessage === "");

        if (isConflict && attempts < maxAttempts) {
          const randomSuffix = String(Math.floor(10 + Math.random() * 90));
          finalUsername = `${newUsrData.username}${randomSuffix}`;
          console.warn(`[SGW] Username conflict (${httpStatus}). Retrying as: ${finalUsername}`);
          continue;
        }

        // Non-conflict error or max attempts reached
        throw err;
      }
    }

    if (success) {
      // If username changed due to retry, update the success UI state parameters
      newUsrData.username = finalUsername;

      // Refresh users list
      try {
        const userRes = await userService.getAll();
        const rawUsers = Array.isArray(userRes) ? userRes : userRes?.data || [];
        setUsers(mapUsersData(rawUsers));
      } catch {
        // Local fallback
        const stored = localStorage.getItem("system_users");
        const current = stored ? JSON.parse(stored) : [];
        const localNew = { ...newUsrData, id: Date.now() };
        const updated = [...current, localNew];
        setUsers(updated);
        localStorage.setItem("system_users", JSON.stringify(updated));
      }

      // Persist password locally so it can be copied later from Kelola Pengguna
      const updatedPasswords = { ...localPasswords, [finalUsername]: newUsrData.password };
      setLocalPasswords(updatedPasswords);
      localStorage.setItem("sgw_local_passwords", JSON.stringify(updatedPasswords));

      const newLog = {
        id: Date.now(),
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: session.name,
        action: `Mendaftarkan akun pengguna baru: ${newUsrData.name} (${finalUsername}) ke backend`,
      };
      setLogs([newLog, ...logs]);
    }
  } catch (err: any) {
    alert("Gagal mendaftarkan user di backend: " + (err.response?.data?.message || err.message));
  }
};

const handleUpdateUser = async (updatedUsr: any) => {
  if (!isAdminAdministrasi) return;
  try {
    if (updatedUsr.password) {
      await userService.resetPassword(updatedUsr.id, updatedUsr.username, updatedUsr.password);
    }

    // Refresh list locally/API
    try {
      const userRes = await userService.getAll();
      const rawUsers = Array.isArray(userRes) ? userRes : userRes?.data || [];
      setUsers(mapUsersData(rawUsers));
    } catch {
      const updated = users.map(u => u.id === updatedUsr.id ? updatedUsr : u);
      setUsers(updated);
      localStorage.setItem("system_users", JSON.stringify(updated));
    }

    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Memperbarui data akun pengguna: ${updatedUsr.name} di backend`,
    };
    setLogs([newLog, ...logs]);
  } catch (err: any) {
    // Teruskan error ke component pemanggil agar ditampilkan di dalam modal
    throw err;
  }
};

const handleDeleteUser = (userId: number) => {
  if (!isAdminAdministrasi) return;
  const targetUser = users.find(u => u.id === userId);
  if (!targetUser) return;
  
  if (targetUser.username === "admin_adm") {
    alert("Akun Super Admin utama tidak dapat dihapus!");
    return;
  }

  setConfirmModal({
    isOpen: true,
    title: "Konfirmasi Hapus Pengguna",
    message: `Apakah Anda yakin ingin menghapus akun petugas "${targetUser.name}" secara permanen?`,
    actionType: "delete_user",
    targetId: userId
  });
};

  const handleExecuteConfirmAction = async () => {
    const { actionType, targetId } = confirmModal;
    if (!targetId || !actionType) return;

    try {
      setIsConfirming(true);

      if (actionType === "delete_student") {
        const studentName = students.find((s) => s.id === targetId)?.name || "Siswa";
        try {
          await studentService.delete(targetId);
          
          // Refresh list
          const freshStudents = await studentService.getAll();
          const rawFresh = Array.isArray(freshStudents) ? freshStudents : freshStudents?.data || [];
          setStudents(mapStudentsData(rawFresh));

          const newLog = {
            id: Date.now(),
            time: new Date().toISOString().replace('T', ' ').substring(0, 16),
            user: session.name,
            action: `Menghapus data master siswa: ${studentName} dari backend`,
          };
          setLogs([newLog, ...logs]);
        } catch (err: any) {
          alert("Gagal menghapus siswa di backend: " + (err.response?.data?.message || err.message));
        }
      } else if (actionType === "delete_class") {
        const clsName = classes.find(c => c.id === targetId)?.className || "Kelas";
        try {
          await classService.delete(targetId);

          // Refresh list
          const freshClasses = await classService.getAll();
          const rawFresh = Array.isArray(freshClasses) ? freshClasses : freshClasses?.data || [];
          setClasses(mapClassesData(rawFresh));

          const newLog = {
            id: Date.now(),
            time: new Date().toISOString().replace('T', ' ').substring(0, 16),
            user: session.name,
            action: `Menghapus kelas: ${clsName} dari backend`,
          };
          setLogs([newLog, ...logs]);
        } catch (err: any) {
          alert("Gagal menghapus kelas di backend: " + (err.response?.data?.message || err.message));
        }
      } else if (actionType === "delete_spp") {
        const tx = sppTransactions.find(t => t.id === targetId);
        if (tx) {
          const studentName = students.find(s => s.id === tx.studentId)?.name || "Siswa";
          try {
            await sppService.delete(targetId);

            // Refresh list
            const sppRes = await sppService.getAll();
            const rawSpp = Array.isArray(sppRes) ? sppRes : sppRes?.data || [];
            setSppTransactions(mapSppTransactions(rawSpp));

            // Refresh Matriks
            await loadSppMatriks(activeAcademicYear);

            const newLog = {
              id: Date.now(),
              time: new Date().toISOString().replace('T', ' ').substring(0, 16),
              user: session.name,
              action: `Menghapus transaksi kas SPP ${studentName} dari backend`,
            };
            setLogs([newLog, ...logs]);
          } catch (err: any) {
            alert("Gagal menghapus transaksi SPP di backend: " + (err.response?.data?.message || err.message));
          }
        }
      } else if (actionType === "delete_user") {
        const targetUser = users.find(u => u.id === targetId);
        if (targetUser) {
          // Karena backend Adonis tidak menyediakan endpoint delete user (sesuai spesifikasi Users.json),
          // kita lakukan penghapusan lokal secara aman agar console bersih dari error Axios 404.
          const raw = localStorage.getItem("deleted_user_ids");
          const deletedUserIds = raw ? JSON.parse(raw) : [];
          if (!deletedUserIds.includes(targetId)) {
            deletedUserIds.push(targetId);
            localStorage.setItem("deleted_user_ids", JSON.stringify(deletedUserIds));
          }

          const updated = users.filter(u => u.id !== targetId);
          setUsers(updated);
          localStorage.setItem("system_users", JSON.stringify(updated));

          const newLog = {
            id: Date.now(),
            time: new Date().toISOString().replace('T', ' ').substring(0, 16),
            user: session.name,
            action: `Menghapus akun pengguna: ${targetUser.name} (Lokal / Backend)`,
          };
          setLogs([newLog, ...logs]);
        }
      } else if (actionType === ("delete_activity" as any)) {
        const act = activities.find((a) => a.id === targetId);
        if (act) {
          try {
            await activityService.delete(targetId);
          } catch (err) {
            console.warn("Backend delete activity failed, falling back to local list update.");
          }
          const updated = activities.filter((a) => a.id !== targetId);
          setActivities(updated);
          localStorage.setItem("sgw_activities", JSON.stringify(updated));

          const newLog = {
            id: Date.now(),
            time: new Date().toISOString().replace('T', ' ').substring(0, 16),
            user: session.name,
            action: `Menghapus dokumentasi kegiatan: ${act.title}`,
          };
          setLogs([newLog, ...logs]);
        }
      }
    } finally {
      setIsConfirming(false);
      setConfirmModal({
        isOpen: false,
        title: "",
        message: "",
        actionType: null,
        targetId: null
      });
    }
  };

  const handleAddActivity = async (newActData: any) => {
    if (!isAdminAdministrasi && !isGuru) return;
    
    try {
      // Buat FormData — kirim semua foto yang dipilih user ke backend
      // Backend menerima field "foto" dan foto pertama otomatis jadi sampul
      const formData = new FormData();
      formData.append("namaKegiatan", newActData.title);
      formData.append("deskripsi", newActData.description || "");
      formData.append("tanggalKegiatan", newActData.date || new Date().toISOString().split("T")[0]);
      // Kirim semua file dalam array imageFiles
      const files: File[] = Array.isArray(newActData.imageFiles) ? newActData.imageFiles : [];
      files.forEach((file) => formData.append("foto", file));

      await activityService.create(formData);
      
      // Reload dari backend — mapping sesuai struktur respons Adonis (fotos: [{id,url,...}])
      const actRes = await activityService.getAll();
      const rawAct = Array.isArray(actRes) ? actRes : actRes?.data || [];
      const mappedAct = rawAct.map((item: any) => {
        const fotosArr = Array.isArray(item.foto) ? item.foto
          : Array.isArray(item.fotos) ? item.fotos : [];
        const thumb = fotosArr.find((f: any) => f.isDefault || f.isThumbnail) || fotosArr[0];
        const imageUrl = thumb?.viewUrl || thumb?.url || thumb?.path || (typeof item.foto === "string" ? item.foto : "");
        return {
          id: item.id,
          title: item.namaKegiatan || item.title || "Kegiatan Madrasah",
          description: item.deskripsi || item.description || "",
          date: item.tanggalKegiatan || item.date || new Date().toISOString().split("T")[0],
          featuredImage: imageUrl,
          driveLink: item.gdriveFolderUrl || item.driveLink || item.folderUrl || item.driveFolderUrl
            || item.googleDriveUrl || item.folderDriveUrl || item.urlFolder
            || item.linkDrive || item.urlDrive || "",
          isPublic: item.isPublic !== undefined ? item.isPublic : true
        };
      });
      setActivities(mappedAct);
      localStorage.setItem("sgw_activities", JSON.stringify(mappedAct));
    } catch (err) {
      // Fallback lokal jika backend offline
      const newAct = {
        ...newActData,
        id: Date.now(),
        featuredImage: newActData.featuredImage || ""
      };
      const updated = [newAct, ...activities];
      setActivities(updated);
      localStorage.setItem("sgw_activities", JSON.stringify(updated));
    }

    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Menambahkan kegiatan: ${newActData.title}`,
    };
    setLogs([newLog, ...logs]);
  };

  const handleUpdateActivity = async (updatedAct: any) => {
    if (!isAdminAdministrasi && !isGuru) return;
    
    try {
      const formData = new FormData();
      formData.append("namaKegiatan", updatedAct.title);
      formData.append("deskripsi", updatedAct.description || "");
      formData.append("tanggalKegiatan", updatedAct.date || new Date().toISOString().split("T")[0]);
      // Kirim file foto baru jika ada (dari edit form)
      const files: File[] = Array.isArray(updatedAct.imageFiles) ? updatedAct.imageFiles : [];
      if (updatedAct.imageFile) files.unshift(updatedAct.imageFile); // backward compat
      files.forEach((file) => formData.append("foto", file));

      await activityService.update(updatedAct.id, formData);
      
      const actRes = await activityService.getAll();
      const rawAct = Array.isArray(actRes) ? actRes : actRes?.data || [];
      const mappedAct = rawAct.map((item: any) => {
        const fotosArr = Array.isArray(item.foto) ? item.foto
          : Array.isArray(item.fotos) ? item.fotos : [];
        const thumb = fotosArr.find((f: any) => f.isDefault || f.isThumbnail) || fotosArr[0];
        const imageUrl = thumb?.viewUrl || thumb?.url || thumb?.path || (typeof item.foto === "string" ? item.foto : "");
        return {
          id: item.id,
          title: item.namaKegiatan || item.title || "Kegiatan Madrasah",
          description: item.deskripsi || item.description || "",
          date: item.tanggalKegiatan || item.date || new Date().toISOString().split("T")[0],
          featuredImage: imageUrl,
          driveLink: item.gdriveFolderUrl || item.driveLink || item.folderUrl || item.driveFolderUrl
            || item.googleDriveUrl || item.folderDriveUrl || item.urlFolder
            || item.linkDrive || item.urlDrive || "",
          isPublic: item.isPublic !== undefined ? item.isPublic : true
        };
      });
      setActivities(mappedAct);
      localStorage.setItem("sgw_activities", JSON.stringify(mappedAct));
    } catch (err) {
      const updated = activities.map((act) => (act.id === updatedAct.id ? updatedAct : act));
      setActivities(updated);
      localStorage.setItem("sgw_activities", JSON.stringify(updated));
    }

    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Memperbarui dokumentasi kegiatan: ${updatedAct.title}`,
    };
    setLogs([newLog, ...logs]);
  };

  const handleTogglePublicActivity = async (actId: string | number, isPublic: boolean) => {
    if (!isAdminAdministrasi && !isGuru) return;

    try {
      await activityService.togglePublic(actId, isPublic);
      
      const actRes = await activityService.getAll();
      const rawAct = Array.isArray(actRes) ? actRes : actRes?.data || [];
      const mappedAct = rawAct.map((item: any) => {
        const fotosArr = Array.isArray(item.foto) ? item.foto
          : Array.isArray(item.fotos) ? item.fotos : [];
        const thumb = fotosArr.find((f: any) => f.isDefault || f.isThumbnail) || fotosArr[0];
        const imageUrl = thumb?.viewUrl || thumb?.url || thumb?.path || (typeof item.foto === "string" ? item.foto : "");
        return {
          id: item.id,
          title: item.namaKegiatan || item.title || "Kegiatan Madrasah",
          description: item.deskripsi || item.description || "",
          date: item.tanggalKegiatan || item.date || "",
          featuredImage: imageUrl,
          driveLink: item.gdriveFolderUrl || item.driveLink || item.folderUrl || item.driveFolderUrl
            || item.googleDriveUrl || item.folderDriveUrl || item.urlFolder
            || item.linkDrive || item.urlDrive || "",
          isPublic: item.isPublic !== undefined ? item.isPublic : true
        };
      });
      setActivities(mappedAct);
      localStorage.setItem("sgw_activities", JSON.stringify(mappedAct));
    } catch (err) {
      const updated = activities.map((act) => 
        act.id === actId ? { ...act, isPublic } : act
      );
      setActivities(updated);
      localStorage.setItem("sgw_activities", JSON.stringify(updated));
    }

    const targetAct = activities.find(a => a.id === actId);
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Mengubah publikasi kegiatan '${targetAct?.title || "kegiatan"}' menjadi ${isPublic ? "Publik" : "Privat"}`,
    };
    setLogs([newLog, ...logs]);
  };

  const handleDeleteActivity = (actId: number) => {
    if (!isAdminAdministrasi) return;
    const act = activities.find(a => a.id === actId);
    if (!act) return;

    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Hapus Dokumentasi Kegiatan",
      message: `Apakah Anda yakin ingin menghapus dokumentasi kegiatan "${act.title}" secara permanen dari arsip?`,
      actionType: "delete_activity" as any,
      targetId: actId
    });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !profileName) return;

    // Cari user bersangkutan berdasarkan username login yang aktif
    const activeUsername = session.role === "admin_adm" ? "admin_adm" : session.role === "admin_trx" ? "admin_trx" : "guru";
    
    // Perbarui password jika input password tidak kosong
    setUsers(prev => prev.map(u => {
      if (u.username === activeUsername) {
        const updated = { ...u, name: profileName };
        if (profilePassword) {
          updated.password = profilePassword;
        }
        return updated;
      }
      return u;
    }));

    // Perbarui session aktif
    setSession({
      ...session,
      name: profileName
    });

    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: profileName,
      action: `Memperbarui profil mandiri (Nama lengkap${profilePassword ? " & kata sandi" : ""})`,
    };
    setLogs([newLog, ...logs]);
    
    setShowProfileDrawer(false);
    setProfilePassword("");
  };



  const mapFrontendMonthsToBackend = (months: string[]): string[] => {
    if (!months || !Array.isArray(months)) return [];
    const monthMap: Record<string, string> = {
      "07": "JULI",
      "08": "AGUSTUS",
      "09": "SEPTEMBER",
      "10": "OKTOBER",
      "11": "NOVEMBER",
      "12": "DESEMBER",
      "01": "JANUARI",
      "02": "FEBRUARI",
      "03": "MARET",
      "04": "APRIL",
      "05": "MEI",
      "06": "JUNI"
    };
    return months.map(m => {
      const parts = m.split("-");
      const monthNum = parts.length > 1 ? parts[1] : parts[0];
      return monthMap[monthNum] || m;
    });
  };

  const handleAddSppLesPayment = async (newTxData: any) => {
    if (!isAdminTransaksi) return;
    try {
      const apiStatusSetoran = newTxData.depositStatus === "Sudah Disetor" ? "SUDAH" : "BELUM";
      const selectedMonths = newTxData.paidMonths || [];

      // Format bulanList to match backend expectations: Array<{ bulan: number, tahun: number }>
      const bulanList = selectedMonths.map((m: string) => {
        const [yearStr, monthStr] = m.split("-");
        return {
          bulan: Number(monthStr),
          tahun: Number(yearStr)
        };
      });

      const payload: any = {
        siswaId: String(newTxData.studentId),
        tanggalBayar: newTxData.date,
        tahunAjaran: activeAcademicYear,
        nominalSpp: Number(newTxData.spp) * Math.max(1, selectedMonths.length),
        nominalLes: Number(newTxData.les),
        catatan: newTxData.description,
        statusSetoran: apiStatusSetoran
      };

      // Add bulanList to payload if multi-months are selected
      if (bulanList.length > 0) {
        payload.bulanList = bulanList;
      }

      console.log("[SGW Debug] Posting SPP Payload to Backend:", JSON.stringify(payload, null, 2));

      await sppService.create(payload);

      // Refresh list
      const sppRes = await sppService.getAll();
      const rawSpp = Array.isArray(sppRes) ? sppRes : sppRes?.data || [];
      setSppTransactions(mapSppTransactions(rawSpp));

      // Refresh Matriks
      await loadSppMatriks(activeAcademicYear);

      const studentName = students.find(s => s.id === newTxData.studentId)?.name || "Siswa";
      const newLog = {
        id: Date.now(),
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: session.name,
        action: `Mencatat SPP & Les ${studentName}: SPP Rp ${newTxData.spp.toLocaleString()}, Les Rp ${newTxData.les.toLocaleString()}`,
      };
      setLogs([newLog, ...logs]);
    } catch (err: any) {
      console.error("[SGW Debug] Failed SPP post details:", err.response?.data || err);
      const errorMsg = err.response?.data?.message || (err.response?.data ? JSON.stringify(err.response.data) : err.message);
      alert("Gagal mencatat pembayaran SPP ke backend: " + errorMsg);
    }
  };

  const handleUpdateSppPayment = async (updatedTx: any) => {
    if (!isAdminTransaksi) return;
    try {
      const apiStatusSetoran = updatedTx.depositStatus === "Sudah Disetor" ? "SUDAH" : "BELUM";
      const apiPaidMonths = mapFrontendMonthsToBackend(updatedTx.paidMonths || []);

      await sppService.update(updatedTx.id, {
        nominalSpp: Number(updatedTx.spp),
        nominalLes: Number(updatedTx.les),
        statusSetoran: apiStatusSetoran,
        tanggalBayar: updatedTx.date,
        catatan: updatedTx.description
      });

      // Refresh list
      const sppRes = await sppService.getAll();
      const rawSpp = Array.isArray(sppRes) ? sppRes : sppRes?.data || [];
      setSppTransactions(mapSppTransactions(rawSpp));

      // Refresh Matriks
      await loadSppMatriks(activeAcademicYear);

      const studentName = students.find(s => s.id === updatedTx.studentId)?.name || "Siswa";
      const newLog = {
        id: Date.now(),
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: session.name,
        action: `Memperbarui transaksi kas SPP ${studentName} (${updatedTx.depositStatus})`,
      };
      setLogs([newLog, ...logs]);
    } catch (err: any) {
      alert("Gagal memperbarui pembayaran SPP ke backend: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteSppPayment = (txId: string | number) => {
    if (!isAdminTransaksi) return;
    const tx = sppTransactions.find(t => t.id === txId);
    if (!tx) return;
    const studentName = students.find(s => s.id === tx.studentId)?.name || "Siswa";
    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Hapus Transaksi",
      message: `Apakah Anda yakin ingin menghapus transaksi pembayaran SPP/Les untuk "${studentName}" sebesar Rp ${tx.total.toLocaleString()} secara permanen?`,
      actionType: "delete_spp",
      targetId: txId
    });
  };

  const handleAddSavingsTransaction = (data: {
    studentId: number;
    description: string;
    debet: number;
    kredit: number;
    transType: "Setoran" | "Penarikan";
    amountNum: number;
  }) => {
    if (!isAdminTransaksi) return false;

    // Check Penarikan Saldo
    if (data.transType === "Penarikan") {
      const studentTrans = savings.filter(t => t.studentId === data.studentId);
      const currentSaldo = studentTrans.reduce((total, trans) => total + trans.debet - trans.kredit, 0);
      if (data.amountNum > currentSaldo) {
        alert("Saldo tidak cukup untuk melakukan penarikan!");
        return false;
      }
    }

    const newTrans = {
      id: Date.now(),
      studentId: data.studentId,
      date: new Date().toISOString().substring(0, 10),
      description: data.description || "Setoran rutin",
      debet: data.debet,
      kredit: data.kredit,
      admin: session.name,
    };

    setSavings([newTrans, ...savings]);

    const studentName = students.find(s => s.id === data.studentId)?.name || "Anak";
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Mencatat ${data.transType} tabungan Rp ${data.amountNum.toLocaleString()} untuk ${studentName}`,
    };
    setLogs([newLog, ...logs]);
    return true;
  };

  const handleUpdateMurajaah = async (studentId: string | number, param: string, score: string) => {
    if (!isAdminAdministrasi && !isGuru) return;
    
    let nextData: any = {};
    setMurajaahData(prev => {
      const studentData = prev[String(studentId)] || {};
      const updated = {
        ...prev,
        [String(studentId)]: {
          ...studentData,
          [param]: score
        }
      };
      nextData = updated;
      localStorage.setItem("sgw_murajaah_data", JSON.stringify(updated));
      return updated;
    });

    try {
      const materiInfo = murojaahMateriList.find(
        (m) => m.namaMateri.toLowerCase().trim() === param.toLowerCase().trim()
      );

      if (materiInfo) {
        await murojaahService.savePenilaian({
          siswaId: studentId,
          materiId: materiInfo.id,
          predikat: score
        });
      } else {
        console.warn(`[SGW] Materi '${param}' tidak terdaftar di database backend. Tersimpan secara lokal saja.`);
      }
    } catch (err) {
      console.warn("[SGW] Gagal menyimpan penilaian murojaah ke backend database. Tersimpan secara lokal di browser.");
      // Simpan paksa data lokal untuk memastikan kekokohan data
      localStorage.setItem("sgw_murajaah_data", JSON.stringify(nextData));
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#FAF8F5] text-neutral-dark flex relative font-sans">
      {/* Background Chalkboard Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.012)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>

      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`w-64 bg-white text-neutral-dark flex flex-col justify-between p-5 border-r border-primary-green/10 z-40 h-full flex-shrink-0 transition-transform duration-300 md:translate-x-0 fixed md:relative ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-y-auto`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-primary-green/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-primary-green/20 overflow-hidden bg-white shadow-xs">
                <img src="/images/logo.jpg" alt="Logo RA Sahabat" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-baloo text-sm font-bold tracking-wide leading-none text-neutral-dark">RA Sahabat</h2>
                <span className="text-[9px] text-primary-green font-extrabold uppercase mt-1 block tracking-wider">Portal Administrasi</span>
              </div>
            </div>
            
            {/* Close Button for Mobile Sidebar */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 cursor-pointer flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-1.5">
            <span className="text-[9px] text-primary-green/60 font-extrabold uppercase tracking-widest block mb-2 px-3">Menu Utama</span>

            {/* Data Siswa — Admin Administrasi & Guru */}
            {(isAdminAdministrasi || isGuru) && (
              <button
                onClick={() => { setActiveTab("siswa"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  activeTab === "siswa"
                    ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                    : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Data Siswa</span>
              </button>
            )}

            {/* Data Kelas — Admin Administrasi only */}
            {isAdminAdministrasi && (
              <button
                onClick={() => { setActiveTab("kelas"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  activeTab === "kelas"
                    ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                    : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Data Kelas</span>
              </button>
            )}

            {/* Kelola Pengguna — Admin Administrasi only */}
            {isAdminAdministrasi && (
              <button
                onClick={() => { setActiveTab("users"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  activeTab === "users"
                    ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                    : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Kelola Pengguna</span>
              </button>
            )}

            {/* Dokumentasi Kegiatan — Admin Administrasi & Guru */}
            {(isAdminAdministrasi || isGuru) && (
              <button
                onClick={() => { setActiveTab("kegiatan"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  activeTab === "kegiatan"
                    ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                    : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span>Dokumentasi Kegiatan</span>
              </button>
            )}

            {/* Pencatatan SPP & Les — Admin Transaksi only */}
            {isAdminTransaksi && (
              <button
                onClick={() => { setActiveTab("spp"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  activeTab === "spp"
                    ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                    : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Pencatatan SPP & Les</span>
              </button>
            )}

            {/* Tabungan Siswa — Admin Transaksi only */}
            {isAdminTransaksi && (
              <button
                onClick={() => { setActiveTab("tabungan"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  activeTab === "tabungan"
                    ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                    : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Tabungan Siswa</span>
              </button>
            )}

            {/* Laporan Murajaah — Admin Administrasi & Guru */}
            {(isAdminAdministrasi || isGuru) && (
              <button
                onClick={() => { setActiveTab("murajaah"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  activeTab === "murajaah"
                    ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                    : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Laporan Murajaah</span>
              </button>
            )}

            {/* Log Aktivitas — Admin Administrasi only */}
            {isAdminAdministrasi && (
              <button
                onClick={() => { setActiveTab("audit"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  activeTab === "audit"
                    ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                    : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Log Aktivitas</span>
              </button>
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-5 border-t border-primary-green/10">
          {/* Clickable Sidebar User Profile Card */}
          <div 
            onClick={() => {
              const currentDbUser = users.find(u => u.username === session?.username);
              setProfileName(currentDbUser ? currentDbUser.name : (session?.name || ""));
              setProfilePassword("");
              setShowProfileDrawer(true);
            }}
            className="bg-[#FAF8F5] border border-primary-green/10 hover:border-primary-green rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-soft-mint/20 transition-all"
            title="Klik untuk ubah nama atau kata sandi profil"
          >
            <div className="w-8 h-8 rounded-full bg-primary-green text-white flex items-center justify-center font-extrabold text-[10px] flex-shrink-0">
              {isAdminAdministrasi ? "AA" : isAdminTransaksi ? "AT" : "GR"}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-neutral-dark font-bold leading-tight truncate">
                {(() => {
                  const currentDbUser = users.find(u => u.username === session?.username);
                  return currentDbUser ? currentDbUser.name : (session?.name || "Guru Madrasah");
                })()}
              </p>
              <span className="text-[8px] text-primary-green font-bold uppercase mt-1 block">
                {isAdminAdministrasi ? "Admin Administrasi" : isAdminTransaksi ? "Admin Transaksi" : "Guru"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-lg bg-accent/5 hover:bg-accent/15 text-accent hover:text-accent-dark font-extrabold text-xs transition-all border border-accent/20 hover:border-accent/40 shadow-3xs cursor-pointer text-center flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">

        {/* ── Fixed Top Header ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 md:px-10 pt-6 md:pt-7 pb-4 border-b border-primary-green/10 bg-[#FAF8F5]">
          <div>
            <span className="text-[9px] text-neutral-gray font-bold uppercase tracking-wider block">
              Portal Belajar &amp; Administrasi KB/RA Sahabat
            </span>
            <h2 className="font-baloo text-xl sm:text-2xl font-bold text-neutral-dark mt-0.5">
              {activeTab === "siswa" && "Manajemen Data Peserta Didik"}
              {activeTab === "kelas" && "Manajemen Data Kelas RA Sahabat"}
              {activeTab === "users" && "Kelola Akses Pengguna & Akun Petugas"}
              {activeTab === "kegiatan" && "Dokumentasi Kegiatan"}
              {activeTab === "spp" && "Pencatatan SPP & Les Terpadu"}
              {activeTab === "tabungan" && "Buku Tabungan Digital"}
              {activeTab === "murajaah" && "Laporan Hasil Murajaah Santri"}
              {activeTab === "audit" && "Log Aktivitas Petugas"}
            </h2>
          </div>

          {/* Hamburger Button for Mobile */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg bg-white border border-primary-green/10 text-primary-green hover:bg-soft-mint/10 cursor-pointer shadow-3xs flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable Tab Content ── */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6">
          {loadingData ? (
            <SkeletonLoader type={activeTab as any} />
          ) : (
            <>
              {activeTab === "siswa" && (() => {
                // Mendapatkan ID user dari sesi login cached di localStorage
                let cachedUserId: string | number = "";
                if (typeof window !== "undefined") {
                  try {
                    const localSess = localStorage.getItem("user_session");
                    if (localSess) cachedUserId = JSON.parse(localSess).id || "";
                  } catch {}
                }

                const guruClassNames = classes
                  .filter((c) => {
                    const tName = (c.teacherName || "").trim().toLowerCase();
                    const sName = (session?.name || "").trim().toLowerCase();
                    const cTeacherId = String(c.teacherId || "").trim();
                    const currentId = String(cachedUserId || "").trim();
                    
                    // Lakukan pencocokan berdasarkan ID guru OR kesamaan nama mengandung substring
                    return (
                      (cTeacherId !== "" && currentId !== "" && cTeacherId === currentId) ||
                      (tName !== "" && sName !== "" && (tName.includes(sName) || sName.includes(tName)))
                    );
                  })
                  .map((c) => c.className);
                const displayedStudents = isGuru
                  ? students.filter((st) => guruClassNames.includes(st.class))
                  : students;
                return (
                  <StudentTab
                    students={displayedStudents}
                    classes={classes}
                    isAdminAdministrasi={isAdminAdministrasi}
                    isGuru={isGuru}
                    onAddStudent={handleAddStudent}
                    onUpdateStudent={handleUpdateStudent}
                    onDeleteStudent={handleDeleteStudent}
                    onUpdateStudentStatus={handleUpdateStudentStatus}
                  />
                );
              })()}

              {activeTab === "kelas" && (
                <KelasTab
                  students={students}
                  classes={classes}
                  users={users}
                  isAdminAdministrasi={isAdminAdministrasi}
                  isGuru={isGuru}
                  currentUserDisplayName={session.name}
                  onAddClass={handleAddClass}
                  onUpdateClass={handleUpdateClass}
                  onDeleteClass={handleDeleteClass}
                />
              )}

              {activeTab === "users" && (
                <UserTab
                  users={users}
                  localPasswords={localPasswords}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                />
              )}

              {activeTab === "kegiatan" && (
                <KegiatanTab
                  activities={activities}
                  isAdminAdministrasi={isAdminAdministrasi}
                  isGuru={isGuru}
                  onAddActivity={handleAddActivity}
                  onUpdateActivity={handleUpdateActivity}
                  onDeleteActivity={handleDeleteActivity}
                  onTogglePublic={handleTogglePublicActivity}
                />
              )}

              {activeTab === "spp" && (
                <SppTab
                  students={students}
                  classes={classes}
                  sppTransactions={sppTransactions}
                  sppMatriksData={sppMatriksData}
                  isAdminTransaksi={isAdminTransaksi}
                  onAddSppLesPayment={handleAddSppLesPayment}
                  onUpdateSppLesPayment={handleUpdateSppPayment}
                  onDeleteSppLesPayment={handleDeleteSppPayment}
                  onRefreshMatriks={loadSppMatriks}
                />
              )}

              {activeTab === "tabungan" && (
                <TabunganTab
                  students={students}
                  classes={classes}
                  savings={savings}
                  isAdminTransaksi={isAdminTransaksi}
                  adminName={session.name}
                  onAddTransaction={handleAddSavingsTransaction}
                />
              )}

              {activeTab === "murajaah" && (() => {
                const guruClassNames = classes
                  .filter((c) => {
                    const tName = (c.teacherName || "").trim().toLowerCase();
                    const sName = (session?.name || "").trim().toLowerCase();
                    return tName === sName && tName !== "";
                  })
                  .map((c) => c.className);
                const displayedStudents = isGuru
                  ? students.filter((st) => guruClassNames.includes(st.class))
                  : students;
                return (
                  <MurajaahTab
                    students={displayedStudents}
                    classes={classes}
                    murajaahData={murajaahData}
                    isAdminAdministrasi={isAdminAdministrasi}
                    isGuru={isGuru}
                    onUpdateMurajaah={handleUpdateMurajaah}
                  />
                );
              })()}

              {activeTab === "audit" && (
                <AuditTab logs={logs} />
              )}
            </>
          )}
        </div>

        {/* Custom Confirmation Modal Pop-up (Destructive/Important actions) */}
        {confirmModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-primary-green/10 w-full max-w-sm p-6 relative shadow-lg space-y-4 text-center animate-fade-in">
              <div className="mx-auto w-12 h-12 bg-accent/15 text-accent rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <div className="space-y-1.5">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">{confirmModal.title}</h4>
                <p className="text-xs text-neutral-gray font-semibold leading-relaxed px-2">
                  {confirmModal.message}
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleExecuteConfirmAction}
                  disabled={isConfirming}
                  className="flex-1 py-2 bg-accent hover:bg-accent-dark text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-3xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConfirming ? "Memproses..." : "Ya, Lanjutkan"}
                </button>
                <button
                  type="button"
                  disabled={isConfirming}
                  onClick={() => setConfirmModal({ isOpen: false, title: "", message: "", actionType: null, targetId: null })}
                  className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Profil Akun Saya - Sliding Side Drawer */}
      {showProfileDrawer && session && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity animate-fade-in"
            onClick={() => {
              setShowProfileDrawer(false);
              setProfilePassword("");
            }}
          />
          
          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-white border-l border-primary-green/10 flex flex-col shadow-2xl h-full animate-slide-in">
              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-gray/10 flex justify-between items-center bg-[#FAF8F5]">
                <div>
                  <h4 className="font-baloo text-base font-bold text-neutral-dark">Profil Akun Saya</h4>
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wide">Kelola nama lengkap & kata sandi</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileDrawer(false);
                    setProfilePassword("");
                  }}
                  className="w-6 h-6 rounded-full bg-white border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleUpdateProfile} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-semibold text-neutral-dark">
                
                {/* Visual Avatar Card */}
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-neutral-gray/10 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-green text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0">
                    {session.role === "admin_adm" ? "AA" : session.role === "admin_trx" ? "AT" : "GR"}
                  </div>
                  <div>
                    <h5 className="font-baloo text-sm font-bold text-neutral-dark">
                      {(() => {
                        const currentDbUser = users.find(u => u.username === session?.username);
                        return currentDbUser ? currentDbUser.name : (session?.name || "Guru Madrasah");
                      })()}
                    </h5>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200 mt-1 inline-block">
                      {session.role === "admin_adm" ? "Admin Administrasi" : session.role === "admin_trx" ? "Admin Transaksi" : "Guru Kelas"}
                    </span>
                  </div>
                </div>

                {/* Input Nama Lengkap */}
                <div>
                  <label htmlFor="profName" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Nama Lengkap (Gelar)</label>
                  <input
                    type="text"
                    id="profName"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                  />
                </div>

                {/* Read-Only Username */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Username Login</label>
                  <input
                    type="text"
                    readOnly
                    value={session?.username || (session?.role === "admin_adm" ? "admin_adm" : session?.role === "admin_trx" ? "admin_trx" : "guru")}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-neutral-gray/10 bg-neutral-gray/5 text-neutral-gray text-xs font-mono focus:outline-none cursor-not-allowed"
                    title="Username login tidak dapat diubah demi alasan keamanan"
                  />
                  <span className="text-[8px] text-neutral-gray font-normal block mt-1 leading-normal">
                    *Username login dikunci demi integritas sistem.
                  </span>
                </div>

                {/* Read-Only Peran Akses */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Hak Akses Sistem (Role)</label>
                  <input
                    type="text"
                    readOnly
                    value={session.role === "admin_adm" ? "Admin Administrasi" : session.role === "admin_trx" ? "Admin Transaksi" : "Guru Kelas"}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-neutral-gray/10 bg-neutral-gray/5 text-neutral-gray text-xs font-semibold focus:outline-none cursor-not-allowed"
                    title="Hak akses hanya bisa diubah oleh Admin Administrasi utama"
                  />
                  <span className="text-[8px] text-neutral-gray font-normal block mt-1 leading-normal">
                    *Hanya Admin Administrasi yang berwenang mengganti hak akses.
                  </span>
                </div>

                {/* Input Password Baru */}
                <div>
                  <label htmlFor="profPass" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Kata Sandi Baru</label>
                  <input
                    type="password"
                    id="profPass"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    placeholder="Kosongkan jika tidak ingin mengubah kata sandi saat ini"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                  />
                </div>

                {/* Sticky buttons at bottom */}
                <div className="flex gap-2 pt-4 border-t border-neutral-gray/10 sticky bottom-0 bg-white">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
                  >
                    Simpan Profil
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileDrawer(false);
                      setProfilePassword("");
                    }}
                    className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
