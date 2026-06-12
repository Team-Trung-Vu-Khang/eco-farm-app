import { useMemo } from "react";
import { AdminLayout, Badge, Card, CardContent, DataTable, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, MapPinned, Layers3 } from "lucide-react";
import { PROVINCES, type Province } from "../../constants/province";

type ProvinceRow = Province & {
  districtCount: number;
  districtNames: string;
};

export default function ProvincePage() {
  const rows = useMemo<ProvinceRow[]>(
    () =>
      PROVINCES.map((province) => ({
        ...province,
        districtCount: province.districts.length,
        districtNames: province.districts.map((district) => district.name).join(", "),
      })),
    [],
  );

  const columns: Column<ProvinceRow>[] = useMemo(
    () => [
      {
        key: "code",
        label: "Mã tỉnh",
        render: (value) => (
          <span className="font-mono text-xs font-bold text-slate-700">
            {value as string}
          </span>
        ),
      },
      {
        key: "name",
        label: "Tên tỉnh/thành",
        render: (value, item) => (
          <div className="space-y-1">
            <div className="font-semibold text-slate-900">{value as string}</div>
            <p className="text-xs text-slate-500">
              {item.districtCount} đơn vị hành chính cấp quận/huyện
            </p>
          </div>
        ),
      },
      {
        key: "districtCount",
        label: "Quận/Huyện",
        render: (value) => (
          <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700">
            {value as number}
          </Badge>
        ),
      },
      {
        key: "districtNames",
        label: "Danh sách quận/huyện",
        render: (value) => (
          <span className="text-sm text-slate-600">{value as string}</span>
        ),
      },
    ],
    [],
  );

  const totalDistricts = rows.reduce((sum, province) => sum + province.districtCount, 0);
  const largestProvince = rows.reduce((best, province) =>
    province.districtCount > best.districtCount ? province : best,
  rows[0]);

  return (
    <AdminLayout
      isDev={true}
      title="Danh sách tỉnh/thành"
      description="Tra cứu danh mục tỉnh/thành và các quận/huyện trực thuộc"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-none shadow-sm ring-1 ring-slate-200/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Layers3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tổng tỉnh/thành
                </p>
                <div className="text-2xl font-black text-slate-900">
                  {rows.length}
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
                  Tổng quận/huyện
                </p>
                <div className="text-2xl font-black text-slate-900">
                  {totalDistricts}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-slate-200/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                <Building2 className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tỉnh nhiều quận/huyện nhất
                </p>
                <div className="text-lg font-black text-slate-900">
                  {largestProvince?.name}
                </div>
                <p className="text-xs text-slate-500">
                  {largestProvince?.districtCount} đơn vị
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm ring-1 ring-slate-200/60">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">
                Bảng danh sách tỉnh/thành
              </h2>
              <p className="text-sm text-slate-500">
                Dữ liệu này chỉ dùng để tra cứu và hiển thị, không hỗ trợ CRUD.
              </p>
            </div>

            <DataTable
              columns={columns}
              data={rows}
              searchPlaceholder="Tìm theo mã tỉnh, tên tỉnh hoặc quận/huyện..."
              selectable={false}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
