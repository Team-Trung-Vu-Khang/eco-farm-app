import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  StepperForm,
  Textarea,
  cn,
  useToast,
  type Step,
} from "@tankhang1/eco-shared-ui";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

import {
  Bug,
  CalendarDays,
  Check,
  FileText,
  Image as ImageIcon,
  Leaf,
  Plus,
  Search,
  ShieldCheck,
  Sprout,
  Trash,
  Upload,
} from "lucide-react";

import {
  CROP_HIERARCHY,
  categories,
  harvestMethodOptions,
  initialEditorValue,
  seedData,
  stageOptions,
} from "./mocks";
import type { CreateCropForm, GrowthCycleDetail } from "./types";

export default function CropCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateCropForm>({
    code: "TREE-" + Math.floor(1000 + Math.random() * 9000),
    name: "",
    cropGroup: "",
    cropType: "",
    variety: "",
    illustration: null,
    description: "",
    selectedSeedIds: [],
    harvestMethod: "manual",
    growthCycles: [
      {
        id: "1",
        name: "Kiến thiết cơ bản",
        stages: ["Gieo hạt", "Cây con"],
        estimatedDays: "10",
      },
    ],
    docs: {
      farmingTechnique: {
        type: "editor",
        content: initialEditorValue,
        file: null,
      },
      qualityStandard: {
        type: "editor",
        content: initialEditorValue,
        file: null,
      },
    },
  });
  const [seedSearch, setSeedSearch] = useState("");

  const [illustrationPreview, setIllustrationPreview] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!formData.illustration) {
      setIllustrationPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setIllustrationPreview(reader.result as string);
    };
    reader.readAsDataURL(formData.illustration);
  }, [formData.illustration]);

  const handleUpdateField = (field: keyof CreateCropForm, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "cropGroup") {
        newData.cropType = "";
        newData.variety = "";
      } else if (field === "cropType") {
        newData.variety = "";
      }
      return newData;
    });
  };

  const handleAddGrowthCycle = () => {
    const newId = (formData.growthCycles.length + 1).toString();
    setFormData((prev) => ({
      ...prev,
      growthCycles: [
        ...prev.growthCycles,
        { id: newId, name: "", stages: [], estimatedDays: "" },
      ],
    }));
  };

  const handleRemoveGrowthCycle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      growthCycles: prev.growthCycles.filter((c) => c.id !== id),
    }));
  };

  const handleUpdateGrowthCycle = (
    id: string,
    updates: Partial<GrowthCycleDetail>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      growthCycles: prev.growthCycles.map((c) =>
        c.id === id ? { ...c, ...updates } : c,
      ),
    }));
  };

  const handleComplete = () => {
    toast({
      title: "Thành công",
      description: `Đã tạo cây trồng "${formData.name}"`,
    });
    setLocation("/crop");
  };

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cây",
      content: (
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-green-500 pl-4 py-1 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Thông tin cơ bản
              </h3>
              <p className="text-sm text-muted-foreground">
                Mã định danh, tên gọi và phân loại cây trồng
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Mã cây *</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) => handleUpdateField("code", e.target.value)}
                    placeholder="VD: TREE-7867"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Tên cây *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleUpdateField("name", e.target.value)}
                    placeholder="Nhập tên cây trồng"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Nhóm cây trồng
                  </Label>
                  <Select
                    value={formData.cropGroup}
                    onValueChange={(v) => handleUpdateField("cropGroup", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhóm" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Loại cây *</Label>
                  <Select
                    value={formData.cropType}
                    onValueChange={(v) => handleUpdateField("cropType", v)}
                    disabled={!formData.cropGroup}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          formData.cropGroup
                            ? "Chọn loại cây"
                            : "Vui lòng chọn nhóm"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.cropGroup &&
                        Object.keys(
                          CROP_HIERARCHY[formData.cropGroup] || {},
                        ).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Giống cây *</Label>
                <Select
                  value={formData.variety}
                  onValueChange={(v) => handleUpdateField("variety", v)}
                  disabled={!formData.cropType}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        formData.cropType
                          ? "Chọn giống cây"
                          : "Vui lòng chọn loại cây"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.cropGroup &&
                      formData.cropType &&
                      (
                        CROP_HIERARCHY[formData.cropGroup]?.[
                          formData.cropType
                        ] || []
                      ).map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Phương pháp thu hoạch *
                </Label>
                <Select
                  value={formData.harvestMethod}
                  onValueChange={(v) => handleUpdateField("harvestMethod", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phương pháp" />
                  </SelectTrigger>
                  <SelectContent>
                    {harvestMethodOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Ảnh cây trồng</Label>
                <div
                  className={cn(
                    "relative group w-full aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-green-500/50 hover:bg-muted/50 overflow-hidden",
                    illustrationPreview && "border-none",
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {illustrationPreview ? (
                    <img
                      src={illustrationPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-6 h-6 text-muted-foreground/60" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Kéo thả ảnh tại đây
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) =>
                      handleUpdateField("illustration", e.target.files?.[0])
                    }
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Mô tả</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleUpdateField("description", e.target.value)
                  }
                  placeholder="Nhập mô tả về cây trồng"
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      ),
      isValid:
        formData.code.length > 0 &&
        formData.name.length > 0 &&
        formData.cropType.length > 0 &&
        formData.variety.length > 0,
    },
    {
      id: "seeds",
      title: "Hạt giống",
      content: (
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-4 py-1 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Bug className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Danh sách hạt giống
              </h3>
              <p className="text-sm text-muted-foreground">
                Lựa chọn hạt giống phù hợp cho loại cây trồng này
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Tìm tên giống, mã hoặc nhà cung cấp..."
                value={seedSearch}
                onChange={(e) => setSeedSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {seedData.filter(
                (seed) =>
                  seed.varietyName
                    .toLowerCase()
                    .includes(seedSearch.toLowerCase()) ||
                  seed.varietyCode
                    .toLowerCase()
                    .includes(seedSearch.toLowerCase()) ||
                  seed.supplier
                    .toLowerCase()
                    .includes(seedSearch.toLowerCase()),
              ).length > 0 ? (
                seedData
                  .filter(
                    (seed) =>
                      seed.varietyName
                        .toLowerCase()
                        .includes(seedSearch.toLowerCase()) ||
                      seed.varietyCode
                        .toLowerCase()
                        .includes(seedSearch.toLowerCase()) ||
                      seed.supplier
                        .toLowerCase()
                        .includes(seedSearch.toLowerCase()),
                  )
                  .map((seed) => (
                    <Card
                      key={seed.id}
                      className={cn(
                        "group relative overflow-hidden transition-all hover:shadow-md cursor-pointer border-2",
                        formData.selectedSeedIds.includes(seed.id)
                          ? "border-green-600 ring-2 ring-green-600/10"
                          : "border-transparent",
                      )}
                      onClick={() => {
                        const current = formData.selectedSeedIds;
                        handleUpdateField(
                          "selectedSeedIds",
                          current.includes(seed.id)
                            ? current.filter((i) => i !== seed.id)
                            : [...current, seed.id],
                        );
                      }}
                    >
                      <div className="aspect-4/3 overflow-hidden">
                        <img
                          src={seed.illustration}
                          alt={seed.varietyName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-green-700">
                              {seed.varietyName}
                            </h4>
                            <p className="text-[10px] text-muted-foreground font-mono uppercase">
                              MÃ: {seed.varietyCode}
                            </p>
                          </div>
                          {formData.selectedSeedIds.includes(seed.id) && (
                            <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Sprout className="w-3 h-3" />
                            <span>Nhà cung cấp: {seed.supplier}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 font-medium">
                            <span>
                              Tỷ lệ nảy mầm:{" "}
                              <span className="text-green-600">
                                {seed.germinationRate}
                              </span>
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center bg-muted/20 border-2 border-dashed rounded-2xl border-muted-foreground/10">
                  <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground">
                    Không tìm thấy hạt giống
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
                    Thử thay đổi từ khóa tìm kiếm hoặc kiểm tra lại tên giống,
                    mã hạt giống.
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-4 text-green-600 font-bold"
                    onClick={() => setSeedSearch("")}
                  >
                    Xóa tìm kiếm
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      isValid: formData.selectedSeedIds.length > 0,
    },
    {
      id: "growth",
      title: "Sinh trưởng",
      content: (
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4 py-1 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Chu kỳ sinh trưởng
              </h3>
              <p className="text-sm text-muted-foreground">
                Định nghĩa các giai đoạn phát triển chi tiết
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {formData.growthCycles.map((cycle, index) => (
              <Card
                key={cycle.id}
                className="relative overflow-hidden border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50"
              >
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <h4 className="font-bold text-foreground text-lg">
                        Chu kỳ phát triển
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveGrowthCycle(cycle.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        Tên chu kỳ
                      </Label>
                      <Select
                        value={cycle.name}
                        onValueChange={(v) =>
                          handleUpdateGrowthCycle(cycle.id, { name: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chu kỳ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kiến thiết cơ bản">
                            Kiến thiết cơ bản
                          </SelectItem>
                          <SelectItem value="Kinh doanh">Kinh doanh</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        Thời gian ước tính (ngày)
                      </Label>
                      <Input
                        type="number"
                        value={cycle.estimatedDays}
                        onChange={(e) =>
                          handleUpdateGrowthCycle(cycle.id, {
                            estimatedDays: e.target.value,
                          })
                        }
                        placeholder="VD: 10"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-semibold">
                        Giai đoạn chi tiết
                      </Label>
                      <MultiSelect
                        options={stageOptions}
                        placeholder="Chọn các giai đoạn"
                        value={cycle.stages}
                        onChange={(v) =>
                          handleUpdateGrowthCycle(cycle.id, { stages: v })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              variant="outline"
              className="w-full h-12 border-dashed border-2 hover:bg-green-50 hover:border-green-500/50 text-green-600 font-bold rounded-xl transition-all"
              onClick={handleAddGrowthCycle}
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm chu kỳ sinh trưởng mới
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "docs",
      title: "Tài liệu",
      content: (
        <div className="space-y-12">
          {["farmingTechnique", "qualityStandard"].map((docKey) => {
            const doc = formData.docs[docKey as keyof typeof formData.docs];
            const isFarming = docKey === "farmingTechnique";
            return (
              <div key={docKey} className="space-y-6">
                <div
                  className={cn(
                    "flex items-center gap-3 border-l-4 pl-4 py-1",
                    isFarming ? "border-green-500" : "border-blue-500",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      isFarming
                        ? "bg-green-50 text-green-600"
                        : "bg-blue-50 text-blue-600",
                    )}
                  >
                    {isFarming ? (
                      <Leaf className="h-6 w-6" />
                    ) : (
                      <ShieldCheck className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {isFarming
                        ? "Kỹ thuật canh tác"
                        : "Tiêu chuẩn chất lượng"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isFarming
                        ? "Quy trình làm đất, bón phân, tưới nước và chăm sóc định kỳ"
                        : "Các tiêu chí VietGAP, GlobalGAP, tiêu chuẩn xuất khẩu..."}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <RadioGroup
                    value={doc.type}
                    onValueChange={(v) => {
                      const newDocs = { ...formData.docs };
                      (
                        newDocs[docKey as keyof typeof formData.docs] as any
                      ).type = v;
                      handleUpdateField("docs", newDocs);
                    }}
                    className="flex items-center gap-6 pl-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="editor" id={`${docKey}-editor`} />
                      <Label
                        htmlFor={`${docKey}-editor`}
                        className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Soạn thảo nội dung
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pdf" id={`${docKey}-pdf`} />
                      <Label
                        htmlFor={`${docKey}-pdf`}
                        className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload PDF
                      </Label>
                    </div>
                  </RadioGroup>

                  {doc.type === "editor" ? (
                    <Card className="overflow-hidden border-2 focus-within:border-green-500/50 transition-all shadow-sm">
                      <Editor
                        maxLength={10000}
                        contentEditableClassname="h-[200px] p-4 focus:outline-none bg-white font-sans text-sm"
                        editorSerializedState={doc.content}
                        onSerializedChange={(content) => {
                          const newDocs = { ...formData.docs };
                          (
                            newDocs[docKey as keyof typeof formData.docs] as any
                          ).content = content;
                          handleUpdateField("docs", newDocs);
                        }}
                      />
                    </Card>
                  ) : (
                    <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5 text-muted-foreground/60" />
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        Click để tải lên PDF
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hỗ trợ định dạng .pdf, dung lượng tối đa 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      content: (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Xác nhận thông tin cây trồng
            </h3>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Vui lòng kiểm tra kỹ tất cả các thông tin đã nhập trước khi hoàn
              tất quá trình khởi tạo cây trồng mới.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50">
              <CardHeader className="bg-zinc-50/50 border-b border-zinc-100/50">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-green-700">
                  <Sprout className="w-4 h-4" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-sm">
                {[
                  { label: "Mã cây", value: formData.code },
                  { label: "Tên cây", value: formData.name },
                  { label: "Nhóm", value: formData.cropGroup },
                  { label: "Loại cây", value: formData.cropType },
                  { label: "Giống", value: formData.variety },
                  { label: "Thu hoạch", value: formData.harvestMethod },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center py-1.5 border-b border-dashed last:border-0 border-zinc-100"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-bold text-foreground uppercase tracking-wide">
                      {item.value || "---"}
                    </span>
                  </div>
                ))}

                <div className="pt-2 border-t border-zinc-100 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Hạt giống được chọn
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {seedData
                      .filter((s) => formData.selectedSeedIds.includes(s.id))
                      .map((seed) => (
                        <div
                          key={seed.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50/50 ring-1 ring-zinc-100"
                        >
                          <img
                            src={seed.illustration}
                            className="w-8 h-8 rounded object-cover shadow-sm"
                            alt=""
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-[11px] text-foreground">
                              {seed.varietyName}
                            </span>
                            <span className="text-[9px] text-muted-foreground uppercase">
                              {seed.varietyCode}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50">
              <CardHeader className="bg-zinc-50/50 border-b border-zinc-100/50">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-green-700">
                  <CalendarDays className="w-4 h-4" />
                  Cấu trúc sinh trưởng
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-[11px] font-bold">
                  <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full ring-1 ring-green-600/20 uppercase tracking-wider">
                    {formData.growthCycles.length} Chu kỳ
                  </div>
                  <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full ring-1 ring-blue-600/20 uppercase tracking-wider">
                    {formData.selectedSeedIds.length} Hạt giống
                  </div>
                </div>
                <div className="space-y-3">
                  {formData.growthCycles.map((c, i) => (
                    <div
                      key={c.id}
                      className="p-3 bg-zinc-50/50 rounded-lg ring-1 ring-zinc-200/50 flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Chu kỳ {i + 1}
                        </span>
                        <span className="font-bold text-foreground">
                          {c.name || "---"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-green-600">
                          {c.estimatedDays || "0"}
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-1 font-medium">
                          ngày
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50 overflow-hidden">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100/50">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-green-700">
                <FileText className="w-4 h-4" />
                Hệ thống tài liệu
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 gap-8">
              {[
                { label: "Kỹ thuật canh tác", key: "farmingTechnique" },
                { label: "Tiêu chuẩn chất lượng", key: "qualityStandard" },
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {item.label}
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-zinc-50/50 rounded-md ring-1 ring-zinc-100 text-xs">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        (formData.docs as any)[item.key].type === "editor"
                          ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                          : "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]",
                      )}
                    />
                    <span className="font-bold text-foreground">
                      {(formData.docs as any)[item.key].type.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Thêm mới cây trồng"
      description="Khởi tạo cây trồng mới với đầy đủ thông tin sinh trưởng và tài liệu"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            completeLabel="Khởi tạo cây trồng"
            onCancel={() => setLocation("/crop")}
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
