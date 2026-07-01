import {
  Button,
  Badge,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";
import type { BranchDetailView } from "../hooks/useBranchDetail";

interface BranchDetailHeaderProps {
  branch: Pick<BranchDetailView, "name" | "status" | "enterpriseName">;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function BranchDetailHeader({
  branch,
  onBack,
  onEdit,
  onDelete,
}: BranchDetailHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mt-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {branch.name}
            </h1>
            <Badge
              variant={branch.status === "active" ? "default" : "secondary"}
              className="capitalize"
            >
              {branch.status === "active" ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Hoạt động
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Ngưng hoạt động
                </span>
              )}
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {branch.enterpriseName}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Xóa
        </Button>
      </div>
    </div>
  );
}
