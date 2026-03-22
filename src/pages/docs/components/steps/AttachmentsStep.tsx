import { type ChangeEvent } from "react";
import {
  Button,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText, Link, Plus, Trash } from "lucide-react";
import type { CreateDocsForm, CreateDocsAttachment } from "../../types";

interface AttachmentsStepProps {
  formData: CreateDocsForm;
  setFormData: (data: any) => void;
  onAddAttachment: () => void;
}

export function AttachmentsStep({
  formData,
  setFormData,
  onAddAttachment,
}: AttachmentsStepProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid gap-4">
        {formData?.attachments?.map((attachment, index) => {
          const handleChangeSpecValue =
            (key: keyof CreateDocsAttachment) =>
            (e: ChangeEvent<HTMLInputElement>) => {
              const specClone = Array.from(formData?.attachments ?? []);
              specClone[index] = {
                ...specClone[index],
                [key]: e.target.value,
              };
              setFormData((prev: CreateDocsForm) => ({
                ...prev,
                attachments: specClone,
              }));
            };

          const handleRemoveSpec = () => {
            setFormData((prev: CreateDocsForm) => ({
              ...prev,
              attachments: prev?.attachments?.filter(
                (_, _index) => _index !== index
              ),
            }));
          };

          return (
            <div
              key={`attachment-${index}`}
              className="group relative p-5 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row gap-5 items-start">
                <div className="space-y-2 flex-1 w-full">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    <FileText className="h-3 w-3" />
                    Tên tệp tin
                  </div>
                  <Input
                    value={attachment.attachmentName}
                    placeholder="VD: Quy trình VietGAP.pdf"
                    id={`${attachment.attachmentName}-${index}`}
                    onChange={handleChangeSpecValue("attachmentName")}
                    className="bg-background focus:bg-background h-10 shadow-none border-0 ring-1 ring-inset ring-input focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2 flex-1 w-full">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    <Link className="h-3 w-3" />
                    Liên kết tải về
                  </div>
                  <Input
                    placeholder="VD: https://...pdf"
                    value={attachment.attachmentValue}
                    id={`${attachment.attachmentValue}-${index}`}
                    onChange={handleChangeSpecValue("attachmentValue")}
                    className="bg-background focus:bg-background h-10 shadow-none border-0 ring-1 ring-inset ring-input focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="h-full pt-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveSpec}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        variant="outline"
        onClick={onAddAttachment}
        className="w-full flex items-center justify-center gap-2 h-12 border-dashed border-2 hover:bg-primary/5 hover:border-primary/50 transition-all rounded-xl font-medium"
      >
        <Plus className="h-4 w-4" />
        Thêm tài liệu đính kèm
      </Button>
    </div>
  );
}
