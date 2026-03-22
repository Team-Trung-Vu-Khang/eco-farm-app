import {
  AdminLayout,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Activity,
  ClipboardList,
  Clock,
  Cpu,
  Edit,
  FlaskConical,
  Leaf,
  Sprout,
  Stethoscope,
} from "lucide-react";
import { Link } from "wouter";
import { useCropDetail } from "./hooks/useCropDetail";
import { CropIdentity } from "./components/tabs/CropIdentity";
import { SeedInfoTab } from "./components/tabs/SeedInfoTab";
import { CropStatusTab } from "./components/tabs/CropStatusTab";
import { TechnicalSpecsTab } from "./components/tabs/TechnicalSpecsTab";
import { FarmingHistoryTab } from "./components/tabs/FarmingHistoryTab";
import { DiseaseHistoryTab } from "./components/tabs/DiseaseHistoryTab";
import { HarvestHistoryTab } from "./components/tabs/HarvestHistoryTab";
import { IoTInfoTab } from "./components/tabs/IoTInfoTab";

export default function CropDetailPage() {
  const { crop } = useCropDetail();

  if (!crop) {
    return (
      <AdminLayout
        title="Chi tiết cây trồng"
        description="Thông tin chi tiết về cây trồng"
      >
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <Leaf className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">
            Không tìm thấy thông tin cây trồng này.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Chi tiết cây trồng"
      description={`Quản lý và theo dõi thông tin chi tiết về ${crop.name}`}
      actions={
        <Link href={`/crop/${crop.id}/edit`}>
          <Button className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/10 active:scale-95 transition-all">
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa thông tin
          </Button>
        </Link>
      }
    >
      <div className="space-y-8 pb-8">
        <CropIdentity crop={crop} />

        <Tabs defaultValue="seed-info" className="w-full">
          <TabsList className="bg-slate-100/50 p-1 border border-slate-200 rounded-xl mb-6 flex overflow-x-auto h-auto max-w-full no-scrollbar">
            <TabsTrigger
              value="seed-info"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <Sprout className="w-4 h-4" />
              Thông tin giống
            </TabsTrigger>
            <TabsTrigger
              value="crop-info"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <Activity className="w-4 h-4" />
              Thông tin cây
            </TabsTrigger>
            <TabsTrigger
              value="technical-info"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <FlaskConical className="w-4 h-4" />
              Thông số KT
            </TabsTrigger>
            <TabsTrigger
              value="farming-history"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <ClipboardList className="w-4 h-4" />
              Lịch sử canh tác
            </TabsTrigger>
            <TabsTrigger
              value="disease-history"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <Stethoscope className="w-4 h-4" />
              Lịch sử bệnh
            </TabsTrigger>
            <TabsTrigger
              value="harvest-history"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <Clock className="w-4 h-4" />
              Lịch sử thu hoạch
            </TabsTrigger>
            <TabsTrigger
              value="iot-info"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <Cpu className="w-4 h-4" />
              IoT liên quan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seed-info">
            <SeedInfoTab crop={crop} />
          </TabsContent>
          <TabsContent value="crop-info">
            <CropStatusTab crop={crop} />
          </TabsContent>
          <TabsContent value="technical-info">
            <TechnicalSpecsTab crop={crop} />
          </TabsContent>
          <TabsContent value="farming-history">
            <FarmingHistoryTab crop={crop} />
          </TabsContent>
          <TabsContent value="disease-history">
            <DiseaseHistoryTab crop={crop} />
          </TabsContent>
          <TabsContent value="harvest-history">
            <HarvestHistoryTab crop={crop} />
          </TabsContent>
          <TabsContent value="iot-info">
            <IoTInfoTab crop={crop} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
