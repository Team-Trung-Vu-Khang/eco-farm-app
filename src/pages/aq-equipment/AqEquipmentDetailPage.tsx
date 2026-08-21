import PageWrapper from "@/components/PageWrapper";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, Edit } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import useEquipmentStore from "../../stores/useEquipmentStore";
import { useFarmSupplyDetailHook } from "@/features/farm-supply/hooks/useFarmSupplyDetailHook";
import { EquipmentDetailHeader } from "../equipment/components/detail/EquipmentDetailHeader";
import { EquipmentDetailSidebar } from "../equipment/components/detail/EquipmentDetailSidebar";
import { InfoTab } from "../equipment/components/detail/EquipmentDetailTabs";

const AqEquipmentDetailPage = () => {
  const [matchFarm, paramsFarm] = useRoute("/aquaculture-material/equipment/:id");
  const [matchAdmin, paramsAdmin] = useRoute("/admin/aq-equipment/:id");
  const params = paramsFarm || paramsAdmin;
  const matchAdminActive = !!matchAdmin;
  const [, setLocation] = useLocation();
  const id = params?.id ? Number(params.id) : 0;
  const { item, loading } = useFarmSupplyDetailHook("equipment", id);

  if (loading) {
    return (
      <PageWrapper title="Chi tiết thiết bị thủy sản">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground animate-pulse">
            Đang tải dữ liệu...
          </p>
        </div>
      </PageWrapper>
    );
  }

  if (!item) {
    return (
      <PageWrapper title="Chi tiết thiết bị thủy sản">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin thiết bị.
          </p>
          <Button onClick={() => setLocation(matchAdminActive ? "/admin/aq-equipment" : "/aquaculture-material/equipment")}>
            Quay lại danh sách
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Chi tiết thiết bị thủy sản"
      description={`Thông tin và lịch sử bảo dưỡng của ${item.name}`}
      actions={
        (item.source === "OWNER" || matchAdminActive) && (
          <Button
            onClick={() =>
              setLocation(
                matchAdminActive
                  ? `/admin/aq-equipment/${id}/edit`
                  : `/aquaculture-material/equipment/${id}/edit`
              )
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        )
      }
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation(matchAdminActive ? "/admin/aq-equipment" : "/aquaculture-material/equipment")}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <EquipmentDetailHeader item={item} />
          <InfoTab item={item} />
        </div>

        <div className="space-y-6">
          <EquipmentDetailSidebar item={item} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default AqEquipmentDetailPage;
