import PageWrapper from "@/components/PageWrapper";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Sprout } from "lucide-react";
import { Link, useParams } from "wouter";
import useVarietyStore from "../../stores/useVarietyStore";
import { VarietyDetailContent } from "./components/VarietyDetailContent";

interface VarietyDetailPageProps {
  id?: string;
}

export default function VarietyDetailPage({
  id: propId,
}: VarietyDetailPageProps) {
  const params = useParams<{ id: string }>();
  const id = propId ?? params?.id;
  const isStandalone = !!params?.id;

  const { getVarietyById } = useVarietyStore();
  const variety = getVarietyById(id || "");

  if (!variety) {
    const errorContent = (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Sprout className="w-10 h-10 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium text-lg">
          Không tìm thấy thông tin giống cây này.
        </p>
        <Link href="/variety">
          <Button variant="outline" className="mt-4">
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );

    return isStandalone ? (
      <PageWrapper
        title="Chi tiết giống cây"
        description="Không tìm thấy thông tin"
      >
        {errorContent}
      </PageWrapper>
    ) : (
      errorContent
    );
  }

  const content = (
    <VarietyDetailContent variety={variety} isStandalone={isStandalone} />
  );

  return isStandalone ? (
    <PageWrapper
      title="Chi tiết giống cây"
      description={`Thông tin chi tiết về ${variety.varietyName}`}
    >
      {content}
    </PageWrapper>
  ) : (
    content
  );
}
