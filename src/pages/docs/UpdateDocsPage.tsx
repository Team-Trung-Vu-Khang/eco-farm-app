import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  Editor,
  Input,
  Label,
  MultiSelect,
  Separator,
  StepperForm,
  Textarea,
  cn,
  useToast,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useLocation, useParams } from "wouter";

import {
  Bug,
  FileText,
  Link,
  Plus,
  ShieldCheck,
  Sprout,
  Trash,
  Upload,
  X,
} from "lucide-react";
import {
  initialData,
  initialEditorValue,
  keywordOptions,
  seasonOptions,
} from "./mocks";
import type {
  CreateDocsAttachment,
  CreateDocsForm,
  CreateDocsSpecification,
} from "./types";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function UpdateDocsPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateDocsForm>(
    initialData.find((item) => item.id === params?.id) || {
      id: "",
      crop: "",
      variety: "",
      season: [],
      keywords: [],
      quickSummary: "",
      illustration: null,
      specifications: [],
      attachments: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  );

  const [illustrationPreview, setIllustrationPreview] = useState<string>("");
  const [cultivationContent, setCultivationContent] =
    useState<any>(initialEditorValue);
  const [qualityContent, setQualityContent] = useState<any>(initialEditorValue);
  const [pestContent, setPestContent] = useState<any>(initialEditorValue);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onPickIllustration = (file?: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "File không hợp lệ",
        description: "Vui lòng chọn file ảnh.",
      });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast({ title: "Ảnh quá lớn", description: "Tối đa 5MB." });
      return;
    }

    setFormData((prev) => ({ ...prev, illustration: file }));
  };

  const onDropIllustration = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    onPickIllustration(file);
  };

  useEffect(() => {
    if (!formData.illustration) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIllustrationPreview("");
      return;
    }
    const url = URL.createObjectURL(formData.illustration);
    setIllustrationPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [formData.illustration]);

  const handleComplete = () => {
    console.log(formData);

    toast({
      title: "Thành công",
      description: `Đã cập nhật tài liệu "${formData.id}"`,
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

            <div className="space-y-2">
              <Label htmlFor="crop" className="text-sm font-semibold">
                Cây trồng
              </Label>
              <Input
                id="crop"
                value={formData.crop}
                placeholder="VD: Sầu riêng"
                onChange={handleChangeValue("crop")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variety" className="text-sm font-semibold">
                Giống
              </Label>
              <Input
                id="variety"
                placeholder="VD: Ri6"
                value={formData.variety}
                onChange={handleChangeValue("variety")}
              />
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

          <Separator className="opacity-50" />

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Ảnh minh hoạ</Label>
              <p className="text-xs text-muted-foreground">
                Hình ảnh đại diện cho tài liệu kỹ thuật này.
              </p>
            </div>

            <div
              onDrop={onDropIllustration}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer overflow-hidden",
                illustrationPreview
                  ? "border-primary/20 bg-primary/5 hover:border-primary/40"
                  : "border-muted-foreground/20 hover:border-primary/50 hover:bg-accent/50",
              )}
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => onPickIllustration(e.target.files?.[0])}
              />

              {!illustrationPreview ? (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">
                      Kéo & thả hoặc nhấn để chọn ảnh
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Định dạng JPG, PNG, WebP (Tối đa 5MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full max-w-lg mx-auto">
                  <img
                    src={illustrationPreview}
                    alt="Ảnh minh hoạ"
                    className="mx-auto max-h-64 rounded-lg object-contain shadow-sm bg-white"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData((p) => ({ ...p, illustration: null }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      isValid:
        formData.id.trim().length > 0 &&
        formData.crop.trim().length > 0 &&
        formData.variety.trim().length > 0,
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
            <div className="flex items-center gap-3 border-l-4 border-green-500 pl-4 py-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Kỹ thuật canh tác
                </h3>
                <p className="text-sm text-muted-foreground">
                  Quy trình làm đất, bón phân, tưới nước và chăm sóc định kỳ
                </p>
              </div>
            </div>
            <Card className="overflow-hidden shadow-sm border-2 focus-within:border-green-500/50 transition-all">
              <Editor
                maxLength={10000}
                contentEditableClassname={"h-[200px] p-4 focus:outline-none"}
                editorSerializedState={cultivationContent}
                onSerializedChange={(state) => setCultivationContent(state)}
              />
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4 py-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Tiêu chuẩn chất lượng
                </h3>
                <p className="text-sm text-muted-foreground">
                  Các tiêu chí VietGAP, GlobalGAP, tiêu chuẩn xuất khẩu...
                </p>
              </div>
            </div>
            <Card className="overflow-hidden shadow-sm border-2 focus-within:border-blue-500/50 transition-all">
              <Editor
                maxLength={10000}
                contentEditableClassname={"h-[200px] p-4 focus:outline-none"}
                editorSerializedState={qualityContent}
                onSerializedChange={(state) => setQualityContent(state)}
              />
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-4 py-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Bug className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Sâu bệnh & Giải pháp
                </h3>
                <p className="text-sm text-muted-foreground">
                  Nhận diện các loại sâu bệnh hại và phương pháp phòng trừ hữu
                  cơ/hoá học
                </p>
              </div>
            </div>
            <Card className="overflow-hidden shadow-sm border-2 focus-within:border-amber-500/50 transition-all">
              <Editor
                maxLength={10000}
                editorSerializedState={pestContent}
                onSerializedChange={(state) => setPestContent(state)}
                contentEditableClassname={"h-[200px] p-4 focus:outline-none"}
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
      isDev={true}
      title="Cập nhật tài liệu kỹ thuât"
      description="Cập nhật tài liệu kỹ thuật"
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/docs")}
            completeLabel="Cập nhật tài liệu kỹ thuật"
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
