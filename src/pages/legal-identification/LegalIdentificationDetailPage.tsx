import useLegalIdentificationStore from "@/stores/useLegalIdentificationStore";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Edit } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import { LegalIdentificationFileGroup } from "./components/LegalIdentificationFileGroup";
import { LEGAL_FILE_GROUPS } from "./data/constants";

export default function LegalIdentificationDetailPage() {
  const [, setLocation] = useLocation();
  const { getRecordById } = useLegalIdentificationStore();
  const [match, params] = useRoute("/legal-identification/:id");
  const recordId = Number(params?.id || 0);

  const record = useMemo(
    () => (match && recordId > 0 ? getRecordById(recordId) : undefined),
    [getRecordById, match, recordId],
  );

  useEffect(() => {
    if (match && recordId > 0 && !record) {
      setLocation("/legal-identification");
    }
  }, [match, record, recordId, setLocation]);

  if (!record) return null;

  const scopeSummary = record.scopeSelections
    .map((selection) =>
      selection.type === "plot"
        ? `${selection.regionName || "Vùng trồng"} • ${selection.areaName || "Khu vực"} • ${selection.name || "Lô đất"}`
        : selection.type === "area"
          ? `${selection.regionName || "Vùng trồng"} • ${selection.areaName || "Khu vực"}`
          : selection.regionName || selection.name || "Vùng trồng",
    )
    .filter(Boolean);

  return (
    <AdminLayout
      isDev={true}
      title="Hồ sơ định danh pháp lý"
      description="Xem toàn bộ hồ sơ, tài liệu đính kèm và trạng thái rà soát."
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setLocation("/legal-identification")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button
            onClick={() =>
              setLocation(`/legal-identification/${record.id}/edit`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="mx-auto max-w-6xl space-y-8 pb-10">
        <Card className="border-slate-200/70 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Thông tin hồ sơ
              </h2>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Mã hồ sơ
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {record.code}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Tên hồ sơ
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {record.name}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Vùng trồng
                </div>
                <div className="text-sm text-slate-700">
                  {record.regionName || "Chưa nhập"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Khu vực
                </div>
                <div className="text-sm text-slate-700">
                  {record.areaName || "Chưa nhập"}
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Phạm vi đã chọn
                </div>
                <div className="flex flex-wrap gap-2">
                  {scopeSummary.length > 0 ? (
                    scopeSummary.map((scope) => (
                      <span
                        key={scope}
                        className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200/70"
                      >
                        {scope}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">Chưa nhập</span>
                  )}
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Địa chỉ
                </div>
                <div className="text-sm text-slate-700">
                  {record.address || "Chưa nhập"}
                </div>
              </div>
              {record.ownerName ? (
                <div className="space-y-1 md:col-span-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Chủ đất / Đơn vị sử dụng
                  </div>
                  <div className="text-sm text-slate-700">
                    {record.ownerName}
                  </div>
                </div>
              ) : null}
              {record.note ? (
                <div className="space-y-1 md:col-span-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Ghi chú
                  </div>
                  <div className="text-sm leading-6 text-slate-700">
                    {record.note}
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          {LEGAL_FILE_GROUPS.map((group) => (
            <Card key={group.id} className="border-slate-200/70 shadow-sm">
              <CardContent className="p-5">
                <LegalIdentificationFileGroup
                  group={group}
                  files={record.documents[group.id] || []}
                  readOnly
                  variant="flat"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
