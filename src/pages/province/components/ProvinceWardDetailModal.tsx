import { useEffect, useMemo, useState } from "react";
import { DataTable, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { X } from "lucide-react";
import { masterDataApi } from "@/features/master-data";
import type {
  MasterDataPageResponse,
  MasterDataStatus,
} from "@/features/master-data/types/master-data.type";
import type { ProvinceRow, ProvinceWard } from "../types";

interface ProvinceWardDetailModalProps {
  province: ProvinceRow;
  onClose: () => void;
}

interface WardRow extends ProvinceWard {
  id: string;
}

const ALL_STATUS = "all" as const;
const DEFAULT_PAGE_SIZE = 20;

type WardStatusFilter = MasterDataStatus | typeof ALL_STATUS;

export function ProvinceWardDetailModal({
  province,
  onClose,
}: ProvinceWardDetailModalProps) {
  const [wardRows, setWardRows] = useState<WardRow[]>([]);
  const [response, setResponse] =
    useState<MasterDataPageResponse<WardRow> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<WardStatusFilter>(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(null);

    masterDataApi
      .listGeoWards({
        provinceCode: province.code,
        keyword: search.trim() || undefined,
        status: status === ALL_STATUS ? undefined : status,
        page: Math.max(currentIndex - 1, 0),
        size: pageSize,
      })
      .then((result) => {
        if (!mounted) return;

        const rows = result.content.map((ward, index) => ({
          id: ward.code ?? ward.fullName ?? `${province.code}-${index}`,
          ...ward,
        }));

        setWardRows(rows);
        setResponse({
          ...result,
          content: rows,
        });
      })
      .catch((err: Error) => {
        if (!mounted) return;
        setError(err.message || "Không thể tải danh sách xã/phường.");
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [currentIndex, pageSize, province.code, search, status]);

  const wardColumns: Column<WardRow>[] = useMemo(
    () => [
      {
        key: "code",
        label: "Mã Xã/Phường",
        render: (value: unknown) => (
          <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-700">
            {String(value ?? "")}
          </span>
        ),
      },
      {
        key: "fullName",
        label: "Tên Xã/Phường",
        render: (value: unknown) => (
          <div className="space-y-0.5">
            <div className="text-sm font-semibold text-slate-900">
              {String(value ?? "")}
            </div>
          </div>
        ),
      },
      {
        key: "administrativeUnitId",
        label: "Loại đơn vị",
        render: (value: unknown) => (
          <span className="text-sm text-slate-500">
            {value ? String(value) : "—"}
          </span>
        ),
      },
    ],
    [],
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(
        value === ALL_STATUS ? ALL_STATUS : (value as MasterDataStatus),
      );
      setCurrentIndex(1);
    }
  };

  const totalWardCount = response?.totalElements ?? province.wardCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-6">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-600">
                {province.code}
              </span>
              <span className="text-xs uppercase tracking-wider text-slate-400">
                Chi tiết Xã/Phường
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              {province.fullName}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {totalWardCount} xã/phường trực thuộc
            </p>
          </div>
          <button
            onClick={onClose}
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              ⚠️ {error}
            </div>
          ) : (
            <DataTable
              columns={wardColumns}
              data={wardRows}
              searchable
              searchPlaceholder="Tìm xã/phường..."
              pageSize={pageSize}
              currentIndex={currentIndex}
              totalElements={response?.totalElements}
              totalPages={response?.totalPages}
              onSearch={handleSearch}
              onPageSize={setPageSize}
              onIndexChange={setCurrentIndex}
              onFilterChange={handleFilterChange}
              filters={[
                {
                  key: "status",
                  label: "Trạng thái",
                  options: [
                    { value: "active", label: "Hoạt động" },
                    { value: "inactive", label: "Ngừng hoạt động" },
                    { value: "archived", label: "Đã lưu trữ" },
                  ],
                },
              ]}
              selectable={false}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
