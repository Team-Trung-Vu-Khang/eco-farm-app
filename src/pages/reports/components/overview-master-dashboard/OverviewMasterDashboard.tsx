import React, { useState, useMemo } from "react";
import {
  type TreeNode,
  mockGeneralStats,
} from "../../constants/mockReportData";
import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Map, Grid, Sprout, Beef, Fish } from "lucide-react";
import { GeographicalSidebar } from "./GeographicalSidebar";
import { HealthSection } from "./HealthSection";
import { MaterialSection } from "./MaterialSection";
import { OperationsSection } from "./OperationsSection";
import { PersonnelSection } from "./PersonnelSection";

interface OverviewMasterDashboardProps {
  domainType: "crops" | "livestock" | "aqua";
}

export const OverviewMasterDashboard: React.FC<
  OverviewMasterDashboardProps
> = ({ domainType }) => {
  const [selectedLocation, setSelectedLocation] = useState<TreeNode | null>(
    null,
  );

  const cardLabels = useMemo(() => {
    switch (domainType) {
      case "livestock":
        return {
          card1: "Phân bổ vùng chăn nuôi",
          card3: "Phân bổ chuồng/trại",
          card3Desc: "Khu vực nuôi dưỡng nhỏ nhất",
          card3Icon: Beef,
        };
      case "aqua":
        return {
          card1: "Phân bổ vùng nuôi trồng",
          card3: "Phân bổ ao/lồng",
          card3Desc: "Môi trường nuôi trồng",
          card3Icon: Fish,
        };
      default:
        return {
          card1: "Phân bổ theo vùng trồng",
          card3: "Phân bổ lô",
          card3Desc: "Đơn vị canh tác nhỏ nhất",
          card3Icon: Sprout,
        };
    }
  }, [domainType]);

  const Card3Icon = cardLabels.card3Icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Top Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-100 shadow-xs relative overflow-hidden bg-white rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                {cardLabels.card1}
              </p>
              <p className="text-3xl font-display font-extrabold text-slate-800">
                {mockGeneralStats.regionsCount}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Vùng canh tác trọng điểm
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
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
                {mockGeneralStats.areasCount}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Phân khu chức năng
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <Grid className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-xs relative overflow-hidden bg-white rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                {cardLabels.card3}
              </p>
              <p className="text-3xl font-display font-extrabold text-slate-800">
                {mockGeneralStats.plotsCount}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                {cardLabels.card3Desc}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <Card3Icon className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. 2-column layout (Sidebar & Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Geographical Sidebar (Left Column) */}
        <div className="lg:col-span-3 lg:sticky lg:top-6 shrink-0">
          <GeographicalSidebar
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
          />
        </div>

        {/* Main Dashboard Content (Right Column) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Section 1: Crops/Livestock/Aqua list with internal BarCharts */}
          <HealthSection
            selectedLocation={selectedLocation}
            domainType={domainType}
          />

          {/* Section 2: Material Consumption Grid 2x2 */}
          <MaterialSection selectedLocation={selectedLocation} />

          {/* Section 3: Operations (Plans & Tasks) Tabs Indicator */}
          <OperationsSection selectedLocation={selectedLocation} />

          {/* Section 4: Personnel Headcount Bar Chart */}
          <PersonnelSection selectedLocation={selectedLocation} />
        </div>
      </div>
    </div>
  );
};
