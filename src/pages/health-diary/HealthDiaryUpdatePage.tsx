import React, { useState, useMemo } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  cn,
  Combobox,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { HeartPulse, MapPin, Sprout, CheckCircle2, Send } from "lucide-react";
import { useDashboardData } from "@/pages/dashboard/hooks/useDashboardData";
import { ZoneScopeHealthBlock } from "./components/ZoneScopeHealthBlock";
import { IndividualPlantHealthBlock } from "./components/IndividualPlantHealthBlock";
import { useHealthDiaryStore } from "@/features/health-diary/stores/useHealthDiaryStore";
import type {
  HealthStatusType,
  HealthUpdateMethodType,
} from "@/features/health-diary/types/health-diary.types";

export default function HealthDiaryUpdatePage() {
  const { addRecord } = useHealthDiaryStore();
  const { zoneTreeData } = useDashboardData();

  const [selectedZoneId, setSelectedZoneId] = useState<string>("");
  const [methodType, setMethodType] =
    useState<HealthUpdateMethodType>("ZONE_SCOPE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const zoneOptions = useMemo(() => {
    if (!zoneTreeData || zoneTreeData.length === 0) return [];
    return zoneTreeData.map((z: any) => ({
      value: String(z.id),
      label: z.name || `Vùng canh tác ${z.id}`,
    }));
  }, [zoneTreeData]);

  const selectedZone = useMemo(() => {
    if (!zoneTreeData || zoneTreeData.length === 0 || !selectedZoneId)
      return null;
    return (
      zoneTreeData.find((z) => String(z.id) === String(selectedZoneId)) || null
    );
  }, [zoneTreeData, selectedZoneId]);

  const handleRecordSubmit = (payload: {
    targetScopeNames?: string[];
    plantCodes?: string[];
    status: HealthStatusType;
    notes: string;
    imageUrls: string[];
  }) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newRecord = addRecord({
        zoneId: selectedZoneId,
        zoneName:
          selectedZone?.name ||
          "Vùng lúa ST25 - Vùng canh tác nông nghiệp công nghệ cao",
        methodType,
        regionName: payload.targetScopeNames?.[0] || "Khu vực A",
        targetScopeNames: payload.targetScopeNames,
        plantCodes: payload.plantCodes,
        plantCount: payload.plantCodes?.length,
        status: payload.status,
        notes: payload.notes,
        imageUrls: payload.imageUrls,
      });

      setIsSubmitting(false);
      setSuccessMessage(
        `Đã lưu nhật ký sức khỏe thành công (Mã: ${newRecord.code})!`,
      );
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 600);
  };

  return (
    <PageWrapper
      title="Cập nhật thông tin sức khỏe vùng trồng"
      description="Ghi nhận nhật ký diễn biến sức khỏe theo phạm vi vùng hoặc từng cá thể cây trồng"
    >
      <div className="max-w-7xl mx-auto space-y-5 pb-16">
        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-sm flex items-center gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ── TOP SWITCHER BAR (Phạm vi vùng trồng vs Cá thể từng cây trồng) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-sm text-slate-800">
              Phương thức cập nhật sức khỏe (Test Onlyy)
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setMethodType("ZONE_SCOPE")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer",
                methodType === "ZONE_SCOPE"
                  ? "bg-white text-emerald-700 shadow-2xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800",
              )}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Phạm vi vùng trồng</span>
            </button>
            <button
              type="button"
              onClick={() => setMethodType("INDIVIDUAL_PLANT")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer",
                methodType === "INDIVIDUAL_PLANT"
                  ? "bg-white text-emerald-700 shadow-2xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800",
              )}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Cá thể từng cây trồng</span>
            </button>
          </div>
        </div>

        {/* ── STANDALONE VÙNG CANH TÁC SELECTOR BLOCK ── */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                  <span>Lựa chọn Vùng canh tác</span>
                  {selectedZone && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold"
                    >
                      Đã chọn
                    </Badge>
                  )}
                </h3>
                <p className="text-xs text-slate-500">
                  Chọn vùng canh tác để đồng bộ phạm vi địa lý và bộ lọc cá thể
                  cây trồng
                </p>
              </div>
            </div>

            <div className="sm:w-80 md:w-96 shrink-0">
              <Combobox
                options={zoneOptions}
                value={selectedZoneId}
                onChange={(val) => setSelectedZoneId(val || "")}
                placeholder="Chọn vùng canh tác..."
                searchPlaceholder="Tìm kiếm vùng canh tác..."
              />
            </div>
          </div>

          {/* Display selected zone summary info if available */}
          {selectedZone && (
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-500">Vùng:</span>
                <span className="font-extrabold text-emerald-700">
                  {selectedZone.name}
                </span>
              </div>
              {selectedZone.totalAreaHa && (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-500">
                    Diện tích:
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedZone.totalAreaHa} ha
                  </span>
                </div>
              )}
              {selectedZone.description && (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-500">Mô tả:</span>
                  <span className="text-slate-700 truncate max-w-xs">
                    {selectedZone.description}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── CONDITIONAL RENDER: MODE A (ZONE_SCOPE) vs MODE B (INDIVIDUAL_PLANT) ── */}
        {methodType === "ZONE_SCOPE" ? (
          <ZoneScopeHealthBlock
            selectedZone={selectedZone}
            allZones={zoneTreeData}
            onSelectZone={setSelectedZoneId}
            onSubmit={handleRecordSubmit}
            isSubmitting={isSubmitting}
          />
        ) : (
          <IndividualPlantHealthBlock
            selectedZone={selectedZone}
            allZones={zoneTreeData}
            onSelectZone={setSelectedZoneId}
            onSubmit={handleRecordSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      <div className="fixed left-0 right-0 bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3.5 px-6 flex items-center justify-end gap-3 z-30 rounded-b-xl shadow-md">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer text-xs"
        >
          <Send className="w-4 h-4" />
          <span>Lưu nhật ký sức khỏe</span>
        </Button>
      </div>
    </PageWrapper>
  );
}
