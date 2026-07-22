import type { Plant } from "@/pages/region-chart/constants";
import { AdminLayout, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import AquacultureIdentificationForm from "./components/AquacultureIdentificationForm";

const AquacultureIdentificationCreatePage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (data: Plant[]) => {
    toast({
      title: "Thành công",
      description: `Đã lưu thành công ${data.length} mục định danh mẫu`,
    });
    setLocation("/aquaculture-identification");
  };

  return (
    <AdminLayout
      isDev={true}
      title="Thêm mới nuôi trồng thủy sản"
      description="Định danh và thiết lập vị trí cho vùng nuôi trồng thủy sản mới"
    >
      <AquacultureIdentificationForm onSubmit={handleSubmit} loading={false} />
    </AdminLayout>
  );
};

export default AquacultureIdentificationCreatePage;
