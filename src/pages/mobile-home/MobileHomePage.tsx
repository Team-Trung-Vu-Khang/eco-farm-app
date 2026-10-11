import { useState } from "react";
import { CompactWeatherWidget } from "./components/CompactWeatherWidget";
import { DailyDiaryActionCard } from "./components/DailyDiaryActionCard";
import { EditFarmNameBottomSheet } from "./components/EditFarmNameBottomSheet";
import { HeroWorkspaceSection } from "./components/HeroWorkspaceSection";
import { RecentDiaryList } from "./components/RecentDiaryList";
import { WorkspacePickerBottomSheet } from "./components/WorkspacePickerBottomSheet";

/**
 * Trang chủ giao diện Mobile (MEVI Farm App)
 * Được thiết kế chuyên biệt theo tiêu chuẩn di động ergonomics:
 * - Khối Hero với ảnh nền thiên nhiên tràn xuống bao bọc cả thẻ Farm
 * - Thẻ tóm tắt nông trại 4 chỉ số (diện tích, cây trồng, địa chỉ, số vườn từ totalElements)
 * - Widget thời tiết compact tinh gọn
 * - Nút to bản 1 chạm: Ghi nhật ký thường nhật
 * - Danh sách nhật ký gần đây phân loại màu & icon trực quan
 * - Hỗ trợ Bottom Sheet chọn Workspace (theo role & input search) và đổi tên Nông hộ
 */
export default function MobileHomePage() {
  const [workspacePickerOpen, setWorkspacePickerOpen] = useState(false);
  const [editFarmNameOpen, setEditFarmNameOpen] = useState(false);

  return (
    <div className="space-y-4 pb-6 animate-in fade-in-50 duration-300">
      {/* 1. Hero Workspace Section: Ảnh nền thiên nhiên tràn xuống bao bọc Thẻ Nông Trại */}
      <HeroWorkspaceSection
        onOpenWorkspacePicker={() => setWorkspacePickerOpen(true)}
        onOpenEditName={() => setEditFarmNameOpen(true)}
      />

      {/* 2. Các khối nội dung bên dưới có lề chuẩn px-4 */}
      <div className="space-y-4 px-4">
        {/* Widget Thời tiết hôm nay (Compact) */}
        <CompactWeatherWidget />

        {/* Nút hành động nhanh: Ghi nhật ký thường nhật */}
        <DailyDiaryActionCard />

        {/* Danh sách Nhật ký gần đây */}
        <RecentDiaryList />
      </div>

      {/* Bottom Sheet 1: Chọn Workspace (khi có role quản trị & ô search) */}
      <WorkspacePickerBottomSheet
        open={workspacePickerOpen}
        onOpenChange={setWorkspacePickerOpen}
      />

      {/* Bottom Sheet 2: Đổi tên Nông hộ (cập nhật metadataJson.farmDisplayName) */}
      <EditFarmNameBottomSheet
        open={editFarmNameOpen}
        onOpenChange={setEditFarmNameOpen}
      />
    </div>
  );
}
