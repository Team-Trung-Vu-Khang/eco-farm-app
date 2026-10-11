import { useState, type ChangeEvent } from "react";
import { useCurrentUser } from "@/features/auth";
import { useRegions } from "@/features/farm/hooks/useRegions";
import { useSelectedWorkspaceId, useWorkspaceById } from "@/features/workspace";
import {
  ChevronDown,
  Image as ImageIcon,
  LayoutGrid,
  MapPin,
  Maximize2,
  Pencil,
  Sprout,
} from "lucide-react";

import { getUserLogoText } from "../utils/user-logo.util";
import { NotificationBell } from "@/layouts/mobile/NotificationBell";

interface HeroWorkspaceSectionProps {
  onOpenWorkspacePicker?: () => void;
  onOpenEditName?: () => void;
}

const CAN_SWITCH_WORKSPACE_ROLES = [
  "MEVI_SUPER_ADMIN",
  "MEVI_ADMIN",
  "MEVI_FARM_ADMIN",
  "MEVI_FACTORY_ADMIN",
];

// Ảnh nền đồi chè / nông trại xanh mát chất lượng cao tràn xuống bao trùm cả thẻ Farm
const DEFAULT_FARM_BANNER =
  "https://images.unsplash.com/photo-1767428254057-ddfb9498e341?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";

