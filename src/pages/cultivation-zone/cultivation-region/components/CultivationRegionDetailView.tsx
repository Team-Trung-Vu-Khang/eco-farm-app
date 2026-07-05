import React, { useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { Loader2, Target } from "lucide-react";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCultivationRegionDetail } from "../useCultivationRegionDetail";
import useRegionStore from "../../../../stores/useRegionStore";

// Subcomponents
import { OverviewTab } from "./detail/OverviewTab";
import { CropsTab } from "./detail/CropsTab";
import { StaffTab } from "./detail/StaffTab";
import { CertificatesTab } from "./detail/CertificatesTab";
import { PlansTab } from "./detail/PlansTab";
import { StatisticsTab } from "./detail/StatisticsTab";

export const CultivationRegionDetailView = ({ id }: { id?: string }) => {
  const params = useParams<{ id: string }>();
  const resolvedId = id ?? params?.id;
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation("/cultivation-region");
  };

  const { area, details, loading } = useCultivationRegionDetail(resolvedId);
  const { regions } = useRegionStore();

  // Helper index of region store for geographical coordinates resolution
  const regionIndex = useMemo(() => {
    const regionById = new Map<string, any>();
    const areaById = new Map<string, { area: any; region: any }>();
    const plotById = new Map<string, { plot: any; area: any; region: any }>();

    for (const r of regions) {
      regionById.set(String(r.id), r);
      for (const a of r.subAreas || []) {
        areaById.set(String(a.id), { area: a, region: r });
        for (const p of a.plots || []) {
          plotById.set(String(p.id), { plot: p, area: a, region: r });
        }
      }
    }

    return { regionById, areaById, plotById };
  }, [regions]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">
          Đang tải chi tiết vùng canh tác...
        </span>
      </div>
    );
  }

  if (!area || !details) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Target className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">
          Không tìm thấy vùng canh tác
        </h2>
        <Button
          variant="ghost"
          className="mt-4 animate-bounce"
          onClick={handleBack}
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="overview" className="space-y-6 mt-6">
      <TabsList className="grid w-full grid-cols-6 overflow-x-auto rounded-2xl bg-slate-100/50 p-1">
        <TabsTrigger value="overview" className="font-bold text-xs">
          Thông tin
        </TabsTrigger>
        <TabsTrigger value="crops" className="font-bold text-xs">
          Cây trồng
        </TabsTrigger>
        <TabsTrigger value="staff" className="font-bold text-xs">
          Nhân viên
        </TabsTrigger>
        <TabsTrigger value="certificates" className="font-bold text-xs">
          Chứng nhận
        </TabsTrigger>
        {/* <TabsTrigger value="plans" className="rounded-xl font-bold text-xs">
          Kế hoạch & Công việc
        </TabsTrigger>
        <TabsTrigger
          value="statistics"
          className="rounded-xl font-bold text-xs"
        >
          Thống kê
        </TabsTrigger> */}
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4">
        <OverviewTab area={area} details={details} regionIndex={regionIndex} />
      </TabsContent>

      {/* Crops & Configurations Tab */}
      <TabsContent value="crops" className="space-y-6">
        <CropsTab details={details} />
      </TabsContent>

      {/* Personnel/Staff Tab */}
      <TabsContent value="staff" className="space-y-6">
        <StaffTab details={details} />
      </TabsContent>

      {/* Certificates Tab */}
      <TabsContent value="certificates" className="space-y-8">
        <CertificatesTab details={details} />
      </TabsContent>

      {/* Plans & Tasks Tab */}
      {/* <TabsContent value="plans" className="space-y-6 overflow-hidden">
        <PlansTab
          area={area}
          regionIndex={regionIndex}
          resolvedId={resolvedId ?? ""}
        />
      </TabsContent> */}

      {/* Harvest Statistics Tab */}
      {/* <TabsContent value="statistics" className="space-y-6 overflow-hidden">
        <StatisticsTab details={details} />
      </TabsContent> */}
    </Tabs>
  );
};
