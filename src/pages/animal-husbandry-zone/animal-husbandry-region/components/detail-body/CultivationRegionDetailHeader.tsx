import { Badge, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle, ChevronLeft, Edit } from "lucide-react";
import type { CultivationRegion } from "../../../../stores/useCultivationRegionStore";

type Props = {
  area: CultivationRegion;
  onBack: () => void;
  onEdit: () => void;
};

export const CultivationRegionDetailHeader = ({
  area,
  onBack,
  onEdit,
}: Props) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="gap-2 text-muted-foreground hover:text-primary pl-0"
      >
        <ChevronLeft className="w-4 h-4" />
        Quay lại danh sách
      </Button>

      <div className="flex gap-2">
        <Badge
          variant={area.status === "active" ? "default" : "secondary"}
          className="px-3 py-1"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          {area.status === "active" ? "Đang hoạt động" : "Tạm ngưng"}
        </Badge>
        <Button onClick={onEdit} className="gap-2">
          <Edit className="w-4 h-4" />
          Chỉnh sửa
        </Button>
      </div>
    </div>
  );
};
