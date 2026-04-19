import { Badge, Button, DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Eye, PencilLine } from "lucide-react";
import { getStatusBadge } from "../constants/documentVersionConstants";
import type { DocumentTableColumn, DocumentTableRow } from "../types";

interface DocumentLibrarySectionProps {
  columns: DocumentTableColumn[];
  rows: DocumentTableRow[];
  selectedDocumentId: string;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

export function DocumentLibrarySection({
  columns,
  rows,
  selectedDocumentId,
  onEdit,
  onView,
}: DocumentLibrarySectionProps) {
  return (
    <section className="rounded-2xl border bg-card p-4 md:p-5">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
        <div>
          <h2 className="text-lg font-semibold">Danh sách tài liệu</h2>
          <p className="text-sm text-muted-foreground">
            Chọn tài liệu để xem lịch sử version và thao tác nghiệp vụ.
          </p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
          Flow chuẩn
        </Badge>
      </div>

      <div className="space-y-3 md:hidden">
        {rows.map((row) => {
          const isSelected = row.id === selectedDocumentId;
          return (
            <button
              key={row.id}
              type="button"
              onClick={() => onView(row.id)}
              className={`w-full rounded-xl border p-4 text-left transition-colors ${
                isSelected
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-border bg-background"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                  {row.code}
                </Badge>
                {getStatusBadge(row.status)}
              </div>
              <p className="mt-3 font-medium text-foreground">{row.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{row.type}</p>
              <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
                <span>Version hiện tại: {row.currentVersion}</span>
                <span>Phạm vi: {row.scope}</span>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={(event) => {
                    event.stopPropagation();
                    onView(row.id);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View detail
                </Button>
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(row.id);
                  }}
                >
                  <PencilLine className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </button>
          );
        })}
      </div>

      <div className="hidden md:block">
        <DataTable
          data={rows}
          columns={columns}
          searchPlaceholder="Tìm mã tài liệu, tên tài liệu..."
          onView={(row) => onView((row as DocumentTableRow).id)}
          onEdit={(row) => onEdit((row as DocumentTableRow).id)}
        />
      </div>
    </section>
  );
}
