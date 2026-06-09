import {
  AdminLayout,
  Card,
  CardContent,
  StepperForm,
  type Step,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { SeedDetailsStep } from "./components/SeedDetailsStep";
import { SeedDocumentationStep } from "./components/SeedDocumentationStep";
import { SeedReviewStep } from "./components/SeedReviewStep";
import { SeedSelectionStep } from "./components/SeedSelectionStep";
import type { CreateVarietyForm } from "./types/types";
import useSeedStore from "../../stores/useSeedStore";
import { filterSuppliers, MAX_IMAGE_SIZE } from "./utils/utils";
import { mockSuppliers } from "./data/mocks";

export default function CreateSeedPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addSeed } = useSeedStore();

  const [selectedCropGroup, setSelectedCropGroup] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
  const [baseIllustrationPreview, setBaseIllustrationPreview] = useState("");
  const [formData, setFormData] = useState<CreateVarietyForm>({
    varietyCode: "",
    varietyName: "",
    cropGroup: "",
    crop: "",
    supplier: "",
    origin: "",
    germinationRate: 0,
    uniformity: 0,
    yield: "",
    description: "",
    illustration: null,
    expiryDate: undefined,
    contentType: "pdf",
    pdfFile: null,
    editorContent: "",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  const filteredSuppliers = filterSuppliers(mockSuppliers, supplierSearchQuery);

  const onPickIllustration = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Lỗi", description: "Vui lòng chọn file ảnh." });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast({ title: "Lỗi", description: "Ảnh quá lớn (tối đa 5MB)." });
      return;
    }
    setFormData((currentForm) => ({ ...currentForm, illustration: file }));
  };

  const illustrationPreview = useMemo(() => {
    if (!formData.illustration) {
      return baseIllustrationPreview;
    }
    return URL.createObjectURL(formData.illustration);
  }, [baseIllustrationPreview, formData.illustration]);

  const handleComplete = () => {
    addSeed(formData);
    toast({
      title: "Thành công",
      description: `Đã tạo hạt giống "${formData.varietyName}"`,
    });
    setLocation("/seed");
  };

  const steps: Step[] = [
    {
      id: "selection",
      title: "Chọn giống cây",
      description: "Lựa chọn loại cây và giống cây cần nhập kho",
      content: (
        <SeedSelectionStep
          formData={formData}
          selectedCrop={selectedCrop}
          selectedCropGroup={selectedCropGroup}
          selectedVariety={selectedVariety}
          setFormData={setFormData}
          setIllustrationPreview={setBaseIllustrationPreview}
          setSelectedCrop={setSelectedCrop}
          setSelectedCropGroup={setSelectedCropGroup}
          setSelectedVariety={setSelectedVariety}
        />
      ),
      isValid: !!selectedCropGroup && !!selectedCrop && !!selectedVariety,
    },
    {
      id: "details",
      title: "Chi tiết lô giống",
      description: "Thông tin nhà cung cấp và thông số kỹ thuật",
      content: (
        <SeedDetailsStep
          fileInputRef={fileInputRef}
          filteredSuppliers={filteredSuppliers}
          formData={formData}
          illustrationPreview={illustrationPreview}
          onPickIllustration={onPickIllustration}
          selectedSupplierId={selectedSupplierId}
          setFormData={setFormData}
          setSelectedSupplierId={setSelectedSupplierId}
          setSupplierSearchQuery={setSupplierSearchQuery}
          showExpiryDate
          supplierSearchQuery={supplierSearchQuery}
          showYieldField={false}
        />
      ),
      isValid: !!formData.supplier && !!formData.expiryDate,
    },
    {
      id: "docs",
      title: "Tài liệu kỹ thuật",
      description: "Cung cấp tài liệu hướng dẫn trồng và chăm sóc",
      content: (
        <SeedDocumentationStep
          formData={formData}
          pdfInputRef={pdfInputRef}
          setFormData={setFormData}
        />
      ),
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra lại thông tin trước khi tạo",
      content: (
        <SeedReviewStep
          formData={formData}
          illustrationPreview={illustrationPreview}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title="Tạo mới hạt giống"
      description="Thêm mới hạt giống vào danh mục hệ thống"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            completeLabel="Hoàn tất & Tạo giống"
            onCancel={() => setLocation("/seed")}
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
