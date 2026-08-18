"use client";

type SkeletonType =
  | "siswa"
  | "kelas"
  | "users"
  | "spp"
  | "tabungan"
  | "murajaah"
  | "kegiatan"
  | "audit"
  | "default";

interface SkeletonLoaderProps {
  type?: SkeletonType;
}

// Reusable shimmer base element
const Shimmer = ({ className, style }: { className: string; style?: React.CSSProperties }) => (
  <div style={style} className={`bg-gradient-to-r from-stone-100 via-stone-50 to-stone-100 bg-[length:200%_100%] animate-shimmer rounded-xl ${className}`} />
);

// Card grid skeleton (siswa, kelas, users)
const CardGridSkeleton = () => (
  <div className="space-y-5 animate-fade-in">
    {/* Header bar */}
    <div className="bg-white p-4 rounded-2xl border border-primary-green/10 shadow-3xs flex gap-3 items-center">
      <Shimmer className="h-9 flex-1 rounded-xl" />
      <Shimmer className="h-9 w-40 rounded-xl" />
    </div>
    {/* Grid cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-primary-green/10 p-5 shadow-3xs space-y-3"
        >
          <div className="flex justify-between items-start">
            <Shimmer className="h-5 w-20 rounded-full" />
            <Shimmer className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <Shimmer className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Shimmer className="h-4 w-3/4" />
              <Shimmer className="h-3 w-1/2" />
            </div>
          </div>
          <Shimmer className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

// Table skeleton (spp, tabungan)
const TableSkeleton = () => (
  <div className="space-y-5 animate-fade-in">
    {/* Header bar */}
    <div className="bg-white p-4 rounded-2xl border border-primary-green/10 shadow-3xs flex gap-3 items-center">
      <Shimmer className="h-9 flex-1 rounded-xl" />
      <Shimmer className="h-9 w-36 rounded-xl" />
      <Shimmer className="h-9 w-36 rounded-xl" />
    </div>
    {/* Table */}
    <div className="bg-white rounded-2xl border border-primary-green/10 shadow-3xs overflow-hidden">
      {/* Table header */}
      <div className="bg-[#FAF8F5] px-5 py-3 flex gap-4 border-b border-neutral-gray/10">
        {[40, 80, 60, 60, 80].map((w, i) => (
          <Shimmer key={i} className={`h-3 rounded-full`} style={{ width: `${w}px` } as React.CSSProperties} />
        ))}
      </div>
      {/* Table rows */}
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="px-5 py-3.5 flex gap-4 items-center border-b border-neutral-gray/5 last:border-0"
        >
          <Shimmer className="h-3 w-10 rounded-full" />
          <Shimmer className="h-3 flex-1 rounded-full" />
          <Shimmer className="h-3 w-20 rounded-full" />
          <Shimmer className="h-5 w-16 rounded-full" />
          <Shimmer className="h-6 w-14 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

// List skeleton (murajaah, kegiatan, audit)
const ListSkeleton = () => (
  <div className="space-y-5 animate-fade-in">
    {/* Header bar */}
    <div className="bg-white p-4 rounded-2xl border border-primary-green/10 shadow-3xs flex gap-3 items-center">
      <Shimmer className="h-9 flex-1 rounded-xl" />
      <Shimmer className="h-9 w-32 rounded-xl" />
    </div>
    {/* List items */}
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-primary-green/10 p-4 shadow-3xs flex items-center gap-4"
        >
          <Shimmer className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-3.5 w-3/5 rounded-full" />
            <Shimmer className="h-2.5 w-2/5 rounded-full" />
          </div>
          <Shimmer className="h-7 w-20 rounded-lg flex-shrink-0" />
        </div>
      ))}
    </div>
  </div>
);

export default function SkeletonLoader({ type = "default" }: SkeletonLoaderProps) {
  if (type === "spp" || type === "tabungan") {
    return <TableSkeleton />;
  }

  if (type === "murajaah" || type === "kegiatan" || type === "audit") {
    return <ListSkeleton />;
  }

  // siswa, kelas, users, default
  return <CardGridSkeleton />;
}
