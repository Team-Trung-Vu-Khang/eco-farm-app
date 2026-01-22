import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  Editor,
  Input,
  Label,
  MultiSelect,
  StepperForm,
  Textarea,
  useToast,
  type Step,
} from "@tankhang1/eco-shared-ui";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useLocation, useParams } from "wouter";

import { Plus, Trash } from "lucide-react";
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
    // TODO: UAT
    initialData.find((item) => item.id === params?.id),
  );

  const [illustrationPreview, setIllustrationPreview] = useState<string>("");

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
        <div className="max-w-5xl mx-auto space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">Mã mẫu</Label>
              <Input
                id="id"
                value={formData.id}
                placeholder="VD: TL001"
                onChange={handleChangeValue("id")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="crop">Cây trồng</Label>
              <Input
                id="crop"
                value={formData.crop}
                placeholder="VD: Sầu riêng"
                onChange={handleChangeValue("crop")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variety">Giống</Label>
              <Input
                id="variety"
                placeholder="VD: Ri6"
                value={formData.variety}
                onChange={handleChangeValue("variety")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mùa vụ</Label>
              <MultiSelect
                options={seasonOptions}
                value={formData.season}
                placeholder="Chọn mùa vụ"
                emptyText="Không tìm thấy"
                searchPlaceholder="Tìm mùa vụ..."
                onChange={handleChangeValue("season")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applyLevel">Mức độ áp dụng (%)</Label>
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

          <div className="space-y-2">
            <Label>Từ khoá</Label>
            <MultiSelect
              options={keywordOptions}
              placeholder="Chọn từ khoá"
              emptyText="Không tìm thấy"
              value={formData.keywords ?? []}
              searchPlaceholder="Tìm từ khoá..."
              onChange={handleChangeValue("keywords")}
            />
          </div>

          {/* Tóm tắt nhanh */}
          <div className="space-y-2">
            <Label htmlFor="quickSummary">
              Tóm tắt nhanh (mỗi dòng một mục)
            </Label>
            <Textarea
              id="quickSummary"
              rows={4}
              value={formData.quickSummary}
              placeholder={`Làm đất, lên líp, thoát nước tốt\nHữu cơ 10–15kg/gốc trước mùa mưa`}
              onChange={(e) =>
                setFormData({ ...formData, quickSummary: e.target.value })
              }
            />
          </div>

          {/* Ảnh minh hoạ */}
          <div className="space-y-2">
            <Label>Ảnh minh hoạ</Label>

            <div
              onDrop={onDropIllustration}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="relative flex items-center justify-center rounded-lg border border-dashed p-10 text-sm text-muted-foreground cursor-pointer"
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => onPickIllustration(e.target.files?.[0])}
              />

              {!illustrationPreview ? (
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border">
                    🖼️
                  </span>
                  <span>Kéo & thả ảnh (tối đa 5MB)</span>
                </div>
              ) : (
                <div className="w-full">
                  <img
                    src={illustrationPreview}
                    alt="Ảnh minh hoạ"
                    className="mx-auto max-h-56 rounded-md object-contain"
                  />
                  <div className="mt-3 flex justify-center gap-2">
                    <button
                      type="button"
                      className="text-sm underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Đổi ảnh
                    </button>
                    <button
                      type="button"
                      className="text-sm underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData((p) => ({ ...p, illustration: null }));
                      }}
                    >
                      Xoá ảnh
                    </button>
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
        <div className="max-w-5xl mx-auto space-y-5">
          {formData?.specifications?.map((spec, index) => {
            const handleChangeSpecValue =
              (key: keyof CreateDocsSpecification) =>
              (e: ChangeEvent<HTMLInputElement>) => {
                const specClone = Array.from(formData?.specifications ?? []);
                specClone[index] = {
                  ...specClone[index],
                  [key]: e.target.value,
                };
                setFormData((prev) => ({ ...prev, specifications: specClone }));
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
              <div key={`spec-${index}`} className="flex gap-3 items-end">
                <div className="space-y-1 flex-1">
                  <Label htmlFor={`${spec.specName}-${index}`}>Thông số</Label>
                  <Input
                    value={spec.specName}
                    placeholder="VD: Độ pH"
                    id={`${spec.specName}-${index}`}
                    onChange={handleChangeSpecValue("specName")}
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label htmlFor={`${spec.specValue}-${index}`}>Giá trị</Label>
                  <Input
                    value={spec.specValue}
                    placeholder="VD: 5.5 – 6.5"
                    id={`${spec.specValue}-${index}`}
                    onChange={handleChangeSpecValue("specValue")}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleRemoveSpec}
                >
                  <Trash />
                </Button>
              </div>
            );
          })}

          <Button
            variant="secondary"
            onClick={onAddSpecs}
            className="w-full align-bottom"
          >
            <Plus />
            Thêm thông số
          </Button>
        </div>
      ),
    },
    {
      id: "content",
      title: "Nội dung",
      description: "Nội dung tài liệu kỹ thuật",
      content: (
        <div className="max-w-10xl mx-auto space-y-6 flex flex-col gap-4">
          <div className="gap-3 flex flex-col">
            <Label>🌿 Kỹ thuật canh tác</Label>
            <Editor
              maxLength={10000}
              contentEditableClassname={"h-5"}
              editorSerializedState={initialEditorValue}
            />
          </div>
          <div className="gap-3 flex flex-col">
            <Label>🏷️ Tiêu chuẩn chất lượng</Label>
            <Editor
              maxLength={10000}
              contentEditableClassname={"h-5"}
              editorSerializedState={initialEditorValue}
            />
          </div>
          <div className="gap-3 flex flex-col">
            <Label>🐛 Sâu bệnh & Giải pháp</Label>
            <Editor
              maxLength={10000}
              contentEditableClassname={"h-5"}
              editorSerializedState={initialEditorValue}
            />
          </div>
        </div>
      ),
    },
    {
      id: "attachments",
      title: "Tài liệu đính kèm",
      content: (
        <div className="max-w-5xl mx-auto space-y-5">
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
                attachments: prev.attachments?.filter(
                  (_, _index) => _index !== index,
                ),
              }));
            };

            return (
              <div key={`spec-${index}`} className="flex gap-3 items-end">
                <div className="space-y-1 flex-1">
                  <Label htmlFor={`${attachment.attachmentName}-${index}`}>
                    Tên tệp
                  </Label>
                  <Input
                    value={attachment.attachmentName}
                    placeholder="VD: Quy trình VietGAP.pdf"
                    id={`${attachment.attachmentName}-${index}`}
                    onChange={handleChangeSpecValue("attachmentName")}
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label htmlFor={`${attachment.attachmentValue}-${index}`}>
                    Liên kết
                  </Label>
                  <Input
                    placeholder="VD: https://...pdf"
                    value={attachment.attachmentValue}
                    id={`${attachment.attachmentValue}-${index}`}
                    onChange={handleChangeSpecValue("attachmentValue")}
                  />
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={handleRemoveSpec}
                >
                  <Trash />
                </Button>
              </div>
            );
          })}

          <Button
            variant="secondary"
            onClick={onAddAttachment}
            className="w-full align-bottom"
          >
            <Plus />
            Thêm tài liệu đính kèm
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Cập nhật tài liệu kỹ thuât"
      description="Cập nhật tài liệu kỹ thuật"
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
