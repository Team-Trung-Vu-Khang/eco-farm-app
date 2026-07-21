import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Trees } from "lucide-react";
import type { Plant } from "../../../../region-chart/constants";

type Props = {
  plant: Plant;
  formattedAge: string;
};

export const PlantIdentificationIdentityCard = ({
  plant,
  formattedAge,
}: Props) => {
  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-32 h-32 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-100 shrink-0">
            <Trees className="w-12 h-12" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 font-mono">
                {plant.code}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Ngày trồng
                </p>
                <p className="text-sm font-semibold">{plant.plantedDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Độ tuổi
                </p>
                <p className="text-sm font-semibold">{formattedAge}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Vị trí GPS
                </p>
                <p className="text-sm font-mono">
                  Kinh độ: {plant.coordinate.lat.toFixed(6)}, Vĩ độ:{" "}
                  {plant.coordinate.lng.toFixed(6)}
                </p>
              </div>
            </div>
            {plant.note && (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Ghi chú
                </p>
                <p className="text-sm text-slate-600 italic">"{plant.note}"</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
