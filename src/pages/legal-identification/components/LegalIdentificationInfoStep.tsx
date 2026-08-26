import { GeographicalSelector } from "@/pages/cultivation-zone/cultivation-region/components/SharedSelectors";
import type { GeographicalSelection } from "@/pages/cultivation-zone/cultivation-region/components/types";
import {
  Card,
  CardContent,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin } from "lucide-react";
import type { LegalIdentificationStatus } from "../data/constants";

export interface LegalIdentificationFormState {
  name: string;
  scopeSelections: GeographicalSelection[];
  address: string;
  note: string;
  status: LegalIdentificationStatus;
}

type LegalIdentificationInfoStepProps = {
  value: LegalIdentificationFormState;
  regions: Array<{
    id: string | number;
    name: string;
  }>;
  showStatus: boolean;
  onChange: (value: Partial<LegalIdentificationFormState>) => void;
  onRegionSearchChange?: (keyword: string) => void;
};

function describeScopeChip(selection: GeographicalSelection) {
  return selection.regionName || selection.name || "Vùng trồng";
}

function describeSelectedScopes(selections: GeographicalSelection[]) {
  if (selections.length === 0) return "Chưa chọn phạm vi";
  if (selections.length === 1) return describeScopeChip(selections[0]);
  return `${selections.length} phạm vi đã chọn`;
}

export function LegalIdentificationInfoStep({
  value,
  regions,
  showStatus,
  onChange,
  onRegionSearchChange,
}: LegalIdentificationInfoStepProps) {
  const handleRemoveScope = (selectionId: string) => {
    const nextSelections = value.scopeSelections.filter(
      (selection) => selection.id !== selectionId,
    );

    onChange({ scopeSelections: nextSelections });
  };

  return (
    <Card className="border-slate-200/70 shadow-sm">
      <CardContent className="p-5">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label required>Phạm vi vùng trồng</Label>
            <GeographicalSelector
              regions={regions}
              enterpriseId=""
              showEnterprise={false}
              regionOnly
              onRegionSearchChange={onRegionSearchChange}
              existingSelections={value.scopeSelections}
              onConfirm={(selections) => {
                const uniqueSelections = selections.filter(
                  (selection, index, current) =>
                    selection.type === "region" &&
                    current.findIndex(
                      (item) =>
                        item.type === "region" &&
                        item.regionId === selection.regionId,
                    ) === index,
                );

                onChange({ scopeSelections: uniqueSelections });
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
                      Bấm để chọn vùng trồng.
                    </div>
                  </div>
                  <div
                    className={
                      value.scopeSelections.length > 0
                        ? "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                        : "rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500"
                    }
                  >
                    {value.scopeSelections.length > 0 ? "Đã chọn" : "Chưa chọn"}
                  </div>
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
          <div className="space-y-2">
            <Label required>Tên hồ sơ</Label>
            <Input
              value={value.name}
              onChange={(event) => onChange({ name: event.target.value })}
              placeholder="VD: Hồ sơ pháp lý vùng trồng Khu C"
            />
          </div>

          <div className="space-y-2">
            <Label>Địa chỉ</Label>
            <Input
              value={value.address}
              onChange={(event) => onChange({ address: event.target.value })}
              placeholder="Nhập địa chỉ"
            />
          </div>
          {showStatus && (
            <div className="space-y-3">
              <Label>Trạng thái hồ sơ</Label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["draft", "Nháp"],
                    ["pending", "Đang duyệt"],
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
