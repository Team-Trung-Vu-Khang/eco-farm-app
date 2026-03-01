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
} from "@tankhang1/eco-shared-ui";
import {
  AlertTriangle,
  Beaker,
  Briefcase,
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
  selectedEnterprise: any;
  selectedCultivationArea: any;
  geographicalUnits: any[];
  manager: any;
  farmingMethod: any;
  irrigationMethod: any;
  selectedCropsData: any[];
}

export const Step3Confirmation: React.FC<Step3ConfirmationProps> = ({
  plants,
  initialData,
  selectedEnterprise,
  selectedCultivationArea,
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
          <span className="font-bold">{plants.length} cây trồng</span>{" "}
          {initialData ? "thuộc" : "vào"} vùng{" "}
          <span className="font-bold">
            {selectedCultivationArea?.name || "—"}
          </span>
          .
        </p>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-600 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Overview row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col col-span-4 gap-4 w-full border rounded-xl p-4 shadow-sm bg-white">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden shadow-sm">
              {selectedEnterprise?.image ? (
                <img
                  src={selectedEnterprise?.image}
                  alt={selectedEnterprise?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Briefcase className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] py-0 h-4 bg-primary/5 text-primary border-primary/20"
                >
                  {selectedEnterprise?.code}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-[10px] py-0 h-4 bg-slate-100 capitalize font-medium"
                >
                  {selectedEnterprise?.type}
                </Badge>
              </div>
              <div className="font-bold text-slate-900 text-base leading-tight mb-1">
                {selectedEnterprise?.name}
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <span className="font-medium text-slate-500">MST:</span>
                <span>{selectedEnterprise?.taxCode}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-3 border-t border-slate-100">
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <div className="bg-slate-100 p-1 rounded-md shrink-0">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="leading-relaxed">
                <span className="font-medium text-slate-800 mr-1">
                  Địa chỉ:
                </span>
                {selectedEnterprise?.address}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-2 text-center shadow-sm">
          <div className="text-2xl font-bold text-primary">{plants.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Số lượng cây trồng
          </div>
        </div>
        <div className="bg-white col-span-3 border rounded-xl p-4 text-center shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-left font-bold text-slate-900 truncate">
                {selectedCultivationArea?.name}
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                <span className="truncate">
                  {selectedCultivationArea?.targetName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedCultivationArea && (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
            <Beaker className="w-4 h-4 text-slate-500" />
            <h4 className="font-semibold text-slate-800">
              Cấu hình kỹ thuật được áp dụng
            </h4>
          </div>
          <div className="p-6 space-y-5 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 rounded-xl border bg-slate-50/50">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 font-medium leading-none mb-1">
                    Quản lý phụ trách
                  </div>
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {manager?.fullName || "Chưa phân công"}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl border bg-slate-50/50">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                  <Beaker className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 font-medium leading-none mb-1">
                    Kỹ thuật canh tác
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
                Giống cây trồng
              </div>
              {selectedCropsData.length > 0 ? (
                <div className="border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="w-[80px]">Hình ảnh</TableHead>
                        <TableHead>Mã giống</TableHead>
                        <TableHead>Tên giống</TableHead>
                        <TableHead className="text-right">
                          Tỷ lệ nảy mầm
                        </TableHead>
                        <TableHead className="text-right">
                          Độ đồng đều
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCropsData.map((c: any) => (
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
                                  alt={c.varietyName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Sprout className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                              {c.varietyCode}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold text-slate-800">
                            {c.varietyName}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="outline"
                              className="border-green-100 text-green-600 bg-green-50/50 text-[10px]"
                            >
                              {c.germinationRate}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="outline"
                              className="border-blue-100 text-blue-600 bg-blue-50/50 text-[10px]"
                            >
                              {c.uniformity}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-5 text-center text-muted-foreground italic border-2 border-dashed rounded-2xl bg-slate-50/30 text-sm">
                  Chưa có thông tin cây trồng cho vùng này
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
          <h4 className="font-semibold text-slate-800">Danh sách cây trồng</h4>
        </div>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
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
                  Ngày trồng
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-wider text-right">
                  Cao (m)
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-wider text-center">
                  Tuổi
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-wider">
                  Tọa độ
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
                    <TableCell className="font-mono text-[10px] text-slate-400">
                      {p.coordinate.lat.toFixed(5)},{" "}
                      {p.coordinate.lng.toFixed(5)}
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

      {/* Technical config summary bottom */}
      {selectedCultivationArea && (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
            <Beaker className="w-4 h-4 text-slate-500" />
            <h4 className="font-semibold text-slate-800">
              Cấu hình kỹ thuật tổng quát
            </h4>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                Quản lý
              </div>
              <div className="font-medium text-slate-900">
                {manager?.fullName || "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                Canh tác
              </div>
              <div className="font-medium text-slate-900">
                {farmingMethod?.name || "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                Tưới tiêu
              </div>
              <div className="font-medium text-slate-900">
                {irrigationMethod?.name || "—"}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
