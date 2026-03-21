import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  Editor,
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
  StepperForm,
  Textarea,
  useToast, // Removed cn as it was unused and causing issues if not careful with imports vs usage
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { type ChangeEvent, useState } from "react";
import { useLocation } from "wouter";

import { FileText, Link, Plus, Trash } from "lucide-react";
import { initialEditorValue, keywordOptions, seasonOptions } from "./mocks";
import type {
  CreateDocsAttachment,
  CreateDocsForm,
  CreateDocsSpecification,
} from "./types";

const now = Date.now();

export default function CreateDocsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateDocsForm>({
    id: "TL001",
    season: [],
    keywords: [],
    scope: "crop",
    cropId: "",
    variety: "",
    crop: "Sầu riêng",
    quickSummary: "",
    specifications: [
      { specName: "Mật độ trồng", specValue: "6 x 6 m (≈278 cây/ha)" },
      { specName: "Độ pH đất", specValue: "5.5 – 6.5" },
      { specName: "Nước tưới", specValue: "3–5 lít/gốc/ngày (tuỳ thời tiết)" },
      { specName: "Phủ gốc", specValue: "Rơm khô/compost 5–10 cm" },
    ],
    createdAt: now,
    updatedAt: now,
    applyLevel: undefined,
  });

  const handleComplete = () => {
    console.log(formData);

    toast({
      title: "Thành công",
      description: `Đã tạo tài liệu "${formData.id}"`,
    });
    setLocation("/docs");
  };

  const handleChangeValue =
    (key: keyof typeof formData) =>
    (e: ChangeEvent<HTMLInputElement> | Array<string>) =>
      setFormData((prev) => ({
        ...prev,
        [key]: Array.isArray(e) ? e : e.target.value,
      }));

  const onAddSpecs = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [
        ...(prev?.specifications ?? []),
        { specName: "", specValue: "" },
      ],
    }));
  };

  const onAddAttachment = () => {
    setFormData((prev) => ({
      ...prev,
      attachments: [
        ...(prev?.attachments ?? []),
        { attachmentName: "", attachmentValue: "" },
      ],
    }));
  };

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin chung",
      description: "Các thông tin cần thiết cho tài liệu",
      content: (
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
                <Label className="text-base font-semibold">
                  Phạm vi áp dụng
                </Label>
                <p className="text-sm text-muted-foreground">
                  Tài liệu này áp dụng cho đối tượng nào?
                </p>
              </div>

              <RadioGroup
                value={formData.scope}
                onValueChange={(v: "crop" | "variety" | "category") =>
                  setFormData({ ...formData, scope: v, variety: "" })
                }
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {/* Option 1: Category (if needed, but user said "nhóm cây, loại cây, giống cây") -> Let's stick to "Loại cây" vs "Giống" for consistency with Growth Cycle, or add "Group" if requested. 
                        User said: "nhóm cây, loại cây hay giống cây". 
                        Let's support: "Crop Type" (Loại cây) and "Variety" (Giống). 
                        "Nhóm cây" could be a future enhancement or mapped to Category.
                        For now, let's align with Growth Cycle: Crop vs Variety.
                    */}

                <div
                  className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.scope === "crop"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-muted hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, scope: "crop", variety: "" })
                  }
                >
                  <div className="flex items-center gap-2 mb-2">
                    <RadioGroupItem value="crop" id="scope-crop" />
                    <Label
                      htmlFor="scope-crop"
                      className="font-bold cursor-pointer"
                    >
                      Theo Loại Cây
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Áp dụng chung cho tất cả các giống thuộc loại cây này (VD:
                    Tất cả cây Sầu Xa).
                  </p>
                </div>

                <div
                  className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.scope === "variety"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-muted hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() => setFormData({ ...formData, scope: "variety" })}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <RadioGroupItem value="variety" id="scope-variety" />
                    <Label
                      htmlFor="scope-variety"
                      className="font-bold cursor-pointer"
                    >
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
                  onValueChange={(v) => setFormData({ ...formData, cropId: v })}
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
                    onValueChange={(v) =>
                      setFormData({ ...formData, variety: v })
                    }
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
                  setFormData({
                    ...formData,
                    applyLevel:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
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
                  setFormData({ ...formData, quickSummary: e.target.value })
                }
                className="resize-none"
              />
            </div>
          </div>
        </div>
      ),
      isValid:
        formData.id.trim().length > 0 && formData.cropId.trim().length > 0,
    },
    {
      id: "specs",
      title: "Thông số",
      description: "Các thông số có trong tài liệu",
      content: (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="grid gap-4">
            {formData?.specifications?.map((spec, index) => {
              const handleChangeSpecValue =
                (key: keyof CreateDocsSpecification) =>
                (e: ChangeEvent<HTMLInputElement>) => {
                  const specClone = Array.from(formData?.specifications ?? []);
                  specClone[index] = {
                    ...specClone[index],
                    [key]: e.target.value,
                  };
                  setFormData((prev) => ({
                    ...prev,
                    specifications: specClone,
                  }));
                };

              const handleRemoveSpec = () => {
                setFormData((prev) => ({
                  ...prev,
                  specifications: prev?.specifications?.filter(
                    (_, _index) => _index !== index,
                  ),
                }));
              };

              return (
                <div
                  key={`spec-${index}`}
                  className="group relative p-4 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="space-y-1.5 flex-1 w-full">
                      <Label
                        htmlFor={`${spec.specName}-${index}`}
                        className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1"
                      >
                        Thông số
                      </Label>
                      <Input
                        value={spec.specName}
                        placeholder="VD: Độ pH, Mật độ..."
                        id={`${spec.specName}-${index}`}
                        onChange={handleChangeSpecValue("specName")}
                        className="bg-background focus:bg-background h-10 shadow-none border-0 ring-1 ring-inset ring-input focus-visible:ring-2 focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5 flex-1 w-full">
                      <Label
                        htmlFor={`${spec.specValue}-${index}`}
                        className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1"
                      >
                        Giá trị / Định mức
                      </Label>
                      <Input
                        value={spec.specValue}
                        placeholder="VD: 5.5 - 6.5, 6x6m..."
                        id={`${spec.specValue}-${index}`}
                        onChange={handleChangeSpecValue("specValue")}
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
            onClick={onAddSpecs}
            className="w-full flex items-center justify-center gap-2 h-12 border-dashed border-2 hover:bg-primary/5 hover:border-primary/50 transition-all rounded-xl font-medium"
          >
            <Plus className="h-4 w-4" />
            Thêm thông số kỹ thuật
          </Button>
        </div>
      ),
    },
    {
      id: "content",
      title: "Nội dung",
      description: "Nội dung tài liệu kỹ thuật",
      content: (
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">
                  Nội dung chi tiết
                </Label>
                <p className="text-sm text-muted-foreground">
                  Soạn thảo nội dung trực tiếp hoặc để trống nếu chỉ dùng file
                  đính kèm.
                </p>
              </div>
            </div>

            <Card className="min-h-[500px] border-2 shadow-sm">
              <Editor
                maxLength={50000}
                editorSerializedState={initialEditorValue}
                contentEditableClassname="min-h-[450px] p-6 focus:outline-none prose max-w-none"
              />
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "attachments",
      title: "Tài liệu đính kèm",
      content: (
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
                  setFormData((prev) => ({ ...prev, attachments: specClone }));
                };

              const handleRemoveSpec = () => {
                setFormData((prev) => ({
                  ...prev,
                  attachments: prev?.attachments?.filter(
                    (_, _index) => _index !== index,
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
      ),
    },
  ];

  return (
    <AdminLayout
      title="Tạo mới tài liệu kỹ thuât"
      description="Thêm tài liệu kỹ thuật vào danh mục hệ thống"
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/docs")}
            completeLabel="Tạo tài liệu kỹ thuật"
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
