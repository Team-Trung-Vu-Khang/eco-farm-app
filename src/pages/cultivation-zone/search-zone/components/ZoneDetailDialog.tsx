import {
  Badge,
  Dialog,
  DialogContent,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Award,
  BarChart3,
  CheckCircle,
  ClipboardList,
  Info,
  Layers,
  Sprout,
  Users,
} from "lucide-react";
import { CultivationRegionCertificatesTab } from "../../cultivation-region/components/detail-body/CultivationRegionCertificatesTab";
import { CultivationRegionCropsTab } from "../../cultivation-region/components/detail-body/CultivationRegionCropsTab";
import { CultivationRegionOverviewTab } from "../../cultivation-region/components/detail-body/CultivationRegionOverviewTab";
import { CultivationRegionPlaceholderTab } from "../../cultivation-region/components/detail-body/CultivationRegionPlaceholderTab";
import { CultivationRegionStaffTab } from "../../cultivation-region/components/detail-body/CultivationRegionStaffTab";
import { CultivationRegionStatisticsTab } from "../../cultivation-region/components/detail-body/CultivationRegionStatisticsTab";
import type { CultivationRegionDetails } from "../../cultivation-region/useCultivationRegionDetail";
import type { CultivationRegion } from "@/stores/useCultivationRegionStore";

type ZoneDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Zone shaped for the shared cultivation-region tabs. */
  area: CultivationRegion | null;
  details: CultivationRegionDetails | null;
  /** Zone code shown in the header subtitle. */
  code?: string;
  /** Owning unit name shown in the header subtitle. */
  workspaceName?: string;
};

const TAB_TRIGGER_CLASS =
  "rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary";

export const ZoneDetailDialog = ({
  open,
  onOpenChange,
  area,
  details,
  code,
  workspaceName,
}: ZoneDetailDialogProps) => {
  const primaryManager = details?.managers?.[0] ?? null;
  const isActive = area?.status === "active";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-50 h-[92vh] w-[96vw] max-w-[96vw] overflow-hidden rounded-3xl border-none p-0 shadow-2xl">
        <div className="flex h-full flex-col overflow-y-auto bg-slate-50/50 p-6">
          {/* Header — mirrors the crop profile dialog */}
          <div className="mb-4 flex shrink-0 items-center justify-between border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg">
                <Layers size={24} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-800">
                  Hồ sơ vùng trồng: {area?.name}
                </DialogTitle>
                {area && (
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    {code && (
                      <>
                        Mã hiệu:{" "}
                        <span className="font-bold text-slate-700">{code}</span>
                      </>
                    )}
                    {code && workspaceName && " · "}
                    {workspaceName && (
                      <>
                        Đơn vị sở hữu:{" "}
                        <span className="font-bold text-slate-700">
                          {workspaceName}
                        </span>
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>

            <Badge
              variant={isActive ? "default" : "secondary"}
              className="mr-8 px-3 py-1"
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              {isActive ? "Đang hoạt động" : "Tạm ngưng"}
            </Badge>
          </div>

          {area && details ? (
            <div className="flex-1 space-y-6 pt-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="no-scrollbar mb-6 flex h-auto max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-slate-100/50 p-1">
                  <TabsTrigger value="overview" className={TAB_TRIGGER_CLASS}>
                    <Info className="h-4 w-4" />
                    Thông tin
                  </TabsTrigger>
                  <TabsTrigger value="crops" className={TAB_TRIGGER_CLASS}>
                    <Sprout className="h-4 w-4" />
                    Cây trồng
                  </TabsTrigger>
                  <TabsTrigger value="staff" className={TAB_TRIGGER_CLASS}>
                    <Users className="h-4 w-4" />
                    Nhân viên
                  </TabsTrigger>
                  <TabsTrigger
                    value="certificates"
                    className={TAB_TRIGGER_CLASS}
                  >
                    <Award className="h-4 w-4" />
                    Chứng nhận
                  </TabsTrigger>
                  <TabsTrigger value="plans" className={TAB_TRIGGER_CLASS}>
                    <ClipboardList className="h-4 w-4" />
                    Kế hoạch
                  </TabsTrigger>
                  <TabsTrigger value="statistics" className={TAB_TRIGGER_CLASS}>
                    <BarChart3 className="h-4 w-4" />
                    Thống kê
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <CultivationRegionOverviewTab
                    area={area}
                    details={details}
                    primaryManager={primaryManager}
                  />
                </TabsContent>

                <TabsContent value="crops" className="space-y-6">
                  <CultivationRegionCropsTab
                    area={area}
                    details={details}
                    primaryManager={primaryManager}
                  />
                </TabsContent>

                <TabsContent value="staff" className="space-y-6">
                  <CultivationRegionStaffTab
                    area={area}
                    details={details}
                    primaryManager={primaryManager}
                  />
                </TabsContent>

                <TabsContent value="certificates" className="space-y-6">
                  <CultivationRegionCertificatesTab
                    area={area}
                    details={details}
                    primaryManager={primaryManager}
                  />
                </TabsContent>

                <TabsContent value="plans" className="space-y-6">
                  <CultivationRegionPlaceholderTab
                    title="Kế hoạch canh tác"
                    description="Chưa có kế hoạch."
                    icon={ClipboardList}
                  />
                </TabsContent>

                <TabsContent value="statistics" className="space-y-6">
                  <CultivationRegionStatisticsTab
                    area={area}
                    details={details}
                    primaryManager={primaryManager}
                  />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 font-medium text-slate-400">
              Không tìm thấy thông tin chi tiết vùng trồng.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
