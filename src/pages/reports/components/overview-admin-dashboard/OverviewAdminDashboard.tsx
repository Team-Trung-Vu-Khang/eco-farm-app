import React, { useState } from "react";
import { AdminDiaryActivitySection } from "./AdminDiaryActivitySection";
import { AdminHealthSection } from "./AdminHealthSection";
import { AdminMaterialSection } from "./AdminMaterialSection";
import { AdminOperationsSection } from "./AdminOperationsSection";
import { AdminPersonnelSection } from "./AdminPersonnelSection";
import { EntitySidebar } from "./EntitySidebar";
import type { WorkspaceRecord } from "@/features/workspace/types/workspace.type";

export const OverviewAdminDashboard: React.FC = () => {
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceRecord | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ─── 1. Màn Nhật ký hoạt động nông nghiệp (Admin - API mới) ─── */}
      <AdminDiaryActivitySection />

      {/* ─── 2. Báo cáo Chi tiết Sức khỏe, Tiêu thụ vật tư & Vận hành theo Đơn vị ─── */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Báo cáo Chuyên sâu theo Đơn vị Canh tác
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Chọn "Tất cả Đơn vị" hoặc một nông hộ / HTX cụ thể ở sidebar để
              xem dữ liệu tương ứng
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4 lg:col-span-3 md:sticky md:top-6 shrink-0 z-20">
            <EntitySidebar
              selectedWorkspace={selectedWorkspace}
              onSelectWorkspace={setSelectedWorkspace}
            />
          </div>

          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <AdminHealthSection selectedWorkspace={selectedWorkspace} />
            <AdminMaterialSection selectedWorkspace={selectedWorkspace} />
            <AdminOperationsSection selectedWorkspace={selectedWorkspace} />
            {/* <AdminPersonnelSection selectedWorkspace={selectedWorkspace} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewAdminDashboard;
