import React from "react";
import {
  Badge,
  Button,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  PowerOff,
  Power,
} from "lucide-react";
import {
  type DocumentCategory,
  type EntityType,
  ENTITY_TYPE_LABELS,
  ENTITY_TYPE_COLORS,
} from "../data/constants";

interface DocumentCategoryTableProps {
  data: DocumentCategory[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export const DocumentCategoryTable: React.FC<DocumentCategoryTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const columns: Column<DocumentCategory>[] = [
    {
      label: "Mã",
      key: "code",
    },
    {
      label: "Tên tài liệu",
      key: "name",
      render: (value, item) => (
        <div className="flex flex-col gap-1">
          <span className="font-bold text-sm text-slate-800">{item.name}</span>
          {item.description && (
            <span className="text-[10px] text-slate-400 line-clamp-1 italic">
              {item.description}
            </span>
          )}
        </div>
      ),
    },
    {
      label: "Áp dụng cho",
      key: "entityTypes",
      render: (value: EntityType[], item) => (
        <div className="flex flex-wrap gap-1">
          {item.entityTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className={`text-[9px] px-1.5 h-5 font-black uppercase tracking-tighter border-none bg-${ENTITY_TYPE_COLORS[type]}-50 text-${ENTITY_TYPE_COLORS[type]}-600`}
            >
              {ENTITY_TYPE_LABELS[type]}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      label: "Bắt buộc",
      key: "required",
      render: (value, item) => (
        <Badge
          variant={item.required ? "default" : "outline"}
          className={
            item.required
              ? "bg-red-500 hover:bg-red-600 border-none"
              : "text-slate-400 border-slate-200"
          }
        >
          {item.required ? "Bắt buộc" : "Không"}
        </Badge>
      ),
    },
    {
      label: "Hết hạn",
      key: "hasExpiry",
      render: (value, item) => (
        <Badge
          variant={item.hasExpiry ? "secondary" : "outline"}
          className={
            item.hasExpiry
              ? "bg-amber-100 text-amber-700 border-none"
              : "text-slate-400 border-slate-200"
          }
        >
          {item.hasExpiry ? "Có" : "Không"}
        </Badge>
      ),
    },
    {
      label: "Trạng thái",
      key: "status",
      render: (value, item) => (
        <Badge
          variant={item.status === "active" ? "default" : "secondary"}
          className={
            item.status === "active"
              ? "bg-green-500 hover:bg-green-600 border-none"
              : "bg-slate-200 text-slate-500 border-none"
          }
        >
          {item.status === "active" ? "Hoạt động" : "Ngưng"}
        </Badge>
      ),
    },
    {
      label: "Thao tác",
      key: "id",
      render: (value, item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-primary"
            >
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(item.id)}>
              <Eye size={14} className="mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(item.id)}>
              <Edit size={14} className="mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus(item.id)}>
              {item.status === "active" ? (
                <>
                  <PowerOff size={14} className="mr-2 text-amber-500" />
                  <span className="text-amber-500">Vô hiệu hóa</span>
                </>
              ) : (
                <>
                  <Power size={14} className="mr-2 text-green-500" />
                  <span className="text-green-500">Kích hoạt</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 size={14} className="mr-2" />
              Xóa danh mục
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      searchPlaceholder="Tìm kiếm mã, tên tài liệu..."
      selectable={false}
    />
  );
};
