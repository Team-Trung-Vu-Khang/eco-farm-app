import { GeographicalSelector } from "@/pages/cultivation-zone/cultivation-region/components/SharedSelectors";
import type { GeographicalSelection } from "@/pages/cultivation-zone/cultivation-region/components/types";
import type { Enterprise } from "@/pages/enterprise/data/constants";
import {
  Badge,
  Card,
  CardContent,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin } from "lucide-react";
import type { LegalIdentificationStatus } from "../data/constants";
import { LegalIdentificationOwnerSelector } from "./LegalIdentificationOwnerSelector";

export interface LegalIdentificationFormState {
  code: string;
  name: string;
  scopeSelections: GeographicalSelection[];
  regionName: string;
  areaName: string;
  address: string;
  ownerName: string;
  note: string;
  status: LegalIdentificationStatus;
}

type LegalIdentificationInfoStepProps = {
  value: LegalIdentificationFormState;
  enterprises: Enterprise[];
  regions: Array<{
    id: string | number;
    name: string;
    enterpriseId?: string;
  }>;
  showStatus: boolean;
  onChange: (value: Partial<LegalIdentificationFormState>) => void;
};

function describeScopeChip(selection: GeographicalSelection) {
  if (selection.type === "region") {
    return selection.regionName || selection.name || "Vùng trồng";
  }
  if (selection.type === "area") {
    return `${selection.regionName || "Vùng trồng"} • ${selection.areaName || selection.name || "Khu vực"}`;
  }
  return `${selection.regionName || "Vùng trồng"} • ${selection.areaName || "Khu vực"} • ${selection.name || "Lô đất"}`;
}

function describeSelectedScopes(selections: GeographicalSelection[]) {
  if (selections.length === 0) return "Chưa chọn phạm vi";
  if (selections.length === 1) return describeScopeChip(selections[0]);
  return `${selections.length} phạm vi đã chọn`;
}

export function LegalIdentificationInfoStep({
  value,
  enterprises,
  regions,
  showStatus,
  onChange,
}: LegalIdentificationInfoStepProps) {
  const handleRemoveScope = (selectionId: string) => {
    const nextSelections = value.scopeSelections.filter(
      (selection) => selection.id !== selectionId,
    );
    const primary = nextSelections[0];

    onChange({
      scopeSelections: nextSelections,
      regionName: primary?.regionName || primary?.name || "",
      areaName: primary?.areaName || primary?.name || primary?.regionName || "",
    });
  };

  return (
    <Card className="border-slate-200/70 shadow-sm">
      <CardContent className="p-5">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Chủ đất / Đơn vị sử dụng</Label>
            <LegalIdentificationOwnerSelector
              enterprises={enterprises}
              value={value.ownerName}
              onChange={(nextValue) => onChange({ ownerName: nextValue })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Vùng trồng / Khu vực / Lô</Label>
            <GeographicalSelector
              regions={regions}
              enterpriseId=""
              showEnterprise={false}
              existingSelections={value.scopeSelections}
              onConfirm={(selections) => {
                const primary = selections[0];
                onChange({
                  scopeSelections: selections,
                  regionName: primary?.regionName || primary?.name || "",
                  areaName:
                    primary?.areaName ||
                    primary?.name ||
                    primary?.regionName ||
                    "",
                });
              }}
              customTrigger={
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-3 text-left transition-colors hover:border-primary/30 hover:bg-white"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Chọn phạm vi
                      </div>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {describeSelectedScopes(value.scopeSelections)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Bấm để mở tìm kiếm vùng trồng, khu vực hoặc lô.
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      value.scopeSelections.length > 0
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-500"
                    }
                  >
                    {value.scopeSelections.length > 0 ? "Đã chọn" : "Chưa chọn"}
                  </Badge>
                </button>
              }
            />
            {value.scopeSelections.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Danh sách đã chọn
                </div>
                <div className="flex flex-wrap gap-2">
                  {value.scopeSelections.map((selection) => (
                    <div
                      key={selection.id}
                      className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm"
                    >
                      <span className="whitespace-normal break-words">
                        {describeScopeChip(selection)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveScope(selection.id)}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        aria-label={`Xóa ${describeScopeChip(selection)}`}
                      >
                        <span className="text-sm leading-none">×</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Mã hồ sơ</Label>
              <Input
                value={value.code}
                onChange={(event) => onChange({ code: event.target.value })}
                placeholder="VD: LD-003"
              />
            </div>
            <div className="space-y-2">
              <Label>Tên hồ sơ</Label>
              <Input
                value={value.name}
                onChange={(event) => onChange({ name: event.target.value })}
                placeholder="VD: Hồ sơ pháp lý vùng trồng Khu C"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Địa chỉ thửa đất</Label>
            <Input
              value={value.address}
              onChange={(event) => onChange({ address: event.target.value })}
              placeholder="Nhập địa chỉ thửa đất"
            />
          </div>
          {showStatus && (
            <div className="space-y-3">
              <Label>Trạng thái hồ sơ</Label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["draft", "Nháp"],
                    ["in_review", "Đang duyệt"],
                    ["approved", "Đã duyệt"],
                  ] as const
                ).map(([status, label]) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => onChange({ status })}
                    className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors ${
                      value.status === status
                        ? "bg-primary text-white ring-primary"
                        : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Ghi chú</Label>
            <Textarea
              value={value.note}
              onChange={(event) => onChange({ note: event.target.value })}
              placeholder="Mô tả thêm về hồ sơ pháp lý, tình trạng rà soát, lưu ý đặc biệt..."
              className="min-h-28"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
