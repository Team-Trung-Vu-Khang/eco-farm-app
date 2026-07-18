import React, { useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { Loader2, Target } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCultivationRegionDetail } from "../useCultivationRegionDetail";
import { useRegions } from "@/features/farm/hooks/useRegions";
import { areaApi, plotApi } from "@/features/farm/api/farm.api";

// Subcomponents
import { OverviewTab } from "./detail/OverviewTab";
import { CropsTab } from "./detail/CropsTab";
import { StaffTab } from "./detail/StaffTab";
import { CertificatesTab } from "./detail/CertificatesTab";

export const CultivationRegionDetailView = ({ id }: { id?: string }) => {
  const params = useParams<{ id: string }>();
  const resolvedId = id ?? params?.id;
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation("/cultivation-region");
  };

  const { area, details, loading } = useCultivationRegionDetail(resolvedId);

  // Fetch regions from API instead of loading from local zustand store
  const { items: regions, isLoading: isRegionsLoading } = useRegions({
    params: { page: 0, size: 100 },
  });

  // Extract unique area IDs selected directly or via selected plots
  const areaIds = useMemo(() => {
    if (!details?.selectedEntities) return [];
    const ids = new Set<number>();
    for (const e of details.selectedEntities) {
      if (e.typeCode === "area" && e.id) ids.add(Number(e.id));
      if (e.typeCode === "plot" && e.areaId) ids.add(Number(e.areaId));
    }
    return Array.from(ids);
  }, [details?.selectedEntities]);

  // Extract unique plot IDs selected directly
  const plotIds = useMemo(() => {
    if (!details?.selectedEntities) return [];
    const ids = new Set<number>();
    for (const e of details.selectedEntities) {
      if (e.typeCode === "plot" && e.id) ids.add(Number(e.id));
    }
    return Array.from(ids);
  }, [details?.selectedEntities]);

  // Fetch detailed area coordinates
  const areaQueries = useQueries({
    queries: areaIds.map((aid) => ({
      queryKey: ["farm", "areas", "detail", aid],
      queryFn: () => areaApi.getById(aid),
      staleTime: 5 * 60 * 1000,
    })),
  });

  // Fetch detailed plot coordinates
  const plotQueries = useQueries({
    queries: plotIds.map((pid) => ({
      queryKey: ["farm", "plots", "detail", pid],
      queryFn: () => plotApi.getById(pid),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isDetailsLoading =
    areaQueries.some((q) => q.isLoading) ||
    plotQueries.some((q) => q.isLoading);

  // Helper index of regions for geographical coordinates resolution
  const regionIndex = useMemo(() => {
    const regionById = new Map<string, any>();
    const areaById = new Map<string, { area: any; region: any }>();
    const plotById = new Map<string, { plot: any; area: any; region: any }>();

    // 1. Populate initial regions & nested nodes from list response
    for (const r of regions) {
      regionById.set(String(r.id), r);
      // Support both API field 'areas' and fallback store key 'subAreas'
      const childAreas = r.areas || (r as any).subAreas || [];
      for (const a of childAreas) {
        areaById.set(String(a.id), { area: a, region: r });
        for (const p of a.plots || []) {
          plotById.set(String(p.id), { plot: p, area: a, region: r });
        }
      }
    }

    // 2. Override/update from fetched area details (which contain boundaries!)
    for (const q of areaQueries) {
      if (q.data) {
        const areaData = q.data;
        const existing = areaById.get(String(areaData.id));
        if (existing) {
          existing.area = { ...existing.area, ...areaData };
        } else {
          const regionId = areaData.region?.id ?? areaData.regionId;
          const reg = regionId ? regionById.get(String(regionId)) : null;
          areaById.set(String(areaData.id), { area: areaData, region: reg });
        }
      }
    }

    // 3. Override/update from fetched plot details (which contain boundaries!)
    for (const q of plotQueries) {
      if (q.data) {
        const plotData = q.data;
        const existing = plotById.get(String(plotData.id));
        if (existing) {
          existing.plot = { ...existing.plot, ...plotData };
        } else {
          const areaId = plotData.area?.id ?? plotData.areaId;
          const areaInfo = areaId ? areaById.get(String(areaId)) : null;
          plotById.set(String(plotData.id), {
            plot: plotData,
            area: areaInfo?.area ?? null,
            region: areaInfo?.region ?? null,
          });
        }
      }
    }

    return { regionById, areaById, plotById };
  }, [regions, areaQueries, plotQueries]);

  if (loading || isRegionsLoading || isDetailsLoading) {
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
      <TabsList className="flex w-full overflow-x-auto rounded-2xl bg-slate-100/50 p-1 gap-1">
        <TabsTrigger
          value="overview"
          className="flex-1 min-w-20 font-bold text-xs"
        >
          Thông tin
        </TabsTrigger>
        <TabsTrigger
          value="crops"
          className="flex-1 min-w-20 font-bold text-xs"
        >
          Cây trồng
        </TabsTrigger>
        <TabsTrigger
          value="staff"
          className="flex-1 min-w-20 font-bold text-xs"
        >
          Nhân viên
        </TabsTrigger>
        <TabsTrigger
          value="certificates"
          className="flex-1 min-w-20 font-bold text-xs"
        >
          Chứng nhận
        </TabsTrigger>
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
