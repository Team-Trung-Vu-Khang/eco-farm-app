/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  Fish,
  Layers,
  MapPin,
  Sprout,
} from "lucide-react";
import { type PlantEntry } from "./types";

interface Step3ConfirmationProps {
  plants: PlantEntry[];
  initialData: any;
  selectedCultivationRegion: {
    name?: string;
    code?: string;
  } | null;
  selectedScopeIds: string[];
  geographicalUnits: Array<{ id: string; name: string }>;
}

export const Step3Confirmation: React.FC<Step3ConfirmationProps> = ({
  plants,
  initialData,
  selectedCultivationRegion,
  selectedScopeIds,
  geographicalUnits,
}) => {
  const selectedScopes = geographicalUnits.filter((unit) =>
    selectedScopeIds.includes(unit.id),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm relative z-10">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 z-10 relative">
          Xác nhận thông tin
        </h3>
        <p className="text-green-700/80 mt-2 z-10 relative max-w-lg mx-auto">
          Sắp {initialData ? "cập nhật" : "lưu"}{" "}
          <span className="font-bold">{plants.length} đối tượng nuôi</span>{" "}
          trong vùng{" "}
          <span className="font-bold">
            {selectedCultivationRegion?.name || "—"}
          </span>
          .
        </p>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-600 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-primary">{plants.length}</div>
          <div className="text-xs text-muted-foreground mt-1">đối tượng nuôi</div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm sm:col-span-2">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-left font-bold text-slate-900 truncate">
                {selectedCultivationRegion?.name || "Chưa chọn vùng nuôi trồng"}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span className="truncate font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  Mã vùng: {selectedCultivationRegion?.code || "—"}
                </span>
                <span className="truncate font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  Phạm vi: {selectedScopes.length} mục
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-500" />
          <h4 className="font-semibold text-slate-800">Phạm vi nuôi trồng</h4>
        </div>
        <div className="p-6 bg-white">
          {selectedScopes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedScopes.map((scope) => (
                <Badge
                  key={scope.id}
                  variant="outline"
                  className="bg-slate-50 text-slate-700 border-slate-200"
                >
                  {scope.name || scope.id}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground italic border-2 border-dashed rounded-2xl bg-slate-50/30 text-sm">
                  Chưa chọn phạm vi nuôi trồng
                </div>
              )}
            </div>
      </Card>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
          <Fish className="w-4 h-4 text-slate-500" />
          <h4 className="font-semibold text-slate-800">
            Danh sách đối tượng nuôi
          </h4>
        </div>
        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b">
                <TableHead className="w-[50px] text-center font-bold text-[10px] uppercase tracking-wider">
                  #
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-wider">
                  Đối tượng nuôi
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-wider">
                  Kích cỡ / chiều dài
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-wider text-center">
                  Độ tuổi
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-wider">
                  Ngày ghi nhận
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-wider">
                  Ghi chú
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plants.map((plant, idx) => (
                <TableRow
                  key={plant.entryId}
                  className="hover:bg-slate-50/30 transition-colors border-b border-slate-100 last:border-0"
                >
                  <TableCell className="text-center font-medium text-slate-400 text-xs">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
                        <Sprout className="w-3 h-3" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        Đối tượng nuôi {idx + 1}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 text-xs">
                    {plant.height || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-600 text-[10px] py-0 px-2 border-none"
                    >
                      {plant.ageValue
                        ? `${plant.ageValue} ${
                            plant.ageUnit === "years"
                              ? "năm"
                              : plant.ageUnit === "months"
                                ? "tháng"
                                : "ngày"
                          }`
                        : "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 text-xs">
                    {plant.plantedDate
                      ? new Date(plant.plantedDate).toLocaleDateString("vi-VN")
                      : "—"}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate text-slate-500 text-xs italic">
                    {plant.note || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
