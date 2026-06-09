import {
  Badge,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText, Upload, WandSparkles } from "lucide-react";
import type { EnterpriseCertificate } from "../../../stores/useEnterpriseCertificateStore";
import type { MutableRefObject } from "react";

interface ContentFieldsProps {
  formData: Omit<EnterpriseCertificate, "id" | "createdAt" | "status">;
  setFormData: (
    data: Omit<EnterpriseCertificate, "id" | "createdAt" | "status">,
  ) => void;
  editorContentRef: MutableRefObject<string>;
}

export function CertificateContentFields({
  formData,
  setFormData,
  editorContentRef,
}: ContentFieldsProps) {
  return (
    <div className="space-y-4">
      <Tabs
        value={formData.contentType}
        onValueChange={(value) =>
          setFormData({
            ...formData,
            contentType: value as "editor" | "file",
          })
        }
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
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => {
                editorContentRef.current = e.target.value;
                setFormData({ ...formData, content: e.target.value });
              }}
              placeholder="Nội dung chứng nhận..."
              rows={8}
              className="min-h-[220px] bg-white"
            />
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
                  const file = e.target.files?.[0];
                  if (file) {
                    const fileUrl = URL.createObjectURL(file);
                    setFormData({
                      ...formData,
                      fileUrl,
                      content: file.name,
                    });
                  }
                }}
                className="cursor-pointer bg-white"
              />
            </div>
          </div>

          {formData.fileUrl ? (
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <div className="text-sm text-muted-foreground">
                File đã chọn:{" "}
                <span className="font-medium text-slate-900">
                  {formData.content}
                </span>
              </div>
              <a
                href={formData.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Xem file
              </a>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-sm text-muted-foreground">
              Chưa có file nào được đính kèm.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
