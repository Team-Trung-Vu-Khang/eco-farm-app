import {
  AdminLayout,
  Button,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  LEGAL_FILE_GROUPS,
  type LegalIdentificationRecord,
} from "./data/constants";
import { LegalIdentificationTable } from "./components/LegalIdentificationTable";
import useLegalIdentificationStore from "@/stores/useLegalIdentificationStore";

export default function LegalIdentificationPage() {
  const [, setLocation] = useLocation();
  const { records, deleteRecord } = useLegalIdentificationStore();
  const [search, setSearch] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return records;
    return records.filter((record) => {
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

      return searchableFields.includes(query);
    });
  }, [records, search]);

  const totalFiles = useMemo(
    () =>
      records.reduce(
        (sum, record) =>
          sum +
          LEGAL_FILE_GROUPS.reduce(
            (groupSum, group) => groupSum + (record.documents[group.id]?.length || 0),
            0,
          ),
        0,
      ),
    [records],
  );

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
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200/70 shadow-sm">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Tổng hồ sơ
          </div>
          <div className="mt-1 text-xl font-semibold text-slate-900">
            {records.length}
          </div>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200/70 shadow-sm">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Đang hiển thị
          </div>
          <div className="mt-1 text-xl font-semibold text-slate-900">
            {filteredRecords.length}
          </div>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200/70 shadow-sm">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Tổng file
          </div>
          <div className="mt-1 text-xl font-semibold text-slate-900">
            {totalFiles}
          </div>
        </div>
      </div>

      <LegalIdentificationTable
        data={filteredRecords as LegalIdentificationRecord[]}
        searchable
        searchPlaceholder="Tìm kiếm hồ sơ, vùng trồng, khu vực, chủ đất..."
        onSearch={setSearch}
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
