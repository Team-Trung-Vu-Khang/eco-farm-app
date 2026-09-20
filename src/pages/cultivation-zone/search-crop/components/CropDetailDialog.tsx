import {
  Dialog,
  DialogContent,
  DialogTitle,
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
  FlaskConical,
  Sprout,
  Stethoscope,
} from "lucide-react";
import { useMemo } from "react";
import { CropIdentity } from "@/pages/crop/components/tabs/CropIdentity";
import { CropStatusTab } from "@/pages/crop/components/tabs/CropStatusTab";
import { DiseaseHistoryTab } from "@/pages/crop/components/tabs/DiseaseHistoryTab";
import { FarmingHistoryTab } from "@/pages/crop/components/tabs/FarmingHistoryTab";
import { HarvestHistoryTab } from "@/pages/crop/components/tabs/HarvestHistoryTab";
import { IoTInfoTab } from "@/pages/crop/components/tabs/IoTInfoTab";
import { SeedInfoTab } from "@/pages/crop/components/tabs/SeedInfoTab";
import { TechnicalSpecsTab } from "@/pages/crop/components/tabs/TechnicalSpecsTab";
import type { Crop } from "@/pages/crop/types/types";
import {
  generateDiseaseHistory,
  generateFarmingHistory,
  generateHarvestHistory,
  generateIoTData,
  generateSeedInfo,
} from "@/pages/crop/utils/mockGenerators";
import useCropStore from "@/stores/useCropStore";
import type { CropDetail } from "../../constants";

