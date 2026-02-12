import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tankhang1/eco-shared-ui";
import type { Treatment } from "../types/treatment.types";
import { cropTypes, crops, varieties, diseases } from "../data/treatment.data";

interface TreatmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Treatment | null;
  onSubmit: (data: Partial<Treatment>) => void;
}

export function TreatmentForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: TreatmentFormProps) {
  const [formData, setFormData] = useState<Partial<Treatment>>({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        // Reset for create mode
        setFormData({
          severity: "M2",
          steps: [],
          images: [],
          videoUrl: "",
        });
      }
    }
  }, [open, initialData]);

  const handleChange = (field: keyof Treatment, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  // Helper to safely get crop options
  const availableCrops =
    formData.cropType && crops[formData.cropType as keyof typeof crops]
      ? crops[formData.cropType as keyof typeof crops]
      : [];

  const availableVarieties =
    formData.crop && varieties[formData.crop as keyof typeof varieties]
      ? varieties[formData.crop as keyof typeof varieties]
      : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Chỉnh sửa phác đồ" : "Thêm mới phác đồ"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Section 1: Thông tin chung */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2">
              Thông tin chung
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên phác đồ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Ví dụ: Phác đồ trị bệnh thán thư..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">
                  Mã phác đồ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  value={formData.code || ""}
                  onChange={(e) => handleChange("code", e.target.value)}
                  placeholder="PT..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => handleChange("status", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang áp dụng</SelectItem>
                    <SelectItem value="inactive">Ngưng áp dụng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mức độ nghiêm trọng</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(val) => handleChange("severity", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M0">M0 - Phòng</SelectItem>
                    <SelectItem value="M1">M1 - Chớm</SelectItem>
                    <SelectItem value="M2">M2 - Vừa</SelectItem>
                    <SelectItem value="M3">M3 - Nặng</SelectItem>
                    <SelectItem value="M4">M4 - Khủng hoảng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Đánh giá an toàn</Label>
                <Select
                  value={formData.safetyRating}
                  onValueChange={(val) => handleChange("safetyRating", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 2: Đối tượng áp dụng */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2">
              Đối tượng áp dụng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loại cây trồng</Label>
                <Select
                  value={formData.cropType}
                  onValueChange={(val) => {
                    handleChange("cropType", val);
                    handleChange("crop", ""); // Reset child
                    handleChange("variety", "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại cây" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((t) => (
                      <SelectItem key={t.id} value={t.name}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cây trồng</Label>
                <Select
                  value={formData.crop}
                  onValueChange={(val) => {
                    handleChange("crop", val);
                    handleChange("variety", "");
                  }}
                  disabled={!formData.cropType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cây trồng" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCrops.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Giống (Variety)</Label>
                <Select
                  value={formData.variety}
                  onValueChange={(val) => handleChange("variety", val)}
                  disabled={!formData.crop}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giống" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVarieties.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bệnh / Sâu hại</Label>
                <Select
                  value={formData.disease}
                  onValueChange={(val) => handleChange("disease", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn bệnh" />
                  </SelectTrigger>
                  <SelectContent>
                    {diseases.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Giai đoạn sinh trưởng</Label>
                <Input
                  value={formData.stage || ""}
                  onChange={(e) => handleChange("stage", e.target.value)}
                  placeholder="Ví dụ: Ra hoa, Đậu quả..."
                />
              </div>
            </div>
          </div>

          {/* Section 3: Thông tin kỹ thuật */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2">
              Thông tin kỹ thuật
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tác giả</Label>
                <Input
                  value={formData.author || ""}
                  onChange={(e) => handleChange("author", e.target.value)}
                  placeholder="Tên chuyên gia/kỹ sư"
                />
              </div>
              <div className="space-y-2">
                <Label>Chức danh</Label>
                <Input
                  value={formData.authorTitle || ""}
                  onChange={(e) => handleChange("authorTitle", e.target.value)}
                  placeholder="Ví dụ: Kỹ sư nông nghiệp"
                />
              </div>
              <div className="space-y-2">
                <Label>Video Hướng dẫn (YouTube URL)</Label>
                <Input
                  value={formData.videoUrl || ""}
                  onChange={(e) => handleChange("videoUrl", e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Tổng chi phí ước tính</Label>
                <Input
                  value={formData.totalCost || ""}
                  onChange={(e) => handleChange("totalCost", e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {initialData ? "Lưu thay đổi" : "Tạo phác đồ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
