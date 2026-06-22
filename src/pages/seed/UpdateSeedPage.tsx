import useSeedStore from "@/stores/useSeedStore";
import {
  AdminLayout,
  Card,
  CardContent,
  StepperForm,
  type Step,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { mockSuppliers } from "./data/mocks";
import type { CreateVarietyForm } from "./types/types";
import { filterSuppliers, MAX_IMAGE_SIZE } from "./utils/utils";
import { SeedIdentityStep } from "./components/SeedIdentityStep";
import { SeedDetailsStep } from "./components/SeedDetailsStep";
import { SeedDocumentationStep } from "./components/SeedDocumentationStep";

export default function UpdateSeedPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { getSeedById, updateSeed } = useSeedStore();
  const seed = getSeedById(id || "");

  const [selectedSupplierId, setSelectedSupplierId] = useState(
    mockSuppliers.find((supplier) => supplier.name === seed?.supplier)?.id ||
      "",
  );
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
  const [baseIllustrationPreview] = useState(
    seed?.illustration && typeof seed.illustration === "string"
      ? seed.illustration
      : "",
  );
  const [formData, setFormData] = useState<CreateVarietyForm>({
    varietyCode: seed?.varietyCode || "SR-1112",
    varietyName: seed?.varietyName || "",
    crop: seed?.crop || "",
    supplier: seed?.supplier || "",
    origin: seed?.origin || "",
    germinationRate: seed?.germinationRate || 0,
    uniformity: seed?.uniformity || 0,
    yield: seed?.yield || "",
    description: seed?.description || "",
    illustration: null,
    contentType: "pdf",
    pdfFile: null,
    editorContent: seed?.editorContent || "",
    cropGroup: "",
    expiryDate: undefined,
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
    if (!id) return;

    const updateData: Partial<typeof seed> & {
      documents?: { name: string; url: string }[];
    } = {
      supplier: formData.supplier,
      origin: formData.origin,
      germinationRate: formData.germinationRate,
      uniformity: formData.uniformity,
      yield: formData.yield,
      description: formData.description,
      editorContent: formData.editorContent,
    };

    if (formData.illustration) {
      updateData.illustration = formData.illustration;
    }

    if (formData.contentType === "pdf" && formData.pdfFile) {
      updateData.documents = [
        {
          name: formData.pdfFile.name,
          url: URL.createObjectURL(formData.pdfFile),
        },
      ];
    }

    updateSeed(id, updateData);
    toast({
      title: "Thành công",
      description: `Đã cập nhật hạt giống "${formData.varietyName}"`,
    });
    setLocation(`/seed/${id}`, { replace: true });
  };

  const steps: Step[] = [
    {
      id: "identity",
      title: "Thông tin định danh",
      description: "Thông tin cơ bản về giống cây trồng (Không thể thay đổi)",
      content: <SeedIdentityStep formData={formData} />,
      isValid: true,
    },
    {
      id: "details",
      title: "Chi tiết & Thông số",
      description: "Cập nhật nhà cung cấp và thông số kỹ thuật",
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
          showSupplierMeta
          supplierSearchQuery={supplierSearchQuery}
        />
      ),
      isValid: true,
    },
    {
      id: "docs",
      title: "Tài liệu kỹ thuật",
      description: "Cập nhật tài liệu hướng dẫn kỹ thuật",
      content: (
        <SeedDocumentationStep
          compactMode
          formData={formData}
          pdfInputRef={pdfInputRef}
          setFormData={setFormData}
        />
      ),
      isValid: true,
    },
  ];

  return (
    <AdminLayout
      isRice
      title="Cập nhật hạt giống"
      description="Chỉnh sửa thông tin hạt giống trong hệ thống"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            completeLabel="Hoàn tất & Lưu"
            onCancel={() => setLocation(`/seed/${id}`)}
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
