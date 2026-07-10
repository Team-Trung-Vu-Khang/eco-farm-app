import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, FileText, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import type {
  Area,
  Standard,
} from "../../../stores/useEnterpriseCertificateStore";
import { type EnterpriseCertificateFormValues } from "../data/enterprise-certificate-form.schema";

const ENTITY_TYPE_LABELS = {
  workspace: "Cấp phép theo đơn vị - tổ chức",
  region: "Cấp phép theo vùng canh tác cụ thể",
} as const;

interface CertificateReviewStepProps {
  standards: Standard[];
  areas: Area[];
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h4>
      {children}
    </section>
  );
}

function FieldRow({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-slate-900">
        {value || "Chưa có dữ liệu"}
      </div>
    </div>
  );
}

export function CertificateReviewStep({
  standards,
  areas,
}: CertificateReviewStepProps) {
  const { watch } = useFormContext<EnterpriseCertificateFormValues>();
  const values = watch();

  const selectedStandard = standards.find(
    (item) => item.code === values.standardType,
  );

  const selectedAreas =
    values.entityType === "region"
      ? areas.filter(
          (item) =>
            values.targetIds.includes(item.id) ||
            values.targetIds.includes(item.code),
        )
      : [];

  return (
    <div className="space-y-6">
      <div className="space-y-2 rounded-3xl ">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium text-primary">Hồ sơ xem lại</p>
        </div>
        <h3 className="text-2xl font-semibold text-slate-900">
          Kiểm tra lại toàn bộ thông tin trước khi lưu
        </h3>
        <p className="max-w-2xl text-sm text-slate-500">
          Phần này tổng hợp lại tất cả nội dung bạn đã nhập để tránh thiếu sót
          trước khi tạo hoặc cập nhật chứng nhận.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ReviewSection title="Thông tin cơ bản">
          <div className="grid gap-3 md:grid-cols-2">
            <FieldRow label="Mã chứng nhận" value={values.code} />
            <FieldRow label="Tên chứng nhận" value={values.name} />
            <FieldRow
              label="Loại tiêu chuẩn"
              value={selectedStandard?.name || values.standardType}
            />
            <FieldRow label="Tổ chức cấp" value={values.organization} />
          </div>
        </ReviewSection>

        <ReviewSection title="Thời hạn">
          <div className="grid gap-3 md:grid-cols-2">
            <FieldRow label="Ngày cấp" value={values.issuedDate} />
            <FieldRow label="Ngày hết hạn" value={values.expiryDate} />
          </div>
        </ReviewSection>

        <ReviewSection title="Phạm vi chứng nhận">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {values.entityType === "workspace"
                  ? ENTITY_TYPE_LABELS.workspace
                  : ENTITY_TYPE_LABELS.region}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 font-mono text-[10px]"
              >
                {values.entityType === "workspace"
                  ? values.entityId || "Chưa chọn"
                  : `${values.targetIds.length} vùng`}
              </Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <FieldRow label="Tên đối tượng" value={values.entityName} />
              <FieldRow
                label="Phạm vi"
                value={
                  values.entityType === "workspace"
                    ? "Áp dụng theo phạm vi đơn vị - tổ chức"
                    : "Áp dụng theo vùng canh tác đã chọn"
                }
              />
            </div>
            {values.entityType === "region" ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                <div className="font-medium text-slate-900">
                  Vùng canh tác đã chọn:
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedAreas.length > 0 ? (
                    selectedAreas.map((area) => (
                      <Badge
                        key={area.id}
                        variant="outline"
                        className="rounded-full px-2.5 py-1 text-[10px]"
                      >
                        {area.name}
                      </Badge>
                    ))
                  ) : values.targetNames.length > 0 ? (
                    values.targetNames.map((name, index) => (
                      <Badge
                        key={`${name}-${index}`}
                        variant="outline"
                        className="rounded-full px-2.5 py-1 text-[10px]"
                      >
                        {name}
                      </Badge>
                    ))
                  ) : (
                    <span>Chưa có dữ liệu</span>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </ReviewSection>

        <ReviewSection title="Nội dung chứng nhận">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {values.contentType === "editor"
                  ? "Soạn thảo"
                  : "File đính kèm"}
              </Badge>
            </div>

            {values.contentType === "editor" ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <FileText className="h-4 w-4 text-primary" />
                  Nội dung
                </div>
                <div className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {values.content || "Chưa nhập nội dung"}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <FileText className="h-4 w-4 text-primary" />
                    File đã tải lên
                  </div>
                  <div className="space-y-2">
                    <FieldRow
                      label="Tên file"
                      value={values.content || "Chưa có file"}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1"
                      >
                        {values.fileUrl ? "Đã tải lên" : "Chưa tải lên"}
                      </Badge>
                      {values.fileUrl ? (
                        <Badge
                          variant="outline"
                          className="rounded-full px-3 py-1 font-mono text-[10px]"
                        >
                          File đính kèm
                        </Badge>
                      ) : null}
                      {values.fileUrl ? (
                        <a
                          href={values.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
                        >
                          Xem
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Tệp đính kèm
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {values.attachments.length > 0 ? (
                  values.attachments.map((item) => (
                    <Badge
                      key={item}
                      variant="outline"
                      className="rounded-full px-3 py-1"
                    >
                      {item}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">Không có</span>
                )}
              </div>
            </div>
          </div>
        </ReviewSection>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <div className="flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4" />
          Sẵn sàng lưu dữ liệu
        </div>
        <p className="mt-1 text-emerald-900/80">
          Nếu mọi thông tin đã đúng, bạn có thể bấm lưu để gửi chứng nhận lên hệ
          thống.
        </p>
      </div>
    </div>
  );
}
