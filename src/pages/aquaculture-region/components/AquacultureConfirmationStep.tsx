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
import { Fish, Layers, MapPin } from "lucide-react";
import { AQUACULTURE_SPECIES } from "../data/create-dummy";
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
    <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-100 bg-cyan-50 p-8 text-center">
        <div className="relative z-10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-cyan-100 shadow-sm">
          <Fish className="h-10 w-10 text-cyan-600" />
        </div>
        <h3 className="relative z-10 text-2xl font-bold text-cyan-900">
          Xác nhận thông tin
        </h3>
        <p className="relative z-10 mx-auto mt-2 max-w-lg text-cyan-700/80">
          Sắp {initialData ? "cập nhật" : "lưu"}{" "}
          <span className="font-bold">{plants.length} đối tượng nuôi</span>{" "}
          trong vùng{" "}
          <span className="font-bold">
            {selectedCultivationRegion?.name || "—"}
          </span>
          .
        </p>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-10 top-10 h-20 w-20 rounded-full bg-cyan-500 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-cyan-600 blur-3xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-primary">{plants.length}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            đối tượng nuôi
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm sm:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-left font-bold text-slate-900">
                {selectedCultivationRegion?.name || "Chưa chọn vùng nuôi trồng"}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span className="truncate rounded bg-slate-100 px-2 py-0.5 font-mono text-slate-600">
                  Mã vùng: {selectedCultivationRegion?.code || "—"}
                </span>
                <span className="truncate rounded bg-slate-100 px-2 py-0.5 font-mono text-slate-600">
                  Phạm vi: {selectedScopes.length} mục
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 border-b bg-slate-50 p-4">
          <MapPin className="h-4 w-4 text-slate-500" />
          <h4 className="font-semibold text-slate-800">Phạm vi nuôi trồng</h4>
        </div>
        <div className="bg-white p-6">
          {selectedScopes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedScopes.map((scope) => (
                <Badge
                  key={scope.id}
                  variant="outline"
                  className="border-slate-200 bg-slate-50 text-slate-700"
                >
                  {scope.name || scope.id}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed bg-slate-50/30 py-4 text-center text-sm italic text-muted-foreground">
              Chưa chọn phạm vi nuôi trồng
            </div>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 border-b bg-slate-50 p-4">
          <Fish className="h-4 w-4 text-slate-500" />
          <h4 className="font-semibold text-slate-800">
            Danh sách đối tượng thủy sản
          </h4>
        </div>
        <div className="bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="w-[50px] text-center text-[10px] font-bold uppercase tracking-wider">
                  #
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider">
                  Đối tượng nuôi
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider">
                  Giống
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider">
                  Kích cỡ / chiều dài
                </TableHead>
                <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider">
                  Độ tuổi
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider">
                  Ngày ghi nhận
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider">
                  Ghi chú
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plants.map((plant, idx) => (
                <TableRow
                  key={plant.entryId}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/30 last:border-0"
                >
                  <TableCell className="text-center text-xs font-medium text-slate-400">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-cyan-50 text-cyan-600">
                        <Fish className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        Đối tượng thủy sản {idx + 1}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {AQUACULTURE_SPECIES.find(
                      (species) => String(species.id) === plant.speciesId,
                    )?.varietyName || "—"}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {plant.height || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="secondary"
                      className="border-none bg-slate-100 px-2 py-0 text-[10px] text-slate-600"
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
                  <TableCell className="text-xs text-slate-600">
                    {plant.plantedDate
                      ? new Date(plant.plantedDate).toLocaleDateString("vi-VN")
                      : "—"}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate text-xs italic text-slate-500">
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
