import { DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { COOPERATIVE_COLUMNS, COOPERATIVE_FILTERS } from "../data/constants";
import type { Enterprise } from "@/pages/enterprise/data/constants";

interface CooperativeTableProps {
  data: Enterprise[];
  onView: (item: Enterprise) => void;
  onEdit: (item: Enterprise) => void;
  onDelete: (item: Enterprise) => void;
}

export function CooperativeTable({
  data,
  onView,
  onEdit,
  onDelete,
}: CooperativeTableProps) {
  return (
    <DataTable
      columns={COOPERATIVE_COLUMNS}
      data={data}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      searchPlaceholder="Tìm kiếm hợp tác xã..."
      filters={COOPERATIVE_FILTERS}
      selectable={false}
    />
  );
}
