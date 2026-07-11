import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Edit, MapPin, FileText } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import {
  LEGAL_FILE_GROUPS,
  LEGAL_STATUS_CLASSNAMES,
  LEGAL_STATUS_LABELS,
  formatLegalDate,
} from "./data/constants";
import { LegalIdentificationFileGroup } from "./components/LegalIdentificationFileGroup";
import useLegalIdentificationStore from "@/stores/useLegalIdentificationStore";

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

  const totalFiles = LEGAL_FILE_GROUPS.reduce(
    (sum, group) => sum + (record.documents[group.id]?.length || 0),
    0,
  );
  const scopeSummary =
    record.scopeSelections?.[0]?.type === "plot"
      ? `${record.scopeSelections[0].regionName || "Vùng trồng"} • ${record.scopeSelections[0].areaName || "Khu vực"} • ${record.scopeSelections[0].name || "Lô đất"}`
      : record.scopeSelections?.[0]?.type === "area"
        ? `${record.scopeSelections[0].regionName || "Vùng trồng"} • ${record.scopeSelections[0].areaName || "Khu vực"}`
        : record.scopeSelections?.[0]?.regionName ||
          record.scopeSelections?.[0]?.name ||
          "Chưa chọn phạm vi";

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
            Danh sách
          </Button>
          <Button
            onClick={() => setLocation(`/legal-identification/${record.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="mx-auto max-w-6xl space-y-6 pb-10">
        <Card className="overflow-hidden border-slate-200/70 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-50 via-white to-sky-50 px-6 py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500 ring-1 ring-slate-200/70">
                  <FileText className="h-3.5 w-3.5 text-emerald-500" />
                  Hồ sơ {record.code}
                </div>
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  {record.name}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {scopeSummary}
                  </span>
                  <span>•</span>
                  <span>{record.address}</span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={LEGAL_STATUS_CLASSNAMES[record.status]}
              >
                {LEGAL_STATUS_LABELS[record.status]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 px-6 py-5 md:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/70">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Chủ đất / đơn vị
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {record.ownerName}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/70">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Tổng file
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {totalFiles}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/70">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Tạo lúc
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {formatLegalDate(record.createdAt)}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/70">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Cập nhật
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {formatLegalDate(record.updatedAt)}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <Card className="border-slate-200/70 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-slate-900">
                  Thông tin hồ sơ
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Mã hồ sơ
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {record.code}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Tên hồ sơ
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {record.name}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Vùng trồng
                  </div>
                  <div className="text-sm text-slate-700">{record.regionName}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Khu vực
                  </div>
                  <div className="text-sm text-slate-700">{record.areaName}</div>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Phạm vi đã chọn
                  </div>
                  <div className="text-sm text-slate-700">
                    {scopeSummary}
                  </div>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Địa chỉ
                  </div>
                  <div className="text-sm text-slate-700">{record.address}</div>
                </div>
                {record.note ? (
                  <div className="space-y-1 md:col-span-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Ghi chú
                    </div>
                    <div className="text-sm text-slate-700">{record.note}</div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {LEGAL_FILE_GROUPS.map((group, index) => (
              <div key={group.id} className="space-y-4">
                <LegalIdentificationFileGroup
                  group={group}
                  files={record.documents[group.id] || []}
                  readOnly
                />
                {index < LEGAL_FILE_GROUPS.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          <div className="space-y-4 lg:sticky lg:top-6 self-start">
            <Card className="border-slate-200/70 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-slate-900">
                  Tóm tắt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {LEGAL_FILE_GROUPS.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/70"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-900">
                        {group.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {record.documents[group.id]?.length || 0} file
                      </div>
                    </div>
                    <Badge variant="outline" className="border-slate-200 text-slate-500">
                      {record.documents[group.id]?.length ? "Đủ" : "Thiếu"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
