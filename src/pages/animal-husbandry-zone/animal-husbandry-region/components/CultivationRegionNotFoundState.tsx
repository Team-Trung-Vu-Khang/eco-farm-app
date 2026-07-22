import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Target } from "lucide-react";

type Props = {
  onBack: () => void;
};

export const CultivationRegionNotFoundState = ({ onBack }: Props) => {
  return (
    <AdminLayout
      isDev={true}
      title="Không tìm thấy"
      description="Vùng chăn nuôi không tồn tại"
    >
      <div className="flex flex-col items-center justify-center py-20">
        <Target className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">
          Không tìm thấy vùng chăn nuôi
        </h2>
        <Button variant="ghost" className="mt-4" onClick={onBack}>
          Quay lại danh sách
        </Button>
      </div>
    </AdminLayout>
  );
};
