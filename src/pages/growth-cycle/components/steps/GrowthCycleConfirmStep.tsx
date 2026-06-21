import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Calendar,
  ChevronRight,
  Fish,
  Layers,
  Layout,
  Sprout,
} from "lucide-react";
import type { CreateGrowthCycleForm } from "../../types/types";
import type { Variety } from "@/pages/variety/types";
import { CROP_OPTIONS } from "@/constants/crops";

interface GrowthCycleConfirmStepProps {
  formData: CreateGrowthCycleForm;
  varieties: Variety[];
}

export function GrowthCycleConfirmStep({
  formData,
  varieties,
}: GrowthCycleConfirmStepProps) {
  const cropName =
    CROP_OPTIONS.find((crop) => crop.name === formData.cropId)?.name ||
    formData.cropId;
  const varietyName =
    varieties.find((variety) => variety.id === formData.variety)?.varietyName ||
    formData.variety;
  const isPlant = (formData.cycleType ?? "plant") === "plant";

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex items-center gap-2 text-primary">
        <Layout className="w-5 h-5" />
        <h3 className="font-bold text-lg">Xác nhận chu kỳ sinh trưởng</h3>
      </div>

      <Card className="border-none shadow-none bg-muted/30">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">Nhóm chu kỳ:</span>
            <Badge variant={isPlant ? "default" : "secondary"}>
              {isPlant ? (
                <span className="flex items-center gap-2">
                  <Sprout className="w-3.5 h-3.5" />
                  Thực vật
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Fish className="w-3.5 h-3.5" />
                  Vật nuôi / Thủy sản
                </span>
              )}
            </Badge>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">Phạm vi:</span>
            <Badge
              variant={formData.scope === "crop" ? "default" : "secondary"}
            >
              {formData.scope === "crop" ? "Theo loại cây" : "Theo giống"}
            </Badge>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">
              {isPlant ? "Loại cây trồng:" : "Đối tượng nuôi:"}
            </span>
            <span className="font-bold">{cropName}</span>
          </div>
          {formData.scope === "variety" && (
            <div className="flex justify-between items-center py-2 border-b border-muted">
              <span className="text-sm text-muted-foreground">
                {isPlant ? "Giống cây trồng:" : "Giống / dòng:"}
              </span>
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-green-600" />
                <span className="font-bold">{varietyName}</span>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">
              Tổng thời gian:
            </span>
            <Badge className="bg-blue-50 text-blue-700 border-blue-100 font-bold">
              {formData.totalDays} NGÀY
            </Badge>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">Số giai đoạn:</span>
            <span className="font-bold">
              {formData.stages.length} giai đoạn
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Layers className="w-3 h-3" />
          Chi tiết các giai đoạn
        </span>
        <div className="space-y-2">
          {formData.stages.map((stage, index) => (
            <div
              key={stage.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white border shadow-sm group hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-sm">Giai đoạn {index + 1}</p>
                  <p className="text-xs text-muted-foreground">{stage.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-[10px] font-bold">
                  {stage.duration} NGÀY
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
