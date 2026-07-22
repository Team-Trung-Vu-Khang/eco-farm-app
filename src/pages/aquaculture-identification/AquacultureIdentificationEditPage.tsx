import { AdminLayout, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useParams } from "wouter";
import { useLocation } from "wouter";
import AquacultureIdentificationForm from "./components/AquacultureIdentificationForm";
import { AQUACULTURE_IDENTIFICATION_PLANTS } from "./data/dummy";

const AquacultureIdentificationEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const plant = AQUACULTURE_IDENTIFICATION_PLANTS.find((item) => item.id === id);

  if (!plant) {
    return (
      <AdminLayout
        isDev={true}
        title="Không tìm thấy"
        description="Dữ liệu định danh mẫu không tồn tại"
      >
        <div className="p-12 text-center text-slate-400">
          <p>Không tìm thấy thông tin để chỉnh sửa.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      isDev={true}
      title={`Chỉnh sửa: ${plant.code}`}
      description="Cập nhật thông tin định danh và thông số mẫu"
    >
      <AquacultureIdentificationForm
        initialData={plant}
        onSubmit={async (data) => {
          toast({
            title: "Thành công",
            description: `Đã cập nhật thành công ${data.length || 1} mục mẫu`,
          });
          setLocation(`/aquaculture-identification/${plant.id}`);
        }}
        loading={false}
      />
    </AdminLayout>
  );
};

export default AquacultureIdentificationEditPage;
