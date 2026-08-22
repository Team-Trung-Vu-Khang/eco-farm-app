import React, { useState, useMemo } from "react";
import { type CorporateEntity, EntitySidebar } from "./EntitySidebar";
import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Map, Grid, Sprout } from "lucide-react";
import { AdminHealthSection } from "./AdminHealthSection";
import { AdminMaterialSection } from "./AdminMaterialSection";
import { AdminOperationsSection } from "./AdminOperationsSection";
import { AdminPersonnelSection } from "./AdminPersonnelSection";
import { mockGeneralStats } from "../../constants/mockReportData";

export const OverviewAdminDashboard: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<CorporateEntity | null>(
    null,
  );

  // Calculate top summary card statistics dynamically based on selected corporate entity
  const stats = useMemo(() => {
    if (!selectedEntity) {
      return {
        regions: mockGeneralStats.regionsCount,
        areas: mockGeneralStats.areasCount,
        plots: mockGeneralStats.plotsCount,
      };
    }

    if (selectedEntity.id === "ecofarm") {
      return {
        regions: 2,
        areas: 5,
        plots: 15,
      };
    }

    if (selectedEntity.id === "hoabinh") {
      return {
        regions: 2,
        areas: 7,
        plots: 21,
      };
    }

    return {
      regions: 1,
      areas: 2,
      plots: 5,
    };
  }, [selectedEntity]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Top Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-100 shadow-xs relative overflow-hidden bg-white rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Phân bổ theo vùng trồng
              </p>
              <p className="text-3xl font-display font-extrabold text-slate-800">
                {stats.regions}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Vùng canh tác trọng điểm
              </p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <Map className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-xs relative overflow-hidden bg-white rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Phân bổ khu vực
              </p>
              <p className="text-3xl font-display font-extrabold text-slate-800">
                {stats.areas}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Phân khu chức năng
              </p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <Grid className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-xs relative overflow-hidden bg-white rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Phân bổ lô
              </p>
              <p className="text-3xl font-display font-extrabold text-slate-800">
                {stats.plots}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Đơn vị canh tác nhỏ nhất
              </p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <Sprout className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. 2-column layout (Sidebar & Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Entity Sidebar (Left Column) */}
        <div className="lg:col-span-3 h-auto lg:h-[750px] shrink-0">
          <EntitySidebar
            selectedEntity={selectedEntity}
            onSelectEntity={setSelectedEntity}
          />
        </div>

        {/* Main Dashboard Content (Right Column) */}
        <div className="lg:col-span-9 space-y-6 overflow-y-auto max-h-none lg:max-h-[750px] pr-1 scrollbar-thin">
          <AdminHealthSection selectedEntity={selectedEntity} />
          <AdminMaterialSection selectedEntity={selectedEntity} />
          <AdminOperationsSection selectedEntity={selectedEntity} />
          <AdminPersonnelSection selectedEntity={selectedEntity} />
        </div>
      </div>
    </div>
  );
};

export default OverviewAdminDashboard;
