/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Badge,
  Card,
  cn,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  Beaker,
  CheckCircle2,
  Layers,
  MapPin,
  Sprout,
  Target,
  User,
} from "lucide-react";
import { type PlantEntry } from "./types";

interface Step3ConfirmationProps {
  plants: PlantEntry[];
  initialData: any;
  selectedCultivationRegion: any;
  geographicalUnits: any[];
  manager: any[];
  farmingMethod: any;
  irrigationMethod: any;
  selectedCropsData: any[];
}

export const Step3Confirmation: React.FC<Step3ConfirmationProps> = ({
  plants,
  initialData,
  selectedCultivationRegion,
  geographicalUnits,
  manager,
  farmingMethod,
  irrigationMethod,
  selectedCropsData,
}) => {
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
          Sắp {initialData ? "cập nhật thông tin" : "lưu"}{" "}
          <span className="font-bold">{plants.length} cá thể</span>{" "}
          {initialData ? "thuộc" : "vào"} vùng{" "}
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

      {/* Overview row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4 text-center shadow-sm col-span-1 sm:col-span-1">
          <div className="text-2xl font-bold text-primary">{plants.length}</div>
          <div className="text-xs text-muted-foreground mt-1">cá thể</div>
        </div>
        <div className="bg-white col-span-1 sm:col-span-3 border rounded-xl p-4 text-center shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-left font-bold text-slate-900 truncate">
                {selectedCultivationRegion?.name}
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                <span className="truncate font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  Mã vùng: {selectedCultivationRegion?.code || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedCultivationRegion && (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
            <Beaker className="w-4 h-4 text-slate-500" />
            <h4 className="font-semibold text-slate-800">
              Thông tin vùng chăn nuôi
            </h4>
          </div>
          <div className="p-6 space-y-5 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 rounded-xl border bg-slate-50/50">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary shrink-0 border border-slate-100">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-slate-500 font-medium leading-none mb-1">
                    Nhân sự phụ trách
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {manager && manager.length > 0 ? (
                      manager.map((m: any) => (
                        <Badge
                          key={m.id}
                          variant="outline"
                          className="text-[10px] py-0 px-1.5 h-4 bg-white font-medium border-slate-200"
                        >
                          {m.fullName}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm font-semibold text-slate-900 truncate">
                        Chưa phân công
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl border bg-slate-50/50">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                  <Beaker className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 font-medium leading-none mb-1">
                    Phương pháp chăn nuôi
                  </div>
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {farmingMethod?.name || "Chưa thiết lập"}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {irrigationMethod?.name || ""}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <Sprout className="w-3 h-3 text-green-500" />
                Giống vật nuôi
              </div>
              {selectedCropsData.length > 0 ? (
                <div className="border rounded-xl overflow-hidden bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="w-[80px]">Hình ảnh</TableHead>
                        <TableHead>Mã giống</TableHead>
                        <TableHead>Tên giống</TableHead>
                        <TableHead>Tên vật nuôi</TableHead>
                        <TableHead className="text-right">
                          Tỷ lệ nảy mầm
                        </TableHead>
                        <TableHead className="text-right">
                          Độ đồng đều
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCropsData.map((c: any) => {
                        const varietyCode = c.cropVarietyCode || c.varietyCode;
                        const varietyName = c.cropVarietyName || c.varietyName;
                        const cropName = c.cropName || "—";
                        return (
                          <TableRow key={c.id} className="hover:bg-slate-50/30">
                            <TableCell>
                              <div className="w-10 h-10 rounded-lg bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center shrink-0">
                                {c.illustration ? (
                                  <img
                                    src={
                                      typeof c.illustration === "string"
                                        ? c.illustration
                                        : URL.createObjectURL(c.illustration)
                                    }
                                    alt={varietyName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Sprout className="w-4 h-4 text-slate-300" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {varietyCode ? (
                                <span className="font-mono text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                                  {varietyCode}
                                </span>
                              ) : (
                                "—"
                              )}
                            </TableCell>
                            <TableCell className="font-semibold text-slate-800">
                              {varietyName || "—"}
                            </TableCell>
                            <TableCell className="text-slate-600 text-xs">
                              {cropName}
                            </TableCell>
                            <TableCell className="text-right">
                              {c.germinationRate !== undefined &&
                              c.germinationRate !== null ? (
                                <Badge
                                  variant="outline"
                                  className="border-green-100 text-green-600 bg-green-50/50 text-[10px]"
                                >
                                  {c.germinationRate}%
                                </Badge>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {c.uniformity !== undefined &&
                              c.uniformity !== null ? (
                                <Badge
                                  variant="outline"
                                  className="border-blue-100 text-blue-600 bg-blue-50/50 text-[10px]"
                                >
                                  {c.uniformity}%
                                </Badge>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-5 text-center text-muted-foreground italic border-2 border-dashed rounded-2xl bg-slate-50/30 text-sm">
                  Chưa có thông tin giống vật nuôi cho vùng này
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Plant list table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
          <Sprout className="w-4 h-4 text-slate-500" />
          <h4 className="font-semibold text-slate-800">Danh sách cá thể</h4>
        </div>
        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b">
                <TableHead className="w-[50px] text-center font-bold text-[10px] uppercase tracking-wider">
                  #
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-wider">
                  Vị trí (Lô/Khu vực)
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-wider">
                  Ngày nhận nuôi
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-wider text-right">
                  Cao (m)
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-wider text-center">
                  Tuổi
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-wider">
                  Ghi chú
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plants.map((p, idx) => {
                const unit = geographicalUnits.find((u) => u.id === p.plotId);
                return (
                  <TableRow
                    key={p.entryId}
                    className="hover:bg-slate-50/30 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <TableCell className="text-center font-medium text-slate-400 text-xs">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      {unit ? (
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-6 h-6 rounded flex items-center justify-center shrink-0",
                              unit.level === 3
                                ? "bg-blue-50 text-blue-600"
                                : unit.level === 2
                                  ? "bg-purple-50 text-purple-600"
                                  : "bg-green-50 text-green-600",
                            )}
                          >
                            {unit.level === 3 ? (
                              <MapPin className="w-3 h-3" />
                            ) : unit.level === 2 ? (
                              <Layers className="w-3 h-3" />
                            ) : (
                              <Target className="w-3 h-3" />
                            )}
                          </div>
                          <span className="text-sm font-semibold text-slate-700">
                            {unit.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-red-400 italic text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Chưa chọn
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600 text-xs">
                      {p.plantedDate
                        ? new Date(p.plantedDate).toLocaleDateString("vi-VN")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-700">
                      {p.height || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-600 text-[10px] py-0 px-2 border-none"
                      >
                        {p.ageValue
                          ? `${p.ageValue} ${p.ageUnit === "years" ? "năm" : p.ageUnit === "months" ? "tháng" : "ngày"}`
                          : "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate text-slate-500 text-xs italic">
                      {p.note || "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
