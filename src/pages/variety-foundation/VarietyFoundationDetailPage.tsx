import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Sprout } from "lucide-react";
import { Link, useParams } from "wouter";
import { VarietyFoundationDetailContent } from "./components/VarietyFoundationDetailContent";
import type { VarietyFoundation } from "./types";
import { formatDaysToDuration } from "../growth-cycle/utils/duration";
import { useCropVarietyById } from "@/features/foundation";

interface VarietyFoundationDetailPageProps {
  id?: string;
}

export default function VarietyFoundationDetailPage({
  id: propId,
}: VarietyFoundationDetailPageProps) {
  const params = useParams<{ id: string }>();
  const id = propId ?? params?.id;
  const isStandalone = !!params?.id;

  const { data: apiData, isLoading } = useCropVarietyById(Number(id), {
    enabled: !!id,
  });

  let varietyFoundation: VarietyFoundation | undefined = undefined;

  if (apiData) {
    const metadata = (apiData.metadataJson || {}) as Record<string, unknown>;
    const docs = apiData.documents || [];
    const pdfDoc = docs.find((d) => d.type === "pdf");
    const editorDoc = docs.find((d) => d.type === "editor");

    let contentType: "pdf" | "editor" = "editor";
    if (pdfDoc) contentType = "pdf";

    varietyFoundation = {
      id: String(apiData.id),
      varietyFoundationCode: apiData.code || "",
      varietyFoundationName: apiData.name || "",
      crop: String(apiData.cropName || apiData.cropId || ""),
      description: apiData.description || "",
      origin: apiData.origin || "",
      growthDuration: formatDaysToDuration(apiData.growthDurationDays),
      averageYield:
        apiData.avgYieldFrom || apiData.avgYieldTo
          ? `${apiData.avgYieldFrom || 0}-${apiData.avgYieldTo || 0}`
          : "",
      status: apiData.status as "active" | "inactive",
      updatedAt: apiData.updatedAt || new Date().toISOString(),
      illustration:
        (apiData as any).imageUrl || metadata.illustrationUrl || null,
      scientificName: (metadata.scientificName as string) || "",
      documents: docs
        .filter((d) => d.type === "pdf")
        .map((d) => ({ name: d.name || "Tài liệu PDF", url: d.fileUrl || "" })),
      contentType,
      editorContent: editorDoc?.content || "",
      pdfFile: null,
    };
  }

  if (isLoading) {
    return (
      <AdminLayout isDev={true} title="Chi tiết giống cây (nền tảng)">
        <div className="flex justify-center items-center py-20">
          Đang tải...
        </div>
      </AdminLayout>
    );
  }

  if (!varietyFoundation) {
    const errorContent = (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Sprout className="w-10 h-10 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium text-lg">
          Không tìm thấy thông tin giống cây (nền tảng) này.
        </p>
        <Link href="/variety-foundation">
          <Button variant="outline" className="mt-4">
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );

    return isStandalone ? (
      <AdminLayout
        isDev={true}
        title="Chi tiết giống cây (nền tảng)"
        description="Không tìm thấy thông tin"
      >
        {errorContent}
      </AdminLayout>
    ) : (
      errorContent
    );
  }

  const content = (
    <VarietyFoundationDetailContent
      varietyFoundation={varietyFoundation}
      isStandalone={isStandalone}
    />
  );

  return isStandalone ? (
    <AdminLayout
      isDev={true}
      title="Chi tiết giống cây (nền tảng)"
      description={`Thông tin chi tiết về ${varietyFoundation.varietyFoundationName}`}
    >
      {content}
    </AdminLayout>
  ) : (
    content
  );
}
