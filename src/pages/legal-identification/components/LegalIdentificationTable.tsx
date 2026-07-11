import {
  Badge,
  Button,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  LEGAL_FILE_GROUPS,
  LEGAL_STATUS_CLASSNAMES,
  LEGAL_STATUS_LABELS,
  formatLegalDate,
  type LegalIdentificationRecord,
} from "../data/constants";

function getFileCount(record: LegalIdentificationRecord) {
  return LEGAL_FILE_GROUPS.reduce(
    (sum, group) => sum + (record.documents[group.id]?.length || 0),
    0,
  );
}

function getCompletedGroups(record: LegalIdentificationRecord) {
  return LEGAL_FILE_GROUPS.reduce(
    (sum, group) => sum + (record.documents[group.id]?.length ? 1 : 0),
    0,
  );
}

type LegalIdentificationTableProps = {
  data: LegalIdentificationRecord[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
};

export function LegalIdentificationTable({
  data,
  onView,
  onEdit,
  onDelete,
  searchable = false,
  searchPlaceholder = "Tìm kiếm hồ sơ...",
  onSearch,
}: LegalIdentificationTableProps) {
  const columns: Column<LegalIdentificationRecord>[] = [
    {
      label: "Mã",
      key: "code",
      render: (_, item) => (
        <div className="space-y-1">
          <div className="font-mono text-sm font-semibold text-slate-900">
            {item.code}
          </div>
          <div className="text-[11px] text-slate-500">{item.ownerName}</div>
        </div>
      ),
    },
    {
      label: "Hồ sơ",
      key: "name",
      render: (_, item) => (
        <div className="space-y-1">
          <div className="text-sm font-semibold text-slate-900">{item.name}</div>
          <div className="text-[11px] text-slate-500">
            {item.regionName} • {item.areaName}
          </div>
        </div>
      ),
    },
    {
      label: "Tệp đính kèm",
      key: "documents",
      render: (_, item) => {
        const totalFiles = getFileCount(item);
        const completedGroups = getCompletedGroups(item);
        return (
          <div className="space-y-1">
            <div className="text-sm font-semibold text-slate-900">
              {totalFiles} file
            </div>
            <div className="text-[11px] text-slate-500">
              {completedGroups}/{LEGAL_FILE_GROUPS.length} nhóm hoàn thiện
            </div>
          </div>
        );
      },
    },
    {
      label: "Cập nhật",
      key: "updatedAt",
      render: (_, item) => (
        <div className="text-sm text-slate-700">
          {formatLegalDate(item.updatedAt)}
        </div>
      ),
    },
    {
      label: "Trạng thái",
      key: "status",
      render: (_, item) => (
        <Badge variant="outline" className={LEGAL_STATUS_CLASSNAMES[item.status]}>
          {LEGAL_STATUS_LABELS[item.status]}
        </Badge>
      ),
    },
    {
      label: "Thao tác",
      key: "id",
      render: (_, item) => (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onView(item.id)}
          >
            <Eye className="mr-1.5 h-4 w-4" />
            Xem
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(item.id)}
          >
            <Edit className="mr-1.5 h-4 w-4" />
            Sửa
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDelete(item.id)}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      onSearch={onSearch}
      selectable={false}
    />
  );
}
