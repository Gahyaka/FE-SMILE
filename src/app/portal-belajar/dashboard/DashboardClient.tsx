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

// Import initial mock data
import {
  initialActivities,
  initialStudents,
  initialSppTransactions,
  initialSavings,
  initialMurajaah,
  initialLogs,
  initialClasses,
  initialUsers,
} from "./mockData";
import { studentService } from "@/services/student";
import { classService } from "@/services/class";
import { userService } from "@/services/user";

type TabKey = "siswa" | "kelas" | "kegiatan" | "spp" | "tabungan" | "murajaah" | "users" | "audit";

function getDefaultTab(role: "admin_adm" | "admin_trx" | "guru"): TabKey {
  if (role === "admin_trx") return "spp";
  if (role === "guru") return "kegiatan";
  return "siswa"; // admin_adm
}

function mapStudentsData(rawStudents: any[]): any[] {
  return rawStudents.map((st: any) => ({
    id: st.id,
    name: st.namaLengkap || st.nama_lengkap || "Siswa Tanpa Nama",
    nisn: st.nis || st.nisn || "",
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
    fase: c.tahunAjaran || c.tahun_ajaran || "2025/2026", // Map Academic Year here
    description: c.description || c.deskripsi || "Tidak ada deskripsi"
  }));
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
    .map((u: any) => ({
      id: u.id,
      name: u.nama || u.name || "Petugas Madrasah",
      username: u.username,
      role: (u.role || "").toUpperCase() === "ADMIN_ADMINISTRASI" || (u.role || "").toUpperCase() === "ADMIN" 
        ? "admin_adm" 
        : (u.role || "").toUpperCase() === "ADMIN_TRANSAKSI" 
          ? "admin_trx" 
          : "guru"
    }));
}

