import { type ChangeEvent } from "react";
import {
  Input,
  Label,
  MultiSelect,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { keywordOptions, seasonOptions } from "../../mocks";
import type { CreateDocsForm } from "../../types";

interface BasicInfoStepProps {
  formData: CreateDocsForm;
  setFormData: (data: any) => void;
  handleChangeValue: (key: keyof CreateDocsForm) => (e: ChangeEvent<HTMLInputElement> | Array<string>) => void;
}

export function BasicInfoStep({ formData, setFormData, handleChangeValue }: BasicInfoStepProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="id" className="text-sm font-semibold">
            Mã mẫu
          </Label>
          <Input
            id="id"
            value={formData.id}
            placeholder="VD: TL001"
            onChange={handleChangeValue("id")}
            className="bg-muted/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Phạm vi áp dụng</Label>
            <p className="text-sm text-muted-foreground">
              Tài liệu này áp dụng cho đối tượng nào?
            </p>
          </div>

          <RadioGroup
            value={formData.scope}
            onValueChange={(v: "crop" | "variety" | "category") =>
              setFormData((prev: CreateDocsForm) => ({ ...prev, scope: v, variety: "" }))
            }
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div
              className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.scope === "crop"
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-muted hover:border-primary/50 hover:bg-muted/50"
              }`}
              onClick={() => setFormData((prev: CreateDocsForm) => ({ ...prev, scope: "crop", variety: "" }))}
            >
              <div className="flex items-center gap-2 mb-2">
                <RadioGroupItem value="crop" id="scope-crop" />
                <Label htmlFor="scope-crop" className="font-bold cursor-pointer">
                  Theo Loại Cây
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Áp dụng chung cho tất cả các giống thuộc loại cây này (VD: Tất cả cây Sầu Xa).
              </p>
            </div>

            <div
              className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.scope === "variety"
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-muted hover:border-primary/50 hover:bg-muted/50"
              }`}
              onClick={() => setFormData((prev: CreateDocsForm) => ({ ...prev, scope: "variety" }))}
            >
              <div className="flex items-center gap-2 mb-2">
                <RadioGroupItem value="variety" id="scope-variety" />
                <Label htmlFor="scope-variety" className="font-bold cursor-pointer">
                  Theo Giống Cụ Thể
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Chỉ áp dụng cho một giống cụ thể (VD: Chỉ Sầu riêng Ri6).
              </p>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>
              Loại cây trồng <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.cropId}
              onValueChange={(v) => setFormData((prev: CreateDocsForm) => ({ ...prev, cropId: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại cây trồng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="durian">Sầu riêng</SelectItem>
                <SelectItem value="rice">Lúa</SelectItem>
                <SelectItem value="coffee">Cà phê</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.scope === "variety" && (
            <div className="space-y-2">
              <Label>
                Giống cây trồng <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.variety}
                onValueChange={(v) => setFormData((prev: CreateDocsForm) => ({ ...prev, variety: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giống cây" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ri6">Ri6</SelectItem>
                  <SelectItem value="monthong">Monthong</SelectItem>
                  <SelectItem value="st25">ST25</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <Separator className="opacity-50" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Mùa vụ</Label>
          <MultiSelect
            options={seasonOptions}
            value={formData.season}
            placeholder="Chọn mùa vụ áp dụng"
            emptyText="Không tìm thấy mùa vụ"
            searchPlaceholder="Tìm mùa vụ..."
            onChange={handleChangeValue("season")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="applyLevel" className="text-sm font-semibold">
            Mức độ áp dụng (%)
          </Label>
          <Input
            min={0}
            max={100}
            type="number"
            id="applyLevel"
            inputMode="numeric"
            placeholder="VD: 35"
            value={
              Number.isFinite(formData.applyLevel)
                ? formData.applyLevel
                : undefined
            }
            onChange={(e) =>
              setFormData((prev: CreateDocsForm) => ({
                ...prev,
                applyLevel:
                  e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
          />
        </div>
      </div>

      <Separator className="opacity-50" />

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Từ khoá</Label>
          <MultiSelect
            options={keywordOptions}
            placeholder="Chọn từ khoá (phân loại, đặc tính...)"
            emptyText="Không tìm thấy từ khoá"
            value={formData.keywords ?? []}
            searchPlaceholder="Tìm từ khoá..."
            onChange={handleChangeValue("keywords")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quickSummary" className="text-sm font-semibold">
            Tóm tắt nhanh
          </Label>
          <p className="text-xs text-muted-foreground mb-2">
            Nhập các đặc điểm chính, mỗi dòng một mục.
          </p>
          <Textarea
            id="quickSummary"
            rows={4}
            value={formData.quickSummary}
            placeholder={`VD: Làm đất, lên líp, thoát nước tốt\nHữu cơ 10–15kg/gốc trước mùa mưa`}
            onChange={(e) =>
              setFormData((prev: CreateDocsForm) => ({ ...prev, quickSummary: e.target.value }))
            }
            className="resize-none"
          />
        </div>
      </div>
    </div>
  );
}
