import { DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { COOPERATIVE_COLUMNS, COOPERATIVE_FILTERS } from "../data/constants";
import type { Cooperative } from "../types/types";

interface CooperativeTableProps {
  data: Cooperative[];
  onView: (item: Cooperative) => void;
  onEdit: (item: Cooperative) => void;
  onDelete: (item: Cooperative) => void;
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
      selectable
    />
  );
}
