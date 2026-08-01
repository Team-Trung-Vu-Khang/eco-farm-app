import PageWrapper from "@/components/PageWrapper";
import { useSeedMutations } from "@/features/farm/hooks/useSeedMutations";
import { useSeedById } from "@/features/farm/hooks/useSeeds";
import { useFileUpload } from "@/features/storage";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  Form,
  StepperForm,
  useToast,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import React, { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useLocation, useParams } from "wouter";
import { SeedDetailsStep } from "./components/SeedDetailsStep";
import { SeedDocumentationStep } from "./components/SeedDocumentationStep";
import { SeedIdentityStep } from "./components/SeedIdentityStep";
import {
  createSeedSchema,
  type CreateSeedFormValues,
} from "./schemas/createSeedSchema";

export default function UpdateSeedPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const seedId = Number(id);
  const {
    data: seed,
    isSuccess,
    isLoading,
  } = useSeedById(seedId, {
    enabled: !!seedId,
  });

  const { updateSeed } = useSeedMutations();
  const { uploadFile } = useFileUpload();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const uploadedFilesCache = React.useRef<
    Map<File, { fileUrl: string; fileName?: string; sizeBytes?: number }>
  >(new Map());

  const methods = useForm<CreateSeedFormValues>({
    resolver: zodResolver(createSeedSchema),
    mode: "onChange",
    defaultValues: {
      cropGroupId: "0",
      cropId: "",
      cropVarietyId: "",
      cropName: "",
      varietyName: "",
      varietyCode: "",
      supplierOrganizationId: "",
      supplierName: "",
      origin: "",
      germinationRate: 0,
      uniformity: 0,
      description: "",
      editorContent: "",
      contentType: "pdf",
    },
  });

  const { handleSubmit, control, reset } = methods;

  useEffect(() => {
    if (isSuccess && seed) {
      const editorDoc = seed.documents?.find(
        (doc) => doc.documentType === "editor",
      );
      const pdfDoc = seed.documents?.find((doc) => doc.documentType === "pdf");

      let contentType: "pdf" | "editor" = "pdf";
      if (editorDoc?.content) {
        contentType = "editor";
      } else if (pdfDoc?.fileUrl) {
        contentType = "pdf";
      }

      reset({
        cropGroupId: "0", // dummy value to pass validation
        cropId: String(seed.crop.id),
        cropVarietyId: String(seed.cropVariety.id),
        code: seed.code || "",
        name: seed.name || "",
        cropName: seed.crop.name,
        varietyName: seed.cropVariety.name,
        varietyCode: seed.cropVariety.code || `SEED-${seed.cropVariety.id}`,
        supplierOrganizationId: String(seed.supplier.id),
        supplierName: seed.supplier.name,
        origin: seed.origin || "",
        germinationRate: seed.germinationRate || 0,
        uniformity: seed.purityRate || 0,
        avgYieldFrom: seed.avgYieldFrom,
        avgYieldTo: seed.avgYieldTo,
        description: (seed.metadataJson?.description as string) || "",
        expiryDate: seed.metadataJson?.expiryDate
          ? new Date(seed.metadataJson.expiryDate as string)
          : undefined,
        baseIllustrationUrl: seed.imageUrl || undefined,
        contentType,
        editorContent: editorDoc?.content || "",
        pdfFile: pdfDoc
          ? new File([], pdfDoc.name || "Tài liệu kỹ thuật.pdf")
          : undefined, // Mock file just to trigger UI presence, actual upload check will handle it
      });
    }
  }, [isSuccess, seed, reset]);

  const identityWatch = useWatch({
    control,
    name: ["name"],
  });

  const detailsWatch = useWatch({
    control,
    name: ["supplierOrganizationId", "expiryDate"],
  });

  const pdfInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleComplete = async (data: CreateSeedFormValues) => {
    setIsSubmitting(true);
    const supplierId = Number(data.supplierOrganizationId);

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
        data.pdfFile &&
        (data.pdfFile instanceof File ? data.pdfFile.size > 0 : true)
      ) {
        let pdfUrl: string | undefined = seed?.documents?.find(
          (doc) => doc.documentType === "pdf",
        )?.fileUrl;
        let pdfName: string | undefined = seed?.documents?.find(
          (doc) => doc.documentType === "pdf",
        )?.name;
        let pdfSize: number | undefined = seed?.documents?.find(
          (doc) => doc.documentType === "pdf",
        )?.sizeBytes;

        if (data.pdfFile instanceof File && data.pdfFile.size > 0) {
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

      await updateSeed.mutateAsync({
        id: seedId,
        data: {
          cropVarietyId: seed!.cropVariety.id,
          code: data.code || undefined,
          name: data.name,
          origin: data.origin,
          avgYieldFrom: data.avgYieldFrom || undefined,
          avgYieldTo: data.avgYieldTo || undefined,
          documents,
          imageUrl: finalImageUrl,
          supplierOrganizationId: supplierId,
          germinationRate: data.germinationRate,
          purityRate: data.uniformity,
          status: seed!.status,
          metadataJson: {
            description: data.description,
            expiryDate: data.expiryDate?.toISOString(),
          },
        },
      });

      toast({
        title: "Thành công",
        description: `Đã cập nhật hạt giống`,
      });
      setLocation(`/seed/${id}`, { replace: true });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Cập nhật hạt giống thất bại",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps: Step[] = [
    {
      id: "identity",
      title: "Thông tin định danh",
      description: "Thông tin định danh hạt giống và giống cây trồng gốc",
      content: <SeedIdentityStep />,
      isValid: !!identityWatch[0],
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
      isValid: true,
    },
  ];

  if (isLoading) {
    return (
      <PageWrapper title="Cập nhật hạt giống" description="Đang tải dữ liệu...">
        <div className="flex h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-green-600"></div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Cập nhật hạt giống"
      description="Chỉnh sửa thông tin hạt giống trong hệ thống"
    >
      <FormProvider {...methods}>
        <Form {...methods}>
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <StepperForm
                steps={steps}
                onComplete={handleSubmit(handleComplete)}
                completeLabel="Hoàn tất & Lưu"
                onCancel={() => setLocation(`/seed/${id}`)}
                loading={isSubmitting}
              />
            </CardContent>
          </Card>
        </Form>
      </FormProvider>
    </PageWrapper>
  );
}
