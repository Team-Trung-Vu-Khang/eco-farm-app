import useLegalIdentificationStore from "@/stores/useLegalIdentificationStore";
import {
  AdminLayout,
  Button,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { LegalIdentificationTable } from "./components/LegalIdentificationTable";
import {
  LEGAL_FILE_GROUPS,
  LEGAL_STATUS_LABELS,
  type LegalIdentificationStatus,
  type LegalIdentificationRecord,
} from "./data/constants";

const LEGAL_STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "draft", label: LEGAL_STATUS_LABELS.draft },
  { value: "in_review", label: LEGAL_STATUS_LABELS.in_review },
  { value: "approved", label: LEGAL_STATUS_LABELS.approved },
];

export default function LegalIdentificationPage() {
  const [, setLocation] = useLocation();
  const { records, deleteRecord } = useLegalIdentificationStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    LegalIdentificationStatus | "all"
  >("all");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records.filter((record) => {
      if (statusFilter !== "all" && record.status !== statusFilter) {
        return false;
      }

      const searchableFields = [
        record.code,
        record.name,
        record.regionName,
        record.areaName,
        record.address,
        record.ownerName,
        record.scopeSelections
          ?.map((selection) =>
            [selection.regionName, selection.areaName, selection.name]
              .filter(Boolean)
              .join(" "),
          )
          .join(" "),
        record.note || "",
        LEGAL_FILE_GROUPS.map((group) => group.title).join(" "),
      ]
        .join(" ")
        .toLowerCase();

      if (!query) return true;
      return searchableFields.includes(query);
    });
  }, [records, search, statusFilter]);

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId === null) return;
    deleteRecord(selectedId);
    setDeleteOpen(false);
    setSelectedId(null);
  };

  return (
    <AdminLayout
      isDev={true}
      title="Định danh pháp lý"
      description="Danh sách hồ sơ pháp lý cho vùng trồng, khu vực và giấy tờ đính kèm."
      actions={
        <Button onClick={() => setLocation("/legal-identification/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo hồ sơ mới
        </Button>
      }
    >
      <LegalIdentificationTable
        data={filteredRecords as LegalIdentificationRecord[]}
        searchable
        searchPlaceholder="Tìm kiếm hồ sơ, vùng trồng, khu vực, chủ đất..."
        onSearch={setSearch}
        filters={[
          {
            key: "status",
            label: "Trạng thái",
            options: LEGAL_STATUS_OPTIONS,
          },
        ]}
        onFilterChange={(key, value) => {
          if (key === "status") {
            setStatusFilter(value as LegalIdentificationStatus | "all");
          }
        }}
        onView={(id) => setLocation(`/legal-identification/${id}`)}
        onEdit={(id) => setLocation(`/legal-identification/${id}/edit`)}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa hồ sơ pháp lý"
        description="Bạn có chắc chắn muốn xóa hồ sơ pháp lý này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
}
