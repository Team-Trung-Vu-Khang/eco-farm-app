import { useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { Target } from "lucide-react";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useAquacultureRegionDetail } from "../useAquacultureRegionDetail";

// Subcomponents
import { OverviewTab } from "./detail/OverviewTab";
import { CropsTab } from "./detail/CropsTab";
import { StaffTab } from "./detail/StaffTab";
import { CertificatesTab } from "./detail/CertificatesTab";

type AquacultureRegionDetailViewProps = {
  id?: string;
  basePath?: string;
};

export const AquacultureRegionDetailView = ({
  id,
  basePath = "/aquaculture-region",
}: AquacultureRegionDetailViewProps) => {
  const params = useParams<{ id: string }>();
  const resolvedId = id ?? params?.id;
  const [, setLocation] = useLocation();

  const handleBack = () => setLocation(basePath);

  const { area, details, loading } = useAquacultureRegionDetail(resolvedId);

  const regionIndex = useMemo(() => {
    const regionById = new Map<string, any>();
    const areaById = new Map<string, { area: any; region: any }>();
    const plotById = new Map<string, { plot: any; area: any; region: any }>();

    const region = details.region;
    if (region) {
      regionById.set(String(region.id), region);
      for (const a of region.subAreas || []) {
        areaById.set(String(a.id), { area: a, region });
        for (const p of a.plots || []) {
          plotById.set(String(p.id), { plot: p, area: a, region });
        }
      }
    }

    return { regionById, areaById, plotById };
  }, [details.region]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
        <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">
          Đang tải chi tiết vùng nuôi trồng...
        </span>
      </div>
    );
  }

  if (!area || !details) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Target className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">
          Không tìm thấy vùng nuôi trồng
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
        <TabsTrigger value="crops" className="flex-1 min-w-20 font-bold text-xs">
          Cấu hình
        </TabsTrigger>
        <TabsTrigger value="staff" className="flex-1 min-w-20 font-bold text-xs">
          Nhân viên
        </TabsTrigger>
        <TabsTrigger
          value="certificates"
          className="flex-1 min-w-20 font-bold text-xs"
        >
          Chứng nhận
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <OverviewTab area={area} details={details} regionIndex={regionIndex} />
      </TabsContent>

      <TabsContent value="crops" className="space-y-6">
        <CropsTab details={details} />
      </TabsContent>

      <TabsContent value="staff" className="space-y-6">
        <StaffTab details={details} />
      </TabsContent>

      <TabsContent value="certificates" className="space-y-8">
        <CertificatesTab details={details} />
      </TabsContent>
    </Tabs>
  );
};

