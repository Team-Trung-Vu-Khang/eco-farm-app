import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Trees } from "lucide-react";

type Props = {
  onBack: () => void;
};

export const PlantIdentificationNotFoundState = ({ onBack }: Props) => {
  return (
    <AdminLayout
      isDev={true}
      title="Không tìm thấy cây"
      description="Dữ liệu không tồn tại"
    >
      <div className="p-12 text-center text-slate-400">
        <Trees className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p>Không tìm thấy thông tin định danh cho cây có ID này.</p>
        <Button variant="outline" className="mt-4" onClick={onBack}>
          Quay lại danh sách
        </Button>
      </div>
    </AdminLayout>
  );
};
