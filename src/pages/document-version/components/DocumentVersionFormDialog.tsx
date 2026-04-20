import {
  Alert,
  AlertDescription,
  AlertTitle,
  FormDialog,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertTriangle, Eye, Upload } from "lucide-react";
import { FieldLabel, FieldSelect } from "./FieldControls";
import { formatDate } from "../constants/documentVersionConstants";
import type { DocumentRecord, VersionFormState } from "../types";

interface DocumentVersionFormDialogProps {
  documents: DocumentRecord[];
  formData: VersionFormState;
  mode: "create" | "edit";
  open: boolean;
  versionConflict: string | null;
  onBaseVersionChange: (value: string) => void;
  onDocumentChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  setFormData: React.Dispatch<React.SetStateAction<VersionFormState>>;
}

export function DocumentVersionFormDialog({
  documents,
  formData,
  mode,
  open,
  versionConflict,
  onBaseVersionChange,
  onDocumentChange,
  onOpenChange,
  onSubmit,
  setFormData,
}: DocumentVersionFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Tạo phiên bản tài liệu" : "Cập nhật phiên bản"}
      description="Nhập phiên bản, thời gian hiệu lực, tệp đính kèm và mô tả thay đổi để phục vụ kiểm soát phát hành."
      onSubmit={onSubmit}
      submitLabel={mode === "create" ? "Lưu phiên bản" : "Cập nhật phiên bản"}
      size="xl"
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel>Tài liệu</FieldLabel>
            <FieldSelect value={formData.documentId} onChange={onDocumentChange}>
              {documents.map((document) => (
                <option key={document.id} value={document.id}>
                  {document.code} • {document.name}
                </option>
              ))}
            </FieldSelect>
          </div>

          <div className="space-y-2">
            <FieldLabel>Kế thừa từ phiên bản cũ</FieldLabel>
            <FieldSelect value={formData.baseVersionId} onChange={onBaseVersionChange}>
              <option value="none">Không kế thừa</option>
              {documents
                .find((document) => document.id === formData.documentId)
                ?.versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.version} • {formatDate(version.effectiveFrom)}
                  </option>
                ))}
            </FieldSelect>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel htmlFor="version">Phiên bản</FieldLabel>
            <Input
              id="version"
              value={formData.version}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  version: event.target.value,
                }))
              }
              placeholder="Ví dụ: v2.1"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel>Trạng thái xử lý</FieldLabel>
            <FieldSelect
              value={formData.status}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as VersionFormState["status"],
                }))
              }
            >
              <option value="draft">Nháp</option>
              <option value="pending">Chờ duyệt</option>
            </FieldSelect>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel htmlFor="effectiveFrom">Hiệu lực từ</FieldLabel>
            <Input
              id="effectiveFrom"
              type="date"
              value={formData.effectiveFrom}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  effectiveFrom: event.target.value,
                }))
              }
              clearable={false}
            />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="effectiveTo">Hiệu lực đến</FieldLabel>
            <Input
              id="effectiveTo"
              type="date"
              value={formData.effectiveTo}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  effectiveTo: event.target.value,
                }))
              }
              clearable={false}
            />
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="attachment">Tệp đính kèm</FieldLabel>
          <Input
            id="attachment"
            type="file"
            clearable={false}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setFormData((prev) => ({ ...prev, fileName: file.name }));
            }}
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Upload className="h-4 w-4" />
            <span>{formData.fileName || "Chưa chọn file đính kèm"}</span>
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="changeSummary">Mô tả thay đổi</FieldLabel>
          <textarea
            id="changeSummary"
            value={formData.changeSummary}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                changeSummary: event.target.value,
              }))
            }
            placeholder="Mô tả những gì đã thay đổi, lý do cập nhật và ảnh hưởng nghiệp vụ."
            className="flex min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {versionConflict ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Xung đột hiệu lực</AlertTitle>
            <AlertDescription>{versionConflict}</AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
            <Eye className="h-4 w-4" />
            <AlertTitle>Đã kiểm tra hợp lệ</AlertTitle>
            <AlertDescription>
              Khoảng hiệu lực hiện chưa bị chồng lấn với phiên bản khác của cùng tài liệu.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </FormDialog>
  );
}
