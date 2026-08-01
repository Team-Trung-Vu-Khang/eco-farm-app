import PageWrapper from "@/components/PageWrapper";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PawPrint } from "lucide-react";

type Props = {
  onBack: () => void;
};

export const AnimalIdentificationNotFoundState = ({ onBack }: Props) => {
  return (
    <PageWrapper
      title="Không tìm thấy cá thể"
      description="Dữ liệu không tồn tại"
    >
      <div className="p-12 text-center text-slate-400">
        <PawPrint className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p>Không tìm thấy thông tin định danh cho cá thể có ID này.</p>
        <Button variant="outline" className="mt-4" onClick={onBack}>
          Quay lại danh sách
        </Button>
      </div>
    </PageWrapper>
  );
};
