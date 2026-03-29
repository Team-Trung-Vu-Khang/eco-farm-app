import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText, Target } from "lucide-react";
import type { CultivationRegion } from "../../../stores/useCultivationRegionStore";
import { CultivationRegionCertificatesTab } from "./components/detail-body/CultivationRegionCertificatesTab";
import { CultivationRegionCropsTab } from "./components/detail-body/CultivationRegionCropsTab";
import { CultivationRegionDetailHeader } from "./components/detail-body/CultivationRegionDetailHeader";
import { CultivationRegionOverviewTab } from "./components/detail-body/CultivationRegionOverviewTab";
import { CultivationRegionPlaceholderTab } from "./components/detail-body/CultivationRegionPlaceholderTab";
import { CultivationRegionStaffTab } from "./components/detail-body/CultivationRegionStaffTab";
import type { CultivationRegionDetails } from "./useCultivationRegionDetail";

type Props = {
  area: CultivationRegion;
  details: CultivationRegionDetails;
  onBack: () => void;
  onEdit: () => void;
};

const CultivationRegionDetailBody = ({
  area,
  details,
  onBack,
  onEdit,
}: Props) => {
  const primaryManager = details.managers[0] ?? null;

  return (
    <>
      <CultivationRegionDetailHeader area={area} onBack={onBack} onEdit={onEdit} />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 overflow-x-auto">
          <TabsTrigger value="overview">Thông tin</TabsTrigger>
          <TabsTrigger value="crops">Cây trồng</TabsTrigger>
          <TabsTrigger value="staff">Nhân viên</TabsTrigger>
          <TabsTrigger value="certificates">Chứng nhận</TabsTrigger>
          <TabsTrigger value="plans">Kế hoạch</TabsTrigger>
          <TabsTrigger value="statistics">Thống kê</TabsTrigger>
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
            icon={FileText}
          />
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <CultivationRegionPlaceholderTab
            title="Thống kê"
            description="Đang cập nhật."
            icon={Target}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CultivationRegionDetailBody;
