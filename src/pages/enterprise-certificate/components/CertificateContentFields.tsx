import { useUploadStorageFile } from "@/features/storage/hooks/useUploadStorageFile";
import {
  Button,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText, Trash2, Upload, WandSparkles } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import type { EnterpriseCertificateFormValues } from "../data/enterprise-certificate-form.schema";

export function CertificateContentFields() {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<EnterpriseCertificateFormValues>();
  const contentType = watch("contentType");
  const fileUrl = watch("fileUrl");
  const uploadFile = useUploadStorageFile();

  const handleRemoveFile = () => {
    setValue("fileUrl", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("content", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleUploadFile = async (file?: File | null) => {
    if (!file) return;

    const uploaded = await uploadFile.uploadStorageFile({
      file,
      folder: "enterprise-certificates",
    });

    setValue("fileUrl", uploaded.fileUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("content", uploaded.fileName || file.name, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={contentType}
        onValueChange={(value) => {
          setValue("contentType", value as "editor" | "file", {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1">
          <TabsTrigger value="editor" className="gap-2">
            <WandSparkles className="h-4 w-4" />
            Soạn thảo
          </TabsTrigger>
          <TabsTrigger value="file" className="gap-2">
            <FileText className="h-4 w-4" />
            File đính kèm
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="mt-4">
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung chứng nhận</Label>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <Textarea
                  id="content"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                  placeholder="Nội dung chứng nhận..."
                  rows={8}
                  className="min-h-[220px] bg-white"
                  aria-invalid={!!errors.content}
                />
              )}
            />
            {errors.content ? (
              <p className="text-xs text-red-600">{errors.content.message}</p>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="file" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Upload className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-slate-900">
                  Tải file chứng nhận
                </p>
                <p className="text-sm text-muted-foreground">
                  Chấp nhận PDF, JPG, JPEG, PNG. Sau khi chọn file, tên file sẽ
                  hiển thị tại đây để bạn kiểm tra nhanh.
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="fileUpload">Chọn file</Label>
              <Input
                id="fileUpload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  void handleUploadFile(e.target.files?.[0]);
                }}
                className="cursor-pointer bg-white"
              />
            </div>
          </div>

          {fileUrl ? (
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        File đã chọn
                      </p>
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {watch("content")}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        Đã tải lên
                      </span>
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        File đính kèm
                      </span>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
                      >
                        Xem
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:pt-0">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleRemoveFile}
                  >
                    <Trash2 className="h-3.5 w-3.5" color="red" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-sm text-muted-foreground">
              Chưa có file nào được đính kèm.
            </div>
          )}
          {errors.fileUrl ? (
            <p className="text-xs text-red-600">{errors.fileUrl.message}</p>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
