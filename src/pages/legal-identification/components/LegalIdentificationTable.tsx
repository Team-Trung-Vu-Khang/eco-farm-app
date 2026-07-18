import {
  Badge,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
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
  filters?: Array<{
    key: string;
    label: string;
    options: Array<{ label: string; value: string }>;
  }>;
  onFilterChange?: (key: string, value: string) => void;
  loading?: boolean;
  pageSize?: number;
  currentIndex?: number;
  totalElements?: number;
  totalPages?: number;
  onPageSize?: (size: number) => void;
  onIndexChange?: (index: number) => void;
};

export function LegalIdentificationTable({
  data,
  onView,
  onEdit,
  onDelete,
  searchable = false,
  searchPlaceholder = "Tìm kiếm hồ sơ...",
  onSearch,
  filters,
  onFilterChange,
  loading,
  pageSize,
  currentIndex,
  totalElements,
  totalPages,
  onPageSize,
  onIndexChange,
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
          <div className="text-sm font-semibold text-slate-900">
            {item.name}
          </div>
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
        <Badge
          variant="outline"
          className={LEGAL_STATUS_CLASSNAMES[item.status]}
        >
          {LEGAL_STATUS_LABELS[item.status]}
        </Badge>
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
      filters={filters}
      onFilterChange={onFilterChange}
      loading={loading}
      pageSize={pageSize}
      currentIndex={currentIndex}
      totalElements={totalElements}
      totalPages={totalPages}
      onPageSize={onPageSize}
      onIndexChange={onIndexChange}
      onView={(row) => onView(row.id)}
      onEdit={(row) => onEdit(row.id)}
      onDelete={(row) => onDelete(row.id)}
      selectable={false}
    />
  );
}
