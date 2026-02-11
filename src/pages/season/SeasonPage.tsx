import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Calendar, FileText, Hash, Plus, Sprout } from "lucide-react";
import type { Season } from "./types";
import useSeasonStore from "../../stores/useSeasonStore";

const statusMap: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  planning: { label: "Lập kế hoạch", variant: "secondary" },
  active: { label: "Đang triển khai", variant: "default" },
  completed: { label: "Hoàn thành", variant: "outline" },
  cancelled: { label: "Đã hủy", variant: "destructive" },
};

const columns: Column<Season>[] = [
  {
    key: "code",
    label: "Mã mùa vụ",
    render: (value) => (
      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border w-fit">
        <Hash className="w-3 h-3 opacity-60" />
        {value}
      </div>
    ),
  },
  {
    key: "name",
    label: "Tên mùa vụ",
    render: (value, item) => (
      <Link href={`/season/${item.id}`}>
        <div className="font-semibold text-primary cursor-pointer hover:underline">
          {value}
        </div>
      </Link>
    ),
  },
  {
    key: "startDate",
    label: "Thời gian",
    render: (_, item) => (
      <div className="flex flex-col text-xs space-y-1">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-green-600" />
          <span className="font-medium text-green-700">
            BĐ: {item.startDate}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-orange-600" />
          <span className="font-medium text-orange-700">
            KT: {item.endDate}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => {
      const config = statusMap[value as string] || {
        label: value,
        variant: "outline",
      };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    key: "growthCycleIds",
    label: "Chu kỳ & Tài liệu",
    render: (value: string[], item: Season) => (
      <div className="flex items-center gap-3">
        {value.length > 0 ? (
          <Badge variant="secondary" className="gap-1.5">
            <Sprout className="w-3 h-3 text-green-600" />
            {value.length} chu kỳ
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            Chưa có chu kỳ
          </span>
        )}

        {item.documents.length > 0 && (
          <Badge
            variant="outline"
            className="gap-1.5 bg-blue-50 text-blue-700 border-blue-200"
          >
            <FileText className="w-3 h-3" />
            {item.documents.length} tài liệu
          </Badge>
        )}
      </div>
    ),
  },
];

const SeasonPage = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { seasons, deleteSeason } = useSeasonStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Season | null>(null);

  const handleDelete = (item: Season) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleEdit = (item: Season) => {
    setLocation(`/season/${item.id}/edit`);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteSeason(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa mùa vụ" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý mùa vụ"
      description="Quản lý kế hoạch mùa vụ và quy trình canh tác"
      actions={
        <Link href="/season/create">
          <Button
            size="sm"
            className="h-9 px-3 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      <DataTable
        data={seasons}
        selectable
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm mùa vụ..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
};

export default SeasonPage;
