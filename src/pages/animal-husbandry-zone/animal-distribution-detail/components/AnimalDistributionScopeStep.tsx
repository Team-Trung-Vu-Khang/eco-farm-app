import {
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, Layers, MapPin, Target } from "lucide-react";

import type { AnimalDistributionScope } from "../constants";
import {
  MOCK_AREAS,
  MOCK_PLOTS,
  MOCK_REGIONS,
} from "@/pages/region-chart/constants";

type Props = {
  scope: AnimalDistributionScope;
  selectedRegionId: string;
  selectedAreaIds: string[];
  selectedPlotIds: string[];
  onChangeScope: (scope: AnimalDistributionScope) => void;
  onSelectRegion: (id: string) => void;
  onToggleArea: (id: string) => void;
  onTogglePlot: (id: string) => void;
};

export const AnimalDistributionScopeStep = ({
  scope,
  selectedRegionId,
  selectedAreaIds,
  selectedPlotIds,
  onChangeScope,
  onSelectRegion,
  onToggleArea,
  onTogglePlot,
}: Props) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <div className="text-blue-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="text-sm text-blue-800">
          <div className="font-semibold mb-1">Bước 1: Chọn phạm vi</div>
          <div>
            Xác định phạm vi phân bổ vật nuôi: Vùng chăn nuôi, Khu vực, hoặc Lô đất
            cụ thể.
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold text-slate-800">
          Chọn phạm vi thiết lập
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: "region",
              label: "Theo vùng chăn nuôi",
              icon: MapPin,
              desc: "Thiết lập cho toàn bộ vùng",
            },
            {
              id: "area",
              label: "Theo khu vực",
              icon: Layers,
              desc: "Thiết lập cho các khu vực",
            },
            {
              id: "plot",
              label: "Theo lô đất",
              icon: Target,
              desc: "Thiết lập cho từng lô",
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => onChangeScope(item.id as AnimalDistributionScope)}
              className={`cursor-pointer border-2 rounded-xl p-4 transition-all relative ${
                scope === item.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-slate-100 bg-white hover:border-primary/30 hover:shadow-sm"
              }`}
            >
              {scope === item.id && (
                <div className="absolute top-3 right-3 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${scope === item.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-800">{item.label}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 bg-slate-50 p-4 rounded-xl border">
        <div className="text-sm font-medium text-slate-700">
          Chọn vị trí địa lý
        </div>

        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground">
            Vùng chăn nuôi <span className="text-red-500">*</span>
          </Label>
          <Select value={selectedRegionId} onValueChange={onSelectRegion}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Chọn vùng..." />
            </SelectTrigger>
            <SelectContent>
              {MOCK_REGIONS.map((region) => (
                <SelectItem key={region.id} value={region.id.toString()}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(scope === "area" || scope === "plot") && selectedRegionId && (
          <div className="space-y-2 animate-in slide-in-from-top-2">
            <Label className="text-xs text-muted-foreground">
              Khu vực <span className="text-red-500">*</span>
              {selectedAreaIds.length > 0 && (
                <span className="ml-1 text-primary font-medium">
                  ({selectedAreaIds.length})
                </span>
              )}
            </Label>
            <ScrollArea className="max-h-[200px] border rounded-lg p-2 bg-white">
              <div className="space-y-1">
                {MOCK_AREAS.filter(
                  (area) => area.regionId.toString() === selectedRegionId,
                ).map((area) => (
                  <div
                    key={area.id}
                    onClick={() => onToggleArea(area.id.toString())}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                      selectedAreaIds.includes(area.id.toString())
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm">{area.name}</span>
                    {selectedAreaIds.includes(area.id.toString()) && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {scope === "plot" && selectedAreaIds.length > 0 && (
          <div className="space-y-2 animate-in slide-in-from-top-2">
            <Label className="text-xs text-muted-foreground">
              Trang trại <span className="text-red-500">*</span>
              {selectedPlotIds.length > 0 && (
                <span className="ml-1 text-primary font-medium">
                  ({selectedPlotIds.length})
                </span>
              )}
            </Label>
            <ScrollArea className="max-h-[200px] border rounded-lg p-2 bg-white">
              <div className="space-y-1">
                {MOCK_PLOTS.map((plot) => (
                  <div
                    key={plot.id}
                    onClick={() => onTogglePlot(plot.id)}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                      selectedPlotIds.includes(plot.id)
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm">{plot.name}</span>
                    {selectedPlotIds.includes(plot.id) && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
