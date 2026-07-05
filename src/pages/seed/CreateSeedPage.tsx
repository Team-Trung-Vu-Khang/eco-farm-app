import { useSeedMutations } from "@/features/farm";
import { useFileUpload } from "@/features/storage";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminLayout,
  Card,
  CardContent,
  Form,
  StepperForm,
  useToast,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import React from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useLocation } from "wouter";
import { SeedDetailsStep } from "./components/SeedDetailsStep";
import { SeedDocumentationStep } from "./components/SeedDocumentationStep";
import { SeedReviewStep } from "./components/SeedReviewStep";
import { SeedSelectionStep } from "./components/SeedSelectionStep";
import {
  createSeedSchema,
  type CreateSeedFormValues,
} from "./schemas/createSeedSchema";

export default function CreateSeedPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { createSeed } = useSeedMutations();
  const { uploadFile } = useFileUpload();

  const uploadedFilesCache = React.useRef<
    Map<File, { fileUrl: string; fileName?: string; sizeBytes?: number }>
  >(new Map());

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const methods = useForm<CreateSeedFormValues>({
    resolver: zodResolver(createSeedSchema),
    mode: "onChange",
    defaultValues: {
      cropGroupId: "",
      cropId: "",
      cropVarietyId: "",
      cropName: "",
      varietyName: "",
      varietyCode: "",
      supplierOrganizationId: "",
      supplierName: "",
      origin: "",
      yield: "",
      germinationRate: 0,
      uniformity: 0,
      description: "",
      editorContent: "",
      contentType: "pdf",
    },
  });

  const { handleSubmit, control, getValues } = methods;

  const selectionWatch = useWatch({
    control,
    name: ["cropGroupId", "cropId", "cropVarietyId"],
  });

  const detailsWatch = useWatch({
    control,
    name: ["supplierOrganizationId", "expiryDate"],
  });

  const pdfInputRef = React.useRef<HTMLInputElement | null>(null);

  // Mock formData and setFormData to not break SeedReviewStep
  const getMockFormData = () => {
    const vals = getValues();
    return {
      varietyCode: vals.varietyCode || "",
      varietyName: vals.varietyName || "",
      cropGroup: vals.cropGroupId,
      crop: vals.cropName || "",
      supplier: vals.supplierName || "",
      origin: vals.origin || "",
      germinationRate: vals.germinationRate || 0,
      uniformity: vals.uniformity || 0,
      yield: vals.yield || "",
      description: vals.description || "",
      illustration: vals.illustration,
      expiryDate: vals.expiryDate,
      contentType: vals.contentType || "pdf",
      pdfFile: vals.pdfFile,
      editorContent: vals.editorContent || "",
    };
  };

  const handleComplete = async (data: CreateSeedFormValues) => {
    setIsSubmitting(true);
    const cropVarietyId = Number(data.cropVarietyId);
    const supplierId = Number(data.supplierOrganizationId);

    const avgYieldFrom = data.avgYieldFrom || undefined;
    const avgYieldTo = data.avgYieldTo || undefined;

    try {
      let finalImageUrl = data.baseIllustrationUrl || undefined;
      if (data.illustration instanceof File) {
        if (uploadedFilesCache.current.has(data.illustration)) {
          finalImageUrl = uploadedFilesCache.current.get(
            data.illustration,
          )?.fileUrl;
        } else {
          const uploadRes = await uploadFile.mutateAsync({
            file: data.illustration,
            folder: "seeds-illustrations",
          });
          finalImageUrl = uploadRes.fileUrl;
          uploadedFilesCache.current.set(data.illustration, uploadRes);
        }
      }

      const documents: any[] = [];
      if (
        data.contentType === "pdf" &&
        data.pdfFile instanceof File &&
        data.pdfFile.size > 0
      ) {
        let pdfUrl: string | undefined;
        let pdfName: string | undefined;
        let pdfSize: number | undefined;

        if (uploadedFilesCache.current.has(data.pdfFile)) {
          const cached = uploadedFilesCache.current.get(data.pdfFile);
          pdfUrl = cached?.fileUrl;
          pdfName = cached?.fileName;
          pdfSize = cached?.sizeBytes;
        } else {
          const res = await uploadFile.mutateAsync({
            file: data.pdfFile,
            folder: "seeds-documents",
          });
          pdfUrl = res.fileUrl;
          pdfName = res.fileName || data.pdfFile.name;
          pdfSize = res.sizeBytes || data.pdfFile.size;
          uploadedFilesCache.current.set(data.pdfFile, res);
        }

        if (pdfUrl) {
          documents.push({
            documentType: "pdf",
            name: pdfName || "Tài liệu kỹ thuật",
            fileUrl: pdfUrl,
            fileName: pdfName,
            mimeType: "application/pdf",
            sizeBytes: pdfSize,
            displayOrder: 1,
          });
        }
      } else if (data.contentType === "editor" && data.editorContent) {
        const editorContent = await safeConvertLexicalToHtml(
          data.editorContent,
        );
        if (editorContent) {
          documents.push({
            documentType: "editor",
            name: "Hướng dẫn kỹ thuật",
            content: editorContent,
            displayOrder: 1,
          });
        }
      }

      await createSeed.mutateAsync({
        cropVarietyId,
        origin: data.origin,
        avgYieldFrom,
        avgYieldTo,
        documents,
        imageUrl: finalImageUrl,
        supplierOrganizationId: supplierId,
        germinationRate: data.germinationRate,
        purityRate: data.uniformity,
        status: "active",
        metadataJson: {
          description: data.description,
          expiryDate: data.expiryDate?.toISOString(),
        },
      });

      toast({
        title: "Thành công",
        description: `Đã tạo hạt giống mới`,
      });
      setLocation("/seed");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Thêm hạt giống thất bại",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps: Step[] = [
    {
      id: "selection",
      title: "Chọn giống cây",
      description: "Lựa chọn loại cây và giống cây cần nhập kho",
      content: <SeedSelectionStep />,
      isValid:
        !!selectionWatch[0] && !!selectionWatch[1] && !!selectionWatch[2],
    },
    {
      id: "details",
      title: "Chi tiết lô giống",
      description: "Thông tin nhà cung cấp và thông số kỹ thuật",
      content: <SeedDetailsStep showExpiryDate showYieldField={false} />,
      isValid: !!detailsWatch[0] && !!detailsWatch[1],
    },
    {
      id: "docs",
      title: "Tài liệu kỹ thuật",
      description: "Cung cấp tài liệu hướng dẫn trồng và chăm sóc",
      content: <SeedDocumentationStep pdfInputRef={pdfInputRef} />,
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra lại thông tin trước khi tạo",
      content: <SeedReviewStep formData={getMockFormData()} />,
    },
  ];

  return (
    <AdminLayout
      title="Tạo mới hạt giống"
      description="Thêm mới hạt giống vào danh mục hệ thống"
    >
      <FormProvider {...methods}>
        <Form {...methods}>
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <StepperForm
                steps={steps}
                onComplete={handleSubmit(handleComplete, (e) => {
                  console.log("error", e);
                })}
                completeLabel="Hoàn tất & Tạo giống"
                onCancel={() => setLocation("/seed")}
                loading={isSubmitting}
              />
            </CardContent>
          </Card>
        </Form>
      </FormProvider>
    </AdminLayout>
  );
}
