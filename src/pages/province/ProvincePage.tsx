import { useState, useEffect, useMemo } from "react";
import {
  AdminLayout,
  Badge,
  Card,
  CardContent,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, MapPinned, Eye, X, Hash, Ruler } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ward {
  Type: string;
  Code: string;
  Name: string;
  NameEn: string;
  FullName: string;
  FullNameEn: string;
  CodeName: string;
  ProvinceCode: string;
  AdministrativeUnitId: number;
}

interface ProvinceAPI {
  Type: string;
  Code: string;
  Name: string;
  NameEn: string;
  FullName: string;
  FullNameEn: string;
  CodeName: string;
  AdministrativeUnitId: number;
  Wards: Ward[];
}

interface ProvinceRow {
  code: string;
  name: string;
  fullName: string;
  wardCount: number;
  wards: Ward[];
}

// ─── Ward Detail Modal ────────────────────────────────────────────────────────

function WardDetailModal({
  province,
  onClose,
}: {
  province: ProvinceRow;
  onClose: () => void;
}) {
  const wardColumns: Column<Ward>[] = useMemo(
    () => [
      {
        key: "Code",
        label: "Mã Xã/Phường",
        render: (value) => (
          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            {value as string}
          </span>
        ),
      },
      {
        key: "FullName",
        label: "Tên Xã/Phường",
        render: (value, item) => (
          <div>
            <div className="font-semibold text-slate-900 text-sm">
              {value as string}
            </div>
            {/* <div className="text-xs text-slate-400">{item.FullNameEn}</div> */}
          </div>
        ),
      },
      {
        key: "NameEn",
        label: "Postcode",
        render: (_value, item) => (
          <span className="text-sm text-slate-600 font-mono">{item.Code}</span>
        ),
      },
      {
        key: "AdministrativeUnitId",
        label: "Diện tích",
        render: () => <span className="text-sm text-slate-400 italic">—</span>,
      },
    ],
    [],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {province.code}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                Chi tiết Xã/Phường
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              {province.fullName}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {province.wardCount} xã/phường trực thuộc
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500 hover:text-slate-700 mt-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm">
            <Hash className="h-4 w-4 text-blue-500" />
            <span className="text-slate-600">
              Tổng xã/phường:{" "}
              <strong className="text-slate-900">{province.wardCount}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Ruler className="h-4 w-4 text-emerald-500" />
            <span className="text-slate-600">
              Tổng diện tích:{" "}
              <strong className="text-slate-400 italic">Chưa có dữ liệu</strong>
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <DataTable
            // @ts-ignore
            columns={wardColumns}
            // @ts-ignore
            data={province.wards}
            searchPlaceholder="Tìm xã/phường..."
            selectable={false}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const API_URL =
  "https://raw.githubusercontent.com/thanglequoc/vietnamese-provinces-database/refs/heads/master/mongodb/mongo_data_vn_unit.json";

export default function ProvincePage() {
  const [data, setData] = useState<ProvinceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceRow | null>(
    null,
  );

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải dữ liệu tỉnh/thành.");
        return res.json() as Promise<ProvinceAPI[]>;
      })
      .then((json) => {
        const rows: ProvinceRow[] = json.map((p) => ({
          code: p.Code,
          name: p.Name,
          fullName: p.FullName,
          wardCount: p.Wards.length,
          wards: p.Wards,
        }));
        setData(rows);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalWards = useMemo(
    () => data.reduce((sum, p) => sum + p.wardCount, 0),
    [data],
  );

  const columns: Column<ProvinceRow & { id: any }>[] = useMemo(
    () => [
      {
        key: "code",
        label: "Mã Tỉnh/Thành",
        render: (value) => (
          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
            {value as string}
          </span>
        ),
      },
      {
        key: "fullName",
        label: "Tỉnh/Thành",
        render: (value, item) => (
          <div className="space-y-0.5">
            <div className="font-semibold text-slate-900 text-sm">
              {value as string}
            </div>
            {/* <div className="text-xs text-slate-400">{item.name}</div> */}
          </div>
        ),
      },
      {
        key: "wardCount",
        label: "Xã/Phường",
        render: (value) => (
          <Badge
            variant="secondary"
            className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold"
          >
            {value as number} xã/phường
          </Badge>
        ),
      },
      {
        key: "code",
        label: "Tổng diện tích",
        render: () => <span className="text-sm text-slate-400 italic">—</span>,
      },
      {
        key: "code",
        label: "Chi tiết",
        render: (_value, item) => (
          <button
            onClick={() => setSelectedProvince(item)}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            title={`Xem chi tiết ${item.fullName}`}
          >
            <Eye className="h-4 w-4" />
            <span>Xem</span>
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <AdminLayout
      isDev={true}
      title="Danh sách tỉnh/thành"
      description="Tra cứu danh mục tỉnh/thành và các xã/phường trực thuộc theo dữ liệu hành chính Việt Nam"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border-none shadow-sm ring-1 ring-slate-200/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tổng tỉnh/thành
                </p>
                <div className="text-2xl font-black text-slate-900">
                  {loading ? (
                    <span className="text-slate-300 animate-pulse">—</span>
                  ) : (
                    data.length
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-slate-200/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                <MapPinned className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tổng xã/phường
                </p>
                <div className="text-2xl font-black text-slate-900">
                  {loading ? (
                    <span className="text-slate-300 animate-pulse">—</span>
                  ) : (
                    totalWards.toLocaleString("vi-VN")
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="border-none shadow-sm ring-1 ring-slate-200/60">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">
                Bảng danh sách tỉnh/thành
              </h2>
              {/* <p className="text-sm text-slate-500">
                Dữ liệu từ{" "}
                <a
                  href="https://github.com/thanglequoc/vietnamese-provinces-database"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  vietnamese-provinces-database
                </a>
                . Chỉ dùng để tra cứu, không hỗ trợ CRUD.
              </p> */}
            </div>

            {error ? (
              <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
                <span className="text-sm font-medium">⚠️ {error}</span>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
                <span className="text-sm">Đang tải dữ liệu tỉnh/thành...</span>
              </div>
            ) : (
              <DataTable
                // @ts-ignore
                data={data}
                columns={columns}
                selectable={false}
                searchPlaceholder="Tìm theo mã, tên tỉnh/thành..."
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ward Detail Modal */}
      {selectedProvince && (
        <WardDetailModal
          province={selectedProvince}
          onClose={() => setSelectedProvince(null)}
        />
      )}
    </AdminLayout>
  );
}
