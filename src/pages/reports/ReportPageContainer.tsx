import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import PageWrapper from "@/components/PageWrapper";
import { ReportHeaderActions } from "./components/ReportHeaderActions";
import { Skeleton } from "@Team-Trung-Vu-Khang/eco-shared-ui";

// Reuse existing blocks for Crops
import { FarmingScaleBlock } from "./components/FarmingScaleBlock";
import { FarmingHistoryBlock } from "./components/FarmingHistoryBlock";
import { MaterialConsumptionBlock } from "./components/MaterialConsumptionBlock";

// Reusable modules for Livestock and Aqua (and new modules)
import { OverviewReport } from "./modules/OverviewReport";
import { PlanWorkReport } from "./modules/PlanWorkReport";
import { HarvestReport } from "./modules/HarvestReport";
import { MaterialConsumptionReport } from "./modules/MaterialConsumptionReport";
import { InventoryReport } from "./modules/InventoryReport";

export const ReportPageContainer: React.FC = () => {
  const params = useParams<{ domain: string; module: string }>();
  const [, setLocation] = useLocation();

  const domain = params.domain as "crops" | "livestock" | "aqua";
  const module = params.module;

  const [isLoading, setIsLoading] = useState(true);

  // Auto-redirect if route params are invalid
  useEffect(() => {
    const validDomains = ["crops", "livestock", "aqua"];
    const validModules = [
      "overview",
      "plan-work",
      "harvest",
      "materials",
      "inventory",
    ];

    if (!validDomains.includes(domain) || !validModules.includes(module)) {
      setLocation("/reports/crops/overview", { replace: true });
    }
  }, [domain, module, setLocation]);

  // Simulate loading state on route change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 850); // Premium skeleton animation time

    return () => clearTimeout(timer);
  }, [domain, module]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Get Vietnamese metadata for PageWrapper
  const getPageMetadata = () => {
    const domainLabels: Record<string, string> = {
      crops: "Canh tác trồng trọt",
      livestock: "Canh tác chăn nuôi",
      aqua: "Canh tác nuôi trồng thủy sản",
    };

    const moduleLabels: Record<string, { title: string; desc: string }> = {
      overview: {
        title: "Tổng quan",
        desc: "Báo cáo tổng hợp quy mô canh tác, diện tích và phân bổ sức khỏe cây trồng/vật nuôi",
      },
      "plan-work": {
        title: "Kế hoạch - công việc",
        desc: "Báo cáo tiến độ kế hoạch sản xuất và công việc thực tế quá hạn/sắp đến hạn",
      },
      harvest: {
        title: "Thu hoạch",
        desc: "Báo cáo sản lượng thu hoạch định kỳ và chỉ số năng suất nuôi trồng",
      },
      materials: {
        title: "Vật tư",
        desc: "Giám sát lượng vật tư phân bón, thức ăn, thuốc bảo vệ thực vật/thuốc thú y đã sử dụng",
      },
      inventory: {
        title: "Tồn kho",
        desc: "Báo cáo tổng hợp giá trị và chi tiết tình trạng Nhập - Xuất - Tồn kho vật tư",
      },
    };

    // const dLabel = domainLabels[domain] || domain;
    const mMeta = moduleLabels[module] || { title: module, desc: "" };

    return {
      title: `${mMeta.title}`,
      description: mMeta.desc,
    };
  };

  const meta = getPageMetadata();

  // Render tab-specific Skeleton loaders
  const renderSkeleton = () => {
    switch (module) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-28 w-full rounded-xl bg-slate-100 animate-pulse" />
              <Skeleton className="h-28 w-full rounded-xl bg-slate-100 animate-pulse" />
              <Skeleton className="h-28 w-full rounded-xl bg-slate-100 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <Skeleton className="h-80 w-full rounded-xl bg-slate-100 animate-pulse" />
              </div>
              <div className="lg:col-span-4">
                <Skeleton className="h-80 w-full rounded-xl bg-slate-100 animate-pulse" />
              </div>
            </div>
          </div>
        );
      case "plan-work":
        return (
          <div className="space-y-6">
            <Skeleton className="h-16 w-full rounded-xl bg-slate-100 animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-96 w-full rounded-xl bg-slate-100 animate-pulse" />
              <Skeleton className="h-96 w-full rounded-xl bg-slate-100 animate-pulse" />
            </div>
          </div>
        );
      case "harvest":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-80 w-full rounded-xl bg-slate-100 animate-pulse" />
              <Skeleton className="h-80 w-full rounded-xl bg-slate-100 animate-pulse" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl bg-slate-100 animate-pulse" />
          </div>
        );
      case "materials":
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-3">
              <Skeleton className="h-[450px] w-full rounded-xl bg-slate-100 animate-pulse" />
            </div>
            <div className="col-span-12 lg:col-span-9">
              <Skeleton className="h-[450px] w-full rounded-xl bg-slate-100 animate-pulse" />
            </div>
          </div>
        );
      case "inventory":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full rounded-xl bg-slate-100 animate-pulse" />
              <Skeleton className="h-24 w-full rounded-xl bg-slate-100 animate-pulse" />
              <Skeleton className="h-24 w-full rounded-xl bg-slate-100 animate-pulse" />
            </div>
            <Skeleton className="h-96 w-full rounded-xl bg-slate-100 animate-pulse" />
          </div>
        );
      default:
        return (
          <Skeleton className="h-96 w-full rounded-xl bg-slate-100 animate-pulse" />
        );
    }
  };

  const renderActiveModule = () => {
    // If it's crops, reuse the exact original block layouts
    if (domain === "crops") {
      switch (module) {
        case "overview":
          return <FarmingScaleBlock />;
        case "plan-work":
          return <FarmingHistoryBlock />;
        case "materials":
          return <MaterialConsumptionBlock />;
        case "harvest":
          return <HarvestReport domainType="crops" />;
        case "inventory":
          return <InventoryReport domainType="crops" />;
        default:
          return <FarmingScaleBlock />;
      }
    }

    // Otherwise render domain-customized generic report modules
    switch (module) {
      case "overview":
        return <OverviewReport domainType={domain} />;
      case "plan-work":
        return <PlanWorkReport domainType={domain} />;
      case "harvest":
        return <HarvestReport domainType={domain} />;
      case "materials":
        return <MaterialConsumptionReport domainType={domain} />;
      case "inventory":
        return <InventoryReport domainType={domain} />;
      default:
        return <OverviewReport domainType={domain} />;
    }
  };

  return (
    <PageWrapper
      title={meta.title}
      description={meta.description}
      actions={
        <ReportHeaderActions
          onRefresh={handleRefresh}
          isRefreshing={isLoading}
        />
      }
    >
      {isLoading ? renderSkeleton() : renderActiveModule()}
    </PageWrapper>
  );
};
