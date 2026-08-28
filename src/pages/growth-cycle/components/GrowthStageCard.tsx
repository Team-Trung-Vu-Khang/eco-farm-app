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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Trash, Upload, FileText, Calendar } from "lucide-react";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useFormContext } from "react-hook-form";
import type { GrowthCycleFormValues } from "../schemas/growthCycleSchema";

interface GrowthStageCardProps {
  index: number;
  onRemove: () => void;
}

export const GrowthStageCard = ({ index, onRemove }: GrowthStageCardProps) => {
  const { watch, setValue, control } = useFormContext<GrowthCycleFormValues>();

  const stage = watch(`stages.${index}`);
  if (!stage) return null;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getDurationParts = () => {
    const duration = String(stage.duration || "");
    const yearMatch = duration.match(/(\d+)\s*năm/);
    const monthMatch = duration.match(/(\d+)\s*tháng/);
    const dayMatch = duration.match(/(\d+)\s*ngày/);

    const isRawNumber =
      !yearMatch &&
      !monthMatch &&
      !dayMatch &&
      !isNaN(Number(duration)) &&
      Number(duration) > 0;

    return {
      years: yearMatch ? yearMatch[1] : "",
      months: monthMatch ? monthMatch[1] : "",
      days: dayMatch ? dayMatch[1] : isRawNumber ? duration : "",
    };
  };

  const { years, months, days } = getDurationParts();

  const handleDurationChange = (
    type: "years" | "months" | "days",
    value: string,
  ) => {
    const cleanValue = value.replace(/\D/g, "");
    const newParts = { years, months, days, [type]: cleanValue };
    const parts = [];
    if (newParts.years && parseInt(newParts.years) > 0)
      parts.push(`${newParts.years} năm`);
    if (newParts.months && parseInt(newParts.months) > 0)
      parts.push(`${newParts.months} tháng`);
    if (newParts.days && parseInt(newParts.days) > 0)
      parts.push(`${newParts.days} ngày`);

    setValue(`stages.${index}.duration`, parts.join(" "), {
      shouldValidate: true,
    });
  };

  const pdfFileName =
    stage.pdfFile &&
    typeof stage.pdfFile === "object" &&
    "name" in stage.pdfFile
      ? stage.pdfFile.name
      : null;

  const handleFileChange = (file: File | null) => {
    if (file && file.type === "application/pdf") {
      setValue(`stages.${index}.pdfFile`, file, { shouldValidate: true });
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
            onClick={onRemove}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold" required>
              Tên giai đoạn
            </Label>
            <FormField
              control={control}
              name={`stages.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="VD: Giai đoạn 1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name={`stages.${index}.duration`}
            render={() => (
              <FormItem className="space-y-2">
                <Label className="text-sm font-semibold" required>
                  Thời gian
                </Label>
                <FormControl>
                  <div className="relative flex items-center h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 group">
                    <Calendar className="w-4 h-4 text-slate-400 mr-2 group-focus-within:text-primary transition-colors shrink-0" />
                    <div className="flex items-center gap-1 flex-1 justify-around">
                      <div className="flex items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={years}
                          onChange={(e) =>
                            handleDurationChange("years", e.target.value)
                          }
                          className="w-10 outline-none text-center bg-transparent p-0 placeholder:text-slate-300 [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-slate-500 text-xs shrink-0">
                          năm
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={months}
                          onChange={(e) =>
                            handleDurationChange("months", e.target.value)
                          }
                          className="w-10 outline-none text-center bg-transparent p-0 placeholder:text-slate-300 [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-slate-500 text-xs shrink-0">
                          tháng
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={days}
                          onChange={(e) =>
                            handleDurationChange("days", e.target.value)
                          }
                          className="w-10 outline-none text-center bg-transparent p-0 placeholder:text-slate-300 [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-slate-500 text-xs shrink-0">
                          ngày
                        </span>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-semibold">Tài liệu kỹ thuật</Label>
          <FormField
            control={control}
            name={`stages.${index}.usePdf`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value ? "pdf" : "editor"}
                    onValueChange={(v) => field.onChange(v === "pdf")}
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
                      <RadioGroupItem
                        value="editor"
                        id={`editor-${stage.id}`}
                      />
                      <Label
                        htmlFor={`editor-${stage.id}`}
                        className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Soạn thảo
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!stage.usePdf ? (
          <div className="border rounded-lg overflow-hidden bg-muted/5">
            <Editor
              maxLength={10000}
              initialHtml={stage.content}
              contentEditableClassname="h-[200px] p-4 focus:outline-none bg-white"
              onSerializedChange={async (content) => {
                const htmlContent = await safeConvertLexicalToHtml(content);
                setValue(`stages.${index}.content`, htmlContent, {
                  shouldValidate: true,
                });
              }}
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
            {stage.pdfFile && pdfFileName ? (
              <div className="flex flex-col items-center animate-in zoom-in duration-300">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-2">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  {pdfFileName}
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
