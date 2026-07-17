import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, FileText } from "lucide-react";
import type { GeographicalSelection } from "@/pages/cultivation-zone/cultivation-region/components/types";
import {
  LEGAL_FILE_GROUPS,
  LEGAL_STATUS_CLASSNAMES,
  LEGAL_STATUS_LABELS,
  type LegalFileGroupId,
  type LegalIdentificationFileMeta,
} from "../data/constants";
import type { LegalIdentificationFormState } from "./LegalIdentificationInfoStep";

type LegalIdentificationReviewStepProps = {
  formValue: LegalIdentificationFormState;
  documents: Record<LegalFileGroupId, LegalIdentificationFileMeta[]>;
};

function describeScope(selection: GeographicalSelection) {
  if (selection.type === "region") {
    return selection.regionName || selection.name || "Vùng trồng";
  }
  return selection.regionName || selection.name || "Vùng trồng";
}

export function LegalIdentificationReviewStep({
  formValue,
  documents,
}: LegalIdentificationReviewStepProps) {
  return (
    <div className="space-y-4">
      <Card className="border-slate-200/70 shadow-sm">
        <CardContent className="p-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Tên hồ sơ
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {formValue.name || "Chưa nhập"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Phạm vi vùng trồng
                </div>
                <div className="text-sm text-slate-700">
                  {formValue.scopeSelections.length > 0
                    ? `${formValue.scopeSelections.length} vùng`
                    : "Chưa nhập"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Trạng thái
                </div>
                <Badge
                  variant="outline"
                  className={LEGAL_STATUS_CLASSNAMES[formValue.status]}
                >
                  {LEGAL_STATUS_LABELS[formValue.status]}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Phạm vi đã chọn
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-slate-700">
                    {formValue.scopeSelections.length > 0
                      ? `${formValue.scopeSelections.length} phạm vi`
                      : "Chưa nhập"}
                  </div>
                  {formValue.scopeSelections.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formValue.scopeSelections.map((selection) => (
                        <div
                          key={selection.id}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                        >
                          {describeScope(selection)}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Địa chỉ
                </div>
                <div className="text-sm text-slate-700">
                  {formValue.address || "Chưa nhập"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        {LEGAL_FILE_GROUPS.map((group) => {
          const fileCount = documents[group.id]?.length || 0;

          return (
            <Card key={group.id} className="border-slate-200/70 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {group.title}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {fileCount} file đính kèm
                    </div>
                  </div>
                  <CheckCircle2
                    className={`h-4 w-4 ${fileCount ? "text-emerald-500" : "text-slate-300"}`}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-slate-200/70 shadow-sm">
        <CardContent className="p-5">
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Ghi chú
            </div>
            <div className="text-sm leading-6 text-slate-700">
              {formValue.note?.trim() ? formValue.note : "Chưa nhập"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
