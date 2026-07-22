import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, Edit, Trash2 } from "lucide-react";

type Props = {
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const AnimalIdentificationPageActions = ({
  onBack,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onBack}>
        <ChevronLeft className="w-4 h-4 mr-1" />
        Quay lại
      </Button>
      <Button size="sm" onClick={onEdit}>
        <Edit className="w-4 h-4 mr-1" />
        Chỉnh sửa
      </Button>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="w-4 h-4 mr-1" />
        Xóa
      </Button>
    </div>
  );
};
