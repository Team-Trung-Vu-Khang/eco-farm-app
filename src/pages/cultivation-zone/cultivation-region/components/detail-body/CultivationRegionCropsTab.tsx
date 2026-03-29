import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Droplets, Layers, Leaf, Sprout } from "lucide-react";
import type { CultivationRegionDetailBodyCommonProps } from "./types";

export const CultivationRegionCropsTab = ({
  details,
}: CultivationRegionDetailBodyCommonProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sprout className="w-5 h-5 text-primary" />
            Cấu hình cây trồng
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {details.technicalConfig.crops.length === 0 ? (
            <div className="text-sm text-muted-foreground italic">
              Chưa cấu hình cây trồng.
            </div>
          ) : (
            <div className="space-y-4">
              {details.technicalConfig.crops.map((crop) => (
                <div key={crop.id} className="border rounded-lg p-4 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{crop.name}</div>
                      <div className="text-xs text-muted-foreground">{crop.crop}</div>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {crop.id}
                    </Badge>
                  </div>

                  {crop.selectedSeeds?.length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-2">
                        Hạt giống/Cây giống
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {crop.selectedSeeds.map((seed) => (
                          <Badge key={seed?.id} variant="secondary" className="gap-1">
                            <Leaf className="w-3 h-3" />
                            {seed?.name || seed?.id}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Cấu hình theo đơn vị
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {details.entityConfigs.map((config) => (
              <div key={config.entity.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {config.entity.type}
                    </div>
                    <div className="font-bold text-slate-900">
                      {config.entity.name}
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {config.entity.id}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="rounded-lg bg-slate-50 p-3 border">
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Leaf className="w-3.5 h-3.5 text-primary" />
                      Cây trồng
                    </div>
                    <div className="mt-2 text-sm">
                      {config.crops?.length
                        ? config.crops.map((crop) => crop.name).join(", ")
                        : "Chưa thiết lập"}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 border">
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Droplets className="w-3.5 h-3.5 text-primary" />
                      Tưới tiêu
                    </div>
                    <div className="mt-2 text-sm">
                      {config.irrigationMethod?.name || "Chưa thiết lập"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