interface CropDetailDialogProps {
  crop: CropDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function mapCropDetailToCrop(cropDetail: CropDetail | null): Crop | null {
  if (!cropDetail) return null;

  const storeCrops = useCropStore.getState().crops;
  const match = storeCrops.find(
    (c) =>
      c.code === cropDetail.code ||
      String(c.id) === String(cropDetail.id) ||
      c.name.toLowerCase() === cropDetail.name.toLowerCase(),
  );

  if (match) {
    return {
      ...match,
      name: cropDetail.name || match.name,
      code: cropDetail.code || match.code,
      illustration: cropDetail.image || match.illustration,
      cropGroup: cropDetail.groupCropName || match.cropGroup,
      cropType: cropDetail.variety || match.cropType,
      seedInfo: match.seedInfo || generateSeedInfo(),
      statusInfo: {
        area: cropDetail.regionName || match.statusInfo?.area || "Khu vực A",
        location:
          cropDetail.areaName || match.statusInfo?.location || "Phân khu 1",
        lote: cropDetail.plotName || match.statusInfo?.lote || "Lô 05",
        owner: match.statusInfo?.owner || "Nông trại Eco Farm",
        plantDate: cropDetail.plantedDate
          ? new Date(cropDetail.plantedDate).toLocaleDateString("vi-VN")
          : match.statusInfo?.plantDate || "15/01/2024",
        age: `${cropDetail.actualAge || 1} tháng`,
        status:
          cropDetail.status === "healthy"
            ? "Tốt, sinh trưởng ổn định"
            : cropDetail.status === "diseased"
              ? "Bệnh"
              : "Bình thường",
        responsiblePerson: match.statusInfo?.responsiblePerson || {
          executor: "Lê Văn An",
          manager: "Trần Thế Bằng",
          inspector: "Nguyễn Văn Cường",
        },
      },
      farmingHistory: match.farmingHistory || generateFarmingHistory(),
      diseaseHistory: match.diseaseHistory || generateDiseaseHistory(),
      harvestHistory: match.harvestHistory || generateHarvestHistory(),
      iotData: match.iotData || generateIoTData(),
      technicalSpecs: match.technicalSpecs || {
        scientificName: cropDetail.name,
        family: cropDetail.groupCropName || "Cây trồng",
        origin: "Việt Nam",
        tempRange: "24 - 30°C",
        humidityRange: "75 - 85%",
        phRange: "5.5 - 6.5",
        plantingDensity: "8m x 8m",
        watering: "Tưới tự động",
      },
    };
  }

  return {
    id: Number(cropDetail.id) || 1,
    code: cropDetail.code,
    illustration: cropDetail.image,
    name: cropDetail.name,
    cropGroup: cropDetail.groupCropName || "Cây ăn trái",
    cropType: cropDetail.variety || "Giống địa phương",
    harvestMethod: "manual",
    seedInfo: {
      supplier: cropDetail.seedType || "Công ty Giống cây trồng Miền Tây",
      importDate: cropDetail.plantedDate
        ? new Date(cropDetail.plantedDate).toLocaleDateString("vi-VN")
        : "20/12/2023",
      importLink: "#",
      contractId: `HD-${cropDetail.code}`,
      documents: [
        { name: "Chứng nhận nguồn gốc.pdf", url: "#" },
        { name: "Hướng dẫn kỹ thuật.pdf", url: "#" },
      ],
    },
    statusInfo: {
      area: cropDetail.regionName || "Khu vực A",
      location: cropDetail.areaName || "Phân khu 1",
      lote: cropDetail.plotName || "Lô 05",
      owner: "Nông trại Eco Farm",
      plantDate: cropDetail.plantedDate
        ? new Date(cropDetail.plantedDate).toLocaleDateString("vi-VN")
        : "15/01/2024",
      age: `${cropDetail.actualAge || 1} tháng`,
      status:
        cropDetail.status === "healthy"
          ? "Tốt, sinh trưởng ổn định"
          : cropDetail.status === "diseased"
            ? "Bệnh"
            : "Bình thường",
      responsiblePerson: {
        executor: "Lê Văn An",
        manager: "Trần Thế Bằng",
        inspector: "Nguyễn Văn Cường",
      },
    },
    farmingHistory: generateFarmingHistory(),
    diseaseHistory: generateDiseaseHistory(),
    harvestHistory: generateHarvestHistory(),
    iotData: generateIoTData(),
    technicalSpecs: {
      scientificName: cropDetail.name,
      family: cropDetail.groupCropName || "Cây trồng",
      origin: "Việt Nam",
      tempRange: "24 - 30°C",
      humidityRange: "75 - 85%",
      phRange: "5.5 - 6.5",
      plantingDensity: "8m x 8m",
      watering: "Tưới tự động",
    },
  };
}

export const CropDetailDialog = ({
  crop,
  open,
  onOpenChange,
}: CropDetailDialogProps) => {
  const mappedCrop = useMemo(() => mapCropDetailToCrop(crop), [crop]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] p-0 overflow-hidden border-none shadow-2xl rounded-3xl z-50">
        <div className="h-full overflow-y-auto p-6 flex flex-col bg-slate-50/50">
          <div className="flex items-center justify-between mb-4 shrink-0 pb-4 border-b border-slate-200/80">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg bg-emerald-500">
                <Sprout size={24} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-800">
                  Hồ sơ cây trồng: {crop?.name}
                </DialogTitle>
                {crop && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Mã hiệu:{" "}
                    <span className="font-bold text-slate-700">
                      {crop.code}
                    </span>{" "}
                    · Vùng:{" "}
                    <span className="font-bold text-slate-700">
                      {crop.regionName}
                    </span>{" "}
                    ({crop.plotName})
                  </p>
                )}
              </div>
            </div>
          </div>

          {mappedCrop ? (
            <div className="flex-1 space-y-6 pt-2">
              <CropIdentity crop={mappedCrop} />

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
                  <SeedInfoTab crop={mappedCrop} />
                </TabsContent>
                <TabsContent value="crop-info">
                  <CropStatusTab crop={mappedCrop} />
                </TabsContent>
                <TabsContent value="technical-info">
                  <TechnicalSpecsTab crop={mappedCrop} />
                </TabsContent>
                <TabsContent value="farming-history">
                  <FarmingHistoryTab crop={mappedCrop} />
                </TabsContent>
                <TabsContent value="disease-history">
                  <DiseaseHistoryTab crop={mappedCrop} />
                </TabsContent>
                <TabsContent value="harvest-history">
                  <HarvestHistoryTab crop={mappedCrop} />
                </TabsContent>
                <TabsContent value="iot-info">
                  <IoTInfoTab crop={mappedCrop} />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 font-medium">
              Không tìm thấy thông tin chi tiết cây trồng.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