export function HeroWorkspaceSection({
  onOpenWorkspacePicker,
  onOpenEditName,
}: HeroWorkspaceSectionProps) {
  const { currentUser } = useCurrentUser();
  const selectedWorkspaceId = useSelectedWorkspaceId();
  const { data: workspaceData } = useWorkspaceById(selectedWorkspaceId ?? "", {
    enabled: !!selectedWorkspaceId,
  });

  const [logoImgError, setLogoImgError] = useState(false);

  // Đếm tổng số vườn từ totalElements của API regions
  const { response: regionsResponse } = useRegions({
    params: { page: 0, size: 1, domainCode: "CROP" },
  });
  const totalGardens = regionsResponse?.totalElements ?? 0;

  const userRoles = currentUser?.roleCodes ?? [];
  const canSwitchWorkspace = userRoles.some((role) =>
    CAN_SWITCH_WORKSPACE_ROLES.includes(role),
  );

  const displayName =
    currentUser?.fullName?.trim() || currentUser?.username?.trim() || "Nông hộ";

  // Tên farm hiển thị (ưu tiên farmDisplayName trong metadataJson)
  const rawMetaName = (
    (workspaceData?.metadataJson as Record<string, unknown>)
      ?.farmDisplayName as string
  )?.trim();
  const rawBrandName = workspaceData?.brandName?.trim();
  const rawName = workspaceData?.name?.trim();
  const isPhoneName = rawName && /^(\+?84|0)\d+$/.test(rawName);

  const farmTitle =
    rawMetaName ||
    rawBrandName ||
    (!isPhoneName && rawName ? rawName : "MEVI Farm");

  const totalAcreage =
    typeof workspaceData?.totalAcreage === "number" &&
    workspaceData.totalAcreage > 0
      ? `${workspaceData.totalAcreage} ha`
      : "-- ha";

  const mainCrop = workspaceData?.mainCrop?.name?.trim() || "Chưa cập nhật";

  const address =
    workspaceData?.province?.trim() ||
    workspaceData?.address?.trim() ||
    "Việt Nam";

  // Logo nông hộ / user: nếu có ảnh thì hiển thị ảnh, nếu không có thì tạo logo với màu xanh chủ đạo (#139B62) và tên của user
  const metaLogo = (
    workspaceData?.metadataJson as Record<string, unknown> | null | undefined
  )?.logoUrl as string | undefined;
  const metaAvatar = (
    workspaceData?.metadataJson as Record<string, unknown> | null | undefined
  )?.avatarUrl as string | undefined;
  const userAvatar =
    (currentUser as unknown as { avatarUrl?: string; avatar?: string } | null)
      ?.avatarUrl ||
    (currentUser as unknown as { avatarUrl?: string; avatar?: string } | null)
      ?.avatar;

  const rawLogoUrl =
    workspaceData?.imageUrl?.trim() ||
    metaLogo?.trim() ||
    metaAvatar?.trim() ||
    userAvatar?.trim() ||
    null;

  const hasLogoImg = Boolean(rawLogoUrl && !logoImgError);
  const logoText = getUserLogoText(displayName);

  const [customBannerUrl, setCustomBannerUrl] = useState<string | null>(null);

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCustomBannerUrl(objectUrl);
    }
  };

  const bannerUrl = customBannerUrl || DEFAULT_FARM_BANNER;

  return (
    <div className="relative w-full px-4 pb-5 overflow-hidden pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
      {/* ẢNH BACKGROUND NÔNG TRẠI TRÀN XUỐNG DƯỚI THẺ THÔNG TIN WORKSPACE */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={bannerUrl}
          alt="MEVI Farm Landscape"
          className="h-full w-full object-cover object-[center_25%]"
        />
        {/* Lớp gradient làm êm ảnh: phía trên giữ độ sáng tự nhiên cho trời, phía dưới chuyển mượt về màu nền app */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-black/5 via-40% to-[#F7F9F7]" />
      </div>

      <div className="relative z-10 flex flex-col justify-between">
        {/* PHẦN HEADER CỦA USER: Chiều cao tối thiểu bao gồm Brand, Chuông, Lời chào và Nút đổi ảnh */}
        <div className="min-h-[25dvh] flex flex-col pb-3 gap-12">
          {/* 1. THANH BRAND & CHUÔNG THÔNG BÁO (TRÀN LÊN TRÊN NỀN ẢNH) */}
          <div className="flex items-center justify-between pt-1">
            {/* Logo MEVI Farm */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 backdrop-blur-md shadow-xs text-primary">
                <Sprout className="h-5 w-5 text-primary stroke-[2.5]" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 drop-shadow-xs">
                MEVI <span className="text-primary font-black">Farm</span>
              </span>
            </div>

            {/* Chuông thông báo dạng nút tròn trắng nổi */}
            {/* <NotificationBell className="h-10 w-10 rounded-full bg-white/95 backdrop-blur-md shadow-md text-slate-800 hover:bg-white active:scale-95" /> */}
          </div>

          {/* 2. KHỐI LỜI CHÀO & AVATAR NÔNG DÂN */}
          <div className="flex items-center gap-3.5">
            {/* Avatar / Logo bo tròn: nếu có ảnh logo thì hiển thị ảnh, nếu không có thì tạo logo màu xanh chủ đạo và tên của user */}
            <div
              className="h-16 w-16 shrink-0 overflow-hidden rounded-full ring-3 ring-white shadow-lg bg-gradient-to-br from-[#16B371] to-[#139B62] flex items-center justify-center select-none"
              title={displayName}
              aria-label={`Logo ${displayName}`}
            >
              {hasLogoImg ? (
                <img
                  src={rawLogoUrl!}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  onError={() => setLogoImgError(true)}
                />
              ) : (
                <span className="text-2xl font-bold text-white tracking-wider">
                  {logoText}
                </span>
              )}
            </div>

            {/* Lời chào & Tên có Chevron mở WorkspacePicker */}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 drop-shadow-xs">
                Xin chào,
              </p>
              {canSwitchWorkspace ? (
                <button
                  type="button"
                  onClick={onOpenWorkspacePicker}
                  className="mt-0.5 flex items-center gap-1.5 text-left active:opacity-85 transition-opacity max-w-full group"
                >
                  <h1 className="truncate text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-primary transition-colors drop-shadow-xs">
                    {displayName}
                  </h1>
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-700 group-hover:translate-y-0.5 transition-transform" />
                </button>
              ) : (
                <h1 className="mt-0.5 truncate text-xl font-extrabold text-slate-900 tracking-tight drop-shadow-xs">
                  {displayName}
                </h1>
              )}
            </div>
          </div>

          {/* 3. NÚT ĐỔI ẢNH NỀN GÓC DƯỚI BÊN PHẢI */}
          {/* <div className="flex justify-end pt-1">
            <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md text-xs font-bold text-slate-800 hover:bg-white active:scale-95 cursor-pointer transition-all">
              <ImageIcon className="h-3.5 w-3.5 text-slate-700" />
              <span>Đổi ảnh</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerChange}
              />
            </label>
          </div> */}
        </div>

        {/* 3. THẺ THÔNG TIN CƠ BẢN WORKSPACE NẰM LỒNG TRÊN ẢNH NỀN */}
        <div className="rounded-3xl border border-white/80 bg-white/98 backdrop-blur-xs p-5 shadow-lg space-y-4">
          {/* Tiêu đề Nông trại + Icon bút chỉnh sửa */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 truncate">
              {farmTitle}
            </h2>
            {onOpenEditName && (
              <button
                type="button"
                onClick={onOpenEditName}
                className="p-1.5 -mr-1 rounded-full text-slate-400 hover:text-primary hover:bg-slate-50 active:scale-95 transition-all"
                title="Đổi tên nông hộ"
                aria-label="Đổi tên nông hộ"
              >
                <Pencil className="h-4 w-4 text-slate-500" />
              </button>
            )}
          </div>

          {/* Lưới 4 thông số cốt lõi */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 pt-1">
            {/* 1. Diện tích */}
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-primary">
                <Maximize2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Diện tích</p>
                <p className="font-bold text-sm text-slate-900 truncate mt-0.5">
                  {totalAcreage}
                </p>
              </div>
            </div>

            {/* 2. Cây trồng chính */}
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-primary">
                <Sprout className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Cây trồng chính</p>
                <p className="font-bold text-sm text-slate-900 truncate mt-0.5">
                  {mainCrop}
                </p>
              </div>
            </div>

            {/* 3. Địa chỉ */}
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-primary">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Địa chỉ</p>
                <p className="font-bold text-sm text-slate-900 truncate mt-0.5">
                  {address}
                </p>
              </div>
            </div>

            {/* 4. Số vườn (totalElements từ API regions) */}
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-primary">
                <LayoutGrid className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Số vườn</p>
                <p className="font-bold text-sm text-slate-900 truncate mt-0.5">
                  {totalGardens} vườn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
