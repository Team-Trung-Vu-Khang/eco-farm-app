import PageWrapper from "@/components/PageWrapper";
import { Badge, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle, ChevronLeft, Layers } from "lucide-react";
import { useLocation } from "wouter";
import { CultivationRegionDetailView } from "./components/CultivationRegionDetailView";
import { useCultivationRegionDetailPage } from "./hooks/useCultivationRegionDetailPage";

const CultivationRegionDetailPage = () => {
  const { title, code, status } = useCultivationRegionDetailPage();
  const [, setLocation] = useLocation();

  const isActive = (status ?? "active").toLowerCase() === "active";

  return (
    <PageWrapper
      actions={
        <Button
          variant="outline"
          onClick={() => setLocation("/cultivation-region")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      }
    >
      {/* Profile header — matches the zone profile dialog in Tìm kiếm vùng canh tác */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg">
            <Layers size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Hồ sơ vùng trồng: {title}
            </h2>
            {code && (
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Mã hiệu:{" "}
                <span className="font-bold text-slate-700">{code}</span>
              </p>
            )}
          </div>
        </div>

        <Badge
          variant={isActive ? "default" : "secondary"}
          className="px-3 py-1"
        >
          <CheckCircle className="mr-1 h-3 w-3" />
          {isActive ? "Đang hoạt động" : "Tạm ngưng"}
        </Badge>
      </div>

      <CultivationRegionDetailView />
    </PageWrapper>
  );
};

export { CultivationRegionDetailView } from "./components/CultivationRegionDetailView";
export default CultivationRegionDetailPage;
