import { Badge, Button, DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Eye, PencilLine, Trash2 } from "lucide-react";
import { badgeTrangThaiVaiTro } from "../constants/roleResponsibilityConstants";
import type { VaiTroTableColumn, VaiTroTableRow } from "../types";

interface RoleLibrarySectionProps {
  columns: VaiTroTableColumn[];
  rows: VaiTroTableRow[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

export function RoleLibrarySection({
  columns,
  rows,
  onDelete,
  onEdit,
  onView,
}: RoleLibrarySectionProps) {
  return (
    <DataTable
      data={rows}
      columns={columns}
      searchPlaceholder="Tìm mã vai trò, tên vai trò..."
      onView={(row) => onView((row as VaiTroTableRow).id)}
      onEdit={(row) => onEdit((row as VaiTroTableRow).id)}
      onDelete={(row) => onDelete((row as VaiTroTableRow).id)}
    />
  );
}
