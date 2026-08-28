import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Ruler, Sprout, User } from "lucide-react";
import type { Plant } from "../../../../region-chart/constants";

type Props = {
  plant: Plant;
  cultivationRegion?: {
    id: number;
    name?: string;
  } | null;
  manager?: {
    id: number;
    fullName?: string;
  } | null;
  farmingMethod?: { name?: string } | null;
  irrigationMethod?: { name?: string } | null;
};

export const PlantIdentificationSidebar = ({
  plant,
  cultivationRegion,
  manager,
  farmingMethod,
  irrigationMethod,
}: Props) => {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b py-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            Thông số nuôi trồng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            <div className="p-4 flex justify-between items-center group hover:bg-slate-50 transition-colors">
              <span className="text-sm text-slate-500 flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Chỉ số mẫu
              </span>
              <span className="font-bold text-slate-900">{plant.height}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {cultivationRegion && (
        <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="border-b py-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Đơn vị quản lý & Kỹ thuật
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              <div className="p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Người quản lý
                </span>
                <span className="font-semibold text-slate-900">
                  {manager?.fullName || "Chưa phân công"}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Phương pháp nuôi trồng
                </span>
                <span className="font-semibold text-slate-900">
                  {farmingMethod?.name || "N/A"}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Hệ thống cấp thoát nước
                </span>
                <span className="font-semibold text-slate-900">
                  {irrigationMethod?.name || "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
