import useVarietyStore from "@/stores/useVarietyStore";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import { Calendar, FileText, Hash, Plus, Layers } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import useSeasonStore from "../../stores/useSeasonStore";
import type { Season } from "./types";

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
    key: "duration",
    label: "Thời gian",
    render: (_, item) => (
      <div className="flex items-center gap-1.5 text-xs">
        <Calendar className="w-4 h-4 text-green-600" />
        <span className="font-medium text-green-700 text-sm">
          {item.duration} ngày
        </span>
      </div>
    ),
  },
  {
    key: "applyFor",
    label: "Áp dụng cho",
    render: (_: string[], seasons: Season) => {
      const isUseVariety = !!seasons?.varietyId;

      if (isUseVariety) {
        const variety = useVarietyStore
          .getState()
          .getVarietyById(seasons.varietyId!);

        return (
          <div className="flex font-mono font-bold text-xs text-green-600 rounded-md bg-green-100 border border-green-200 px-2 py-1 items-center gap-3 w-fit">
            {variety?.varietyName}
          </div>
        );
      }

      return (
        <div className="flex font-mono font-bold text-xs text-green-600 rounded-md bg-green-100 border border-green-200 px-2 py-1 items-center gap-3 w-fit">
          {seasons.cropId}
        </div>
      );
    },
  },
  {
    key: "stages",
    label: "Giai đoạn",
    render: (_, item) => {
      const stageCount = Object.values(item.selectedStages || {}).reduce(
        (acc, stages) => acc + Object.keys(stages).length,
        0,
      );
      return (
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="gap-1.5 bg-purple-50 text-purple-700 border-purple-200"
          >
            <Layers className="w-3 h-3" />
            {stageCount} giai đoạn
          </Badge>
        </div>
      );
    },
  },
  {
    key: "documents",
    label: "Tài liệu",
    render: (value: Document[]) => (
      <div className="flex items-center gap-3">
        {value.length > 0 && (
          <Badge
            variant="outline"
            className="gap-1.5 bg-blue-50 text-blue-700 border-blue-200"
          >
            <FileText className="w-3 h-3" />
            {value.length} tài liệu
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