export default function DashboardClient() {
  const router = useRouter();
  const [session, setSession] = useState<{ role: "admin_adm" | "admin_trx" | "guru"; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("siswa");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Shared database states
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activities, setActivities] = useState(initialActivities);
  const [sppTransactions, setSppTransactions] = useState(initialSppTransactions);
  const [savings, setSavings] = useState(initialSavings);
  const [murajaahData, setMurajaahData] = useState<{[studentId: number]: {[param: string]: string}}>(initialMurajaah);
  const [logs, setLogs] = useState(initialLogs);

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionType: "delete_student" | "delete_class" | "delete_spp" | "delete_user" | null;
    targetId: number | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    actionType: null,
    targetId: null
  });

  // State edit profil saya
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePassword, setProfilePassword] = useState("");

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

          const classRes = await classService.getAll();
          const rawClasses = Array.isArray(classRes) ? classRes : classRes?.data || [];
          setClasses(mapClassesData(rawClasses));

          // Fetch users from backend Adonis
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
        nis: newStData.nisn,
        namaLengkap: newStData.name,
        namaOrangTua: newStData.parentName || "Wali Murid RA Sahabat",
        kelasId: String(kelasId)
      });
      
      // Refresh list
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
        nis: updatedStudent.nisn,
        namaLengkap: updatedStudent.name,
        namaOrangTua: updatedStudent.parentName || "Wali Murid RA Sahabat",
        kelasId: String(kelasId)
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
      waliKelas: newClsData.teacherName || "Bunda Guru"
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
      waliKelas: updatedCls.teacherName || "Bunda Guru"
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
        console.error("Registration attempt failed:", err.response?.data || err.message);
        const errMessage = String(err.response?.data?.message || err.message).toLowerCase();
        const isConflict = err.response?.status === 409 || errMessage.includes("409") || errMessage.includes("terdaftar") || errMessage.includes("conflict");
        
        if (isConflict && attempts < maxAttempts) {
          // Auto-generate username variation by appending a random 2-digit number
          const randomSuffix = String(Math.floor(10 + Math.random() * 90));
          finalUsername = `${newUsrData.username}${randomSuffix}`;
          console.warn(`Username conflict detected. Auto-retrying with alternative username: ${finalUsername}`);
          continue;
        }
        
        // If other error or max attempts reached, throw to the outer catch block
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
      await userService.resetPassword(updatedUsr.id, updatedUsr.password);
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
    alert("Gagal mereset password di backend: " + (err.response?.data?.message || err.message));
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
        setSppTransactions(prev => prev.filter(t => t.id !== targetId));

        const newLog = {
          id: Date.now(),
          time: new Date().toISOString().replace('T', ' ').substring(0, 16),
          user: session.name,
          action: `Menghapus transaksi kas SPP ${studentName} senilai Rp ${tx.total.toLocaleString()}`,
        };
        setLogs([newLog, ...logs]);
      }
    } else if (actionType === "delete_user") {
      const targetUser = users.find(u => u.id === targetId);
      if (targetUser) {
        try {
          // Coba hapus ke backend
          await userService.delete(targetId);
          
          const userRes = await userService.getAll();
          const rawUsers = Array.isArray(userRes) ? userRes : userRes?.data || [];
          setUsers(mapUsersData(rawUsers));
        } catch {
          // Fallback lokal jika backend tidak menyediakan rute delete user
          // Catat ID di list local agar konsisten saat refresh
          const raw = localStorage.getItem("deleted_user_ids");
          const deletedUserIds = raw ? JSON.parse(raw) : [];
          if (!deletedUserIds.includes(targetId)) {
            deletedUserIds.push(targetId);
            localStorage.setItem("deleted_user_ids", JSON.stringify(deletedUserIds));
          }

          const updated = users.filter(u => u.id !== targetId);
          setUsers(updated);
          localStorage.setItem("system_users", JSON.stringify(updated));
        }

        const newLog = {
          id: Date.now(),
          time: new Date().toISOString().replace('T', ' ').substring(0, 16),
          user: session.name,
          action: `Menghapus akun pengguna: ${targetUser.name} (Lokal / Backend)`,
        };
        setLogs([newLog, ...logs]);
      }
    }

    setConfirmModal({
      isOpen: false,
      title: "",
      message: "",
      actionType: null,
      targetId: null
    });
  };

  const handleAddActivity = (newActData: any) => {
    if (!isAdminAdministrasi && !isGuru) return;
    
    // Auto-generate drive folder link based on activity title
    const sanitizedTitle = (newActData.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newAct = {
      ...newActData,
      id: Date.now(),
      driveLink: `https://drive.google.com/drive/folders/mock-${sanitizedTitle}-${Date.now()}`
    };
    
    const updated = [newAct, ...activities];
    setActivities(updated);
    localStorage.setItem("sgw_activities", JSON.stringify(updated));

    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Menambahkan kegiatan: ${newAct.title} (Folder Google Drive terbuat otomatis)`,
    };
    setLogs([newLog, ...logs]);
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



  const handleAddSppLesPayment = (newTxData: any) => {
    if (!isAdminTransaksi) return;
    const totalNum = newTxData.spp + newTxData.les;
    const newTx = {
      ...newTxData,
      id: Date.now(),
      total: totalNum
    };
    setSppTransactions([newTx, ...sppTransactions]);

    const studentName = students.find(s => s.id === newTxData.studentId)?.name || "Siswa";
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Mencatat SPP & Les ${studentName}: SPP Rp ${newTxData.spp.toLocaleString()}, Les Rp ${newTxData.les.toLocaleString()} (Total Rp ${totalNum.toLocaleString()})`,
    };
    setLogs([newLog, ...logs]);
  };

  const handleUpdateSppPayment = (updatedTx: any) => {
    if (!isAdminTransaksi) return;
    setSppTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));

    const studentName = students.find(s => s.id === updatedTx.studentId)?.name || "Siswa";
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Memperbarui transaksi kas SPP ${studentName}: SPP Rp ${updatedTx.spp.toLocaleString()}, Les Rp ${updatedTx.les.toLocaleString()} (${updatedTx.depositStatus})`,
    };
    setLogs([newLog, ...logs]);
  };

  const handleDeleteSppPayment = (txId: number) => {
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

  const handleUpdateMurajaah = (studentId: number, param: string, score: string) => {
    if (!isAdminAdministrasi && !isGuru) return;
    setMurajaahData(prev => {
      const studentData = prev[studentId] || {};
      return {
        ...prev,
        [studentId]: {
          ...studentData,
          [param]: score
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-dark flex flex-col md:flex-row relative font-sans">
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
      <aside className={`w-64 bg-white text-neutral-dark flex flex-col justify-between p-5 border-r border-primary-green/10 z-40 fixed h-screen transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
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

            {/* Data Siswa — Admin Administrasi only */}
            {isAdminAdministrasi && (
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

            {/* Data Kelas — Admin Administrasi & Guru */}
            {(isAdminAdministrasi || isGuru) && (
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
              setProfileName(session.name);
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
              <p className="text-[10px] text-neutral-dark font-bold leading-tight truncate">{session.name}</p>
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
      <main className="flex-1 md:ml-64 p-6 md:p-10 min-h-screen flex flex-col justify-between">
        <div className="space-y-6">
          {/* Path Header info */}
          <div className="flex flex-row justify-between items-center gap-4 border-b border-primary-green/10 pb-4">
            <div>
              <span className="text-[9px] text-neutral-gray font-bold uppercase tracking-wider block">
                Portal Belajar & Administrasi KB/RA Sahabat
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
            
            <div className="flex items-center gap-2 flex-shrink-0">
              
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
          </div>

          {/* Render Active Tab Component */}
          {loadingData ? (
            <div className="w-full space-y-6 animate-pulse select-none">
              <div className="h-14 bg-stone-100 rounded-2xl w-full border border-neutral-gray/5"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="h-44 bg-stone-100 rounded-3xl border border-neutral-gray/5"></div>
                <div className="h-44 bg-stone-100 rounded-3xl border border-neutral-gray/5"></div>
                <div className="h-44 bg-stone-100 rounded-3xl border border-neutral-gray/5"></div>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "siswa" && (
                <StudentTab
                  students={students}
                  classes={classes}
                  isAdminAdministrasi={isAdminAdministrasi}
                  onAddStudent={handleAddStudent}
                  onUpdateStudent={handleUpdateStudent}
                  onDeleteStudent={handleDeleteStudent}
                  onUpdateStudentStatus={handleUpdateStudentStatus}
                />
              )}

              {activeTab === "kelas" && (
                <KelasTab
                  students={students}
                  classes={classes}
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
                />
              )}

              {activeTab === "spp" && (
                <SppTab
                  students={students}
                  sppTransactions={sppTransactions}
                  isAdminTransaksi={isAdminTransaksi}
                  onAddSppLesPayment={handleAddSppLesPayment}
                  onUpdateSppLesPayment={handleUpdateSppPayment}
                  onDeleteSppLesPayment={handleDeleteSppPayment}
                />
              )}

              {activeTab === "tabungan" && (
                <TabunganTab
                  students={students}
                  savings={savings}
                  isAdminTransaksi={isAdminTransaksi}
                  adminName={session.name}
                  onAddTransaction={handleAddSavingsTransaction}
                />
              )}

              {activeTab === "murajaah" && (
                <MurajaahTab
                  students={students}
                  murajaahData={murajaahData}
                  isAdminAdministrasi={isAdminAdministrasi}
                  isGuru={isGuru}
                  onUpdateMurajaah={handleUpdateMurajaah}
                />
              )}

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
                  className="flex-1 py-2 bg-accent hover:bg-accent-dark text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-3xs"
                >
                  Ya, Lanjutkan
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmModal({ isOpen: false, title: "", message: "", actionType: null, targetId: null })}
                  className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
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
                    <h5 className="font-baloo text-sm font-bold text-neutral-dark">{session.name}</h5>
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
                    value={session.role === "admin_adm" ? "admin_adm" : session.role === "admin_trx" ? "admin_trx" : "guru"}
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
