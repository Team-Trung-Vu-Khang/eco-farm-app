import { Input, Label, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { EnterpriseCertificate } from "../../../stores/useEnterpriseCertificateStore";

interface ContentFieldsProps {
  formData: Omit<EnterpriseCertificate, "id" | "createdAt" | "status">;
  setFormData: (data: any) => void;
  editorContentRef: React.MutableRefObject<string>;
}

export function CertificateContentFields({ formData, setFormData, editorContentRef }: ContentFieldsProps) {
  return (
    <div className="space-y-2">
      <Label>Nội dung chứng nhận</Label>
      <Tabs
        defaultValue={formData.contentType}
        onValueChange={(value) =>
          setFormData({
            ...formData,
            contentType: value as "editor" | "file",
          })
        }
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Soạn thảo</TabsTrigger>
          <TabsTrigger value="file">File đính kèm</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="mt-4">
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => {
              editorContentRef.current = e.target.value;
              setFormData({ ...formData, content: e.target.value });
            }}
            placeholder="Nội dung chứng nhận..."
            rows={5}
          />
        </TabsContent>

        <TabsContent value="file" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fileUpload">Chọn file (PDF, Image...)</Label>
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
                    fileUrl: fileUrl,
                    content: file.name,
                  });
                }
              }}
              className="cursor-pointer"
            />
          </div>
          {formData.fileUrl && (
            <div className="p-4 border rounded bg-muted/20 space-y-2">
              <div className="text-sm text-muted-foreground">
                File đã chọn:{" "}
                <span className="font-medium">{formData.content}</span>
              </div>
              <a
                href={formData.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline text-sm inline-block"
              >
                Xem file
              </a>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
