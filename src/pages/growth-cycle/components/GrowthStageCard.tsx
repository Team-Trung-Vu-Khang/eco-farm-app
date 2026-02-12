import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  Editor,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Button,
} from "@tankhang1/eco-shared-ui";
import { Trash, Upload, FileText } from "lucide-react";
import type { GrowthStage } from "../types";

interface GrowthStageCardProps {
  stage: GrowthStage;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<GrowthStage>) => void;
}

export const GrowthStageCard = ({
  stage,
  index,
  onRemove,
  onUpdate,
}: GrowthStageCardProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type === "application/pdf") {
      onUpdate(stage.id, { pdfFile: file });
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  return (
    <Card className="relative overflow-hidden border-2 focus-within:border-primary/50 transition-all">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              {index + 1}
            </div>
            <h3 className="font-bold text-lg">Giai đoạn {index + 1}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onRemove(stage.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Tên giai đoạn</Label>
            <Input
              value={stage.name}
              onChange={(e) => onUpdate(stage.id, { name: e.target.value })}
              placeholder="VD: Giai đoạn 1"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Thời gian (ngày)</Label>
            <Input
              type="number"
              value={stage.duration || ""}
              onChange={(e) =>
                onUpdate(stage.id, { duration: Number(e.target.value) })
              }
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-semibold">Tài liệu kỹ thuật</Label>
          <RadioGroup
            value={stage.usePdf ? "pdf" : "editor"}
            onValueChange={(v) => onUpdate(stage.id, { usePdf: v === "pdf" })}
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="pdf" id={`pdf-${stage.id}`} />
              <Label
                htmlFor={`pdf-${stage.id}`}
                className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                Tải lên PDF
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="editor" id={`editor-${stage.id}`} />
              <Label
                htmlFor={`editor-${stage.id}`}
                className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                Soạn thảo
              </Label>
            </div>
          </RadioGroup>
        </div>

        {!stage.usePdf ? (
          <div className="border rounded-lg overflow-hidden bg-muted/5">
            <Editor
              maxLength={10000}
              contentEditableClassname="h-[200px] p-4 focus:outline-none bg-white"
              editorSerializedState={stage.content}
              onSerializedChange={(content) => onUpdate(stage.id, { content })}
            />
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5"
                : "bg-muted/20 hover:bg-muted/30 border-muted"
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
            {stage.pdfFile &&
            (stage.pdfFile instanceof File || (stage.pdfFile as any).name) ? (
              <div className="flex flex-col items-center animate-in zoom-in duration-300">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-2">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  {stage.pdfFile instanceof File
                    ? stage.pdfFile.name
                    : (stage.pdfFile as any).name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Đã chọn thành công. Nhấn để thay đổi.
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">
                  Kéo thả hoặc nhấn để tải lên tệp PDF
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Dung lượng tối đa 10MB
                </p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
