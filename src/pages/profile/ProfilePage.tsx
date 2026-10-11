import { useMemo, useState } from "react";
import { useAuth } from "@/features/auth";
import { useSelectedWorkspaceId, useWorkspaceById } from "@/features/workspace";
import {
  BookOpen,
  Headphones,
  LogOut,
  Settings,
  Sprout,
  UserRound,
} from "lucide-react";
import {
  useAccountSidebarMenu,
  excludeSidebarPaths,
  getBottomNavExcludedPaths,
  useMobileNavItems,
  useMobileNavExtraExcludedPaths,
  type MobileNavItem,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

import { getUserLogoText } from "@/pages/mobile-home/utils/user-logo.util";
import { formatAppWorkspaceFeatureName } from "@/shared/constants/workspace.constants";
import { ProfileMenuItem } from "./components/ProfileMenuItem";
import { ProfileSidebarFeatures } from "./components/ProfileSidebarFeatures";
import { PersonalInfoBottomSheet } from "./components/PersonalInfoBottomSheet";
import { FarmInfoBottomSheet } from "./components/FarmInfoBottomSheet";
import { SettingsBottomSheet } from "./components/SettingsBottomSheet";
import { UserGuideBottomSheet } from "./components/UserGuideBottomSheet";
import { SupportContactBottomSheet } from "./components/SupportContactBottomSheet";
import { LogoutConfirmDialog } from "./components/LogoutConfirmDialog";

export interface ProfilePageProps {
  navItems?: MobileNavItem[];
  extraExcludedPaths?: string[];
}

/** Trang tài khoản (tab Profile của giao diện mobile) */
export default function ProfilePage({
  navItems: propNavItems,
  extraExcludedPaths: propExtraPaths,
}: ProfilePageProps = {}) {
  const { currentUser, logout } = useAuth();
  const selectedWorkspaceId = useSelectedWorkspaceId();
  const { data: workspaceData } = useWorkspaceById(selectedWorkspaceId ?? "");

  // Lấy danh sách navItems và extraExcludedPaths thực tế của mobile layout
  const contextNavItems = useMobileNavItems();
  const contextExtraPaths = useMobileNavExtraExcludedPaths();
  const effectiveNavItems = propNavItems ?? contextNavItems;
  const effectiveExtraPaths =
    propExtraPaths ??
    (contextExtraPaths.length > 0 ? contextExtraPaths : ["/diary", "/history"]);

  // Lấy danh sách menu sidebar của tài khoản hiện tại
  const rawSidebarMenu = useAccountSidebarMenu({
    isDev: true,
    isMevi: true,
    user: currentUser,
  });

  // Lọc bỏ các tính năng đã có ở bottom nav (theo đúng danh sách navItems và extraExcludedPaths)
  const filteredSidebarMenu = useMemo(() => {
    const bottomNavExcluded = getBottomNavExcludedPaths(
      effectiveNavItems,
      effectiveExtraPaths,
    );
    return excludeSidebarPaths(rawSidebarMenu, bottomNavExcluded);
  }, [rawSidebarMenu, effectiveNavItems, effectiveExtraPaths]);

  // BottomSheet modal states
  const [openPersonal, setOpenPersonal] = useState(false);
  const [openFarm, setOpenFarm] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openGuide, setOpenGuide] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);

  // Chỉ giữ tên người dùng và ảnh đại diện ở phần trên; bỏ username số điện thoại dạng @849…
  const displayName = currentUser?.fullName || "Người dùng";
  const logoText = getUserLogoText(displayName);

  const rawFarmName =
    (
      (workspaceData?.metadataJson as Record<string, unknown>)
        ?.farmDisplayName as string
    )?.trim() || workspaceData?.name;

  const farmDisplayName = rawFarmName
    ? formatAppWorkspaceFeatureName(rawFarmName, "farm")
    : formatAppWorkspaceFeatureName("MEVI", "farm");

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Header: Chỉ giữ tên người dùng và ảnh đại diện */}
      <section className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#16B371] to-[#139B62] text-xl font-bold text-white shadow-sm ring-4 ring-emerald-50 select-none">
          {displayName ? (
            logoText
          ) : (
            <UserRound className="h-7 w-7 text-white" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-extrabold text-slate-900 leading-snug">
            {displayName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {farmDisplayName}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Menu thông tin cá nhân & nông trại */}
      <section className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden divide-y divide-slate-100 shadow-xs">
        {/* – Thông tin cá nhân */}
        <ProfileMenuItem
          icon={<UserRound className="h-5 w-5" />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          title="Thông tin cá nhân"
          subtitle={currentUser?.phoneNumber || "Xem thông tin & số điện thoại"}
          onClick={() => setOpenPersonal(true)}
        />

        {/* – Thông tin Farm */}
        <ProfileMenuItem
          icon={<Sprout className="h-5 w-5" />}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          title="Thông tin Farm"
          subtitle={farmDisplayName}
          onClick={() => setOpenFarm(true)}
        />
      </section>

      {/* 3. Các chức năng hệ thống từ Sidebar (đã lọc bỏ mục trong Bottom Nav) */}
      <ProfileSidebarFeatures sections={filteredSidebarMenu} />

      {/* 4. Đăng xuất */}
      <section className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
        <ProfileMenuItem
          icon={<LogOut className="h-5 w-5" />}
          iconBgColor="bg-red-50"
          iconColor="text-red-600"
          title="Đăng xuất"
          subtitle="Thoát tài khoản khỏi thiết bị"
          isDestructive={true}
          onClick={() => setOpenLogout(true)}
        />
      </section>

      {/* 3. Sub-sheets / Dialogs */}
      <PersonalInfoBottomSheet
        open={openPersonal}
        onOpenChange={setOpenPersonal}
      />

      <FarmInfoBottomSheet open={openFarm} onOpenChange={setOpenFarm} />

      {/* <SettingsBottomSheet open={openSettings} onOpenChange={setOpenSettings} /> */}

      <UserGuideBottomSheet open={openGuide} onOpenChange={setOpenGuide} />

      {/* <SupportContactBottomSheet
        open={openSupport}
        onOpenChange={setOpenSupport}
      /> */}

      <LogoutConfirmDialog
        open={openLogout}
        onOpenChange={setOpenLogout}
        onConfirm={() => {
          setOpenLogout(false);
          void logout();
        }}
      />
    </div>
  );
}
