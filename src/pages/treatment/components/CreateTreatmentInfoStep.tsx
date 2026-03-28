import {
  Button,
  Card,
  Editor,
  Input,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Activity,
  Upload,
  X,
} from "lucide-react";
import { initialEditorValue } from "../../docs/mocks";
import {
  cropOptions,
  diseaseTypeOptions,
  growthStageOptions,
  tagOptions,
} from "../data/createTreatment.constants";
import type { CreateTreatmentFormData } from "../types/createTreatment.types";

interface CreateTreatmentInfoStepProps {
  formData: CreateTreatmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<CreateTreatmentFormData>>;
  illustrationPreview: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDropIllustration: (event: React.DragEvent<HTMLDivElement>) => void;
  onPickIllustration: (file?: File | null) => void;
}

export function CreateTreatmentInfoStep({
  formData,
  setFormData,
  illustrationPreview,
  fileInputRef,
  onDropIllustration,
  onPickIllustration,
}: CreateTreatmentInfoStepProps) {
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            Mã phác đồ <span className="text-destructive">*</span>
          </Label>
          <Input
            value={formData.id}
            onChange={(event) =>
              setFormData({ ...formData, id: event.target.value })
            }
            className="bg-muted/30"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            Tên phác đồ <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="VD: Quy trình quản lý Đạo ôn lá"
            value={formData.name}
            onChange={(event) =>
              setFormData({ ...formData, name: event.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Đối tượng cây trồng</Label>
            <Select
              value={formData.crop}
              onValueChange={(value) => setFormData({ ...formData, crop: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn cây" />
              </SelectTrigger>
              <SelectContent>
                {cropOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Giai đoạn sinh trưởng
            </Label>
            <Select
              value={formData.growthStage}
              onValueChange={(value) =>
                setFormData({ ...formData, growthStage: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giai đoạn" />
              </SelectTrigger>
              <SelectContent>
                {growthStageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            Đối tượng gây hại (Bệnh/Sâu)
          </Label>
          <Select
            value={formData.diseaseType}
            onValueChange={(value) =>
              setFormData({ ...formData, diseaseType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại bệnh" />
            </SelectTrigger>
            <SelectContent>
              {diseaseTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-l-4 border-primary pl-4 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <Label className="text-sm font-bold">Mô tả / Triệu chứng</Label>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                Dấu hiệu nhận biết & tình trạng
              </p>
            </div>
          </div>
          <Card className="overflow-hidden shadow-sm border-2 focus-within:border-primary/50 transition-all">
            <Editor
              maxLength={5000}
              contentEditableClassname="h-[180px] p-4 focus:outline-none"
              editorSerializedState={initialEditorValue}
            />
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Hình ảnh minh họa</Label>
          <div
            onDrop={onDropIllustration}
            onDragOver={(event) => event.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all h-[300px] cursor-pointer group overflow-hidden",
              illustrationPreview
                ? "border-primary/20 bg-primary/5 hover:border-primary/40"
                : "border-slate-200 hover:border-primary/50 hover:bg-slate-50",
            )}
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(event) => onPickIllustration(event.target.files?.[0])}
            />
            {!illustrationPreview ? (
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto text-primary transition-transform group-hover:scale-110">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Kéo & thả hoặc nhấn để tải lên
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                    JPG, PNG (Tối đa 5MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full p-4">
                <img
                  src={illustrationPreview}
                  className="w-full h-full object-cover rounded-xl shadow-sm"
                  alt="Preview"
                />
                <div className="absolute top-6 right-6 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full shadow-md"
                    onClick={(event: React.MouseEvent) => {
                      event.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-full shadow-md"
                    onClick={(event: React.MouseEvent) => {
                      event.stopPropagation();
                      setFormData({ ...formData, illustration: null });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Gắn thẻ (Tags)</Label>
          <MultiSelect
            options={tagOptions as unknown as { label: string; value: string }[]}
            value={formData.tags}
            onChange={(value) => setFormData({ ...formData, tags: value })}
            placeholder="Chọn thẻ..."
          />
        </div>
      </div>
    </div>
  );
}
