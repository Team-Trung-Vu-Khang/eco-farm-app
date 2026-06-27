import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Sprout } from "lucide-react";
import { Link, useParams } from "wouter";
import { VarietyFoundationDetailContent } from "./components/VarietyFoundationDetailContent";
import useVarietyFoundationStore from "../../stores/useVarietyFoundationStore";

interface VarietyFoundationDetailPageProps {
  id?: string;
}

export default function VarietyFoundationDetailPage({
  id: propId,
}: VarietyFoundationDetailPageProps) {
  const params = useParams<{ id: string }>();
  const id = propId ?? params?.id;
  const isStandalone = !!params?.id;

  const { getVarietyFoundationById } = useVarietyFoundationStore();
  const varietyFoundation = getVarietyFoundationById(id || "");

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
    <VarietyFoundationDetailContent varietyFoundation={varietyFoundation} isStandalone={isStandalone} />
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
