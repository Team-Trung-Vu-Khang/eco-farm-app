import { AdminLayout, DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ProvinceWardDetailModal } from "./components/ProvinceWardDetailModal";
import { columns } from "./data/columns";
import { useProvincePage } from "./hooks/useProvincePage";

export default function ProvincePage() {
  const {
    data,
    loading,
    error,
    response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    selectedProvince,
    setSelectedProvince,
    handleSearch,
    handleFilterChange,
  } = useProvincePage();

  const provinceStatusOptions = [
    { value: "active", label: "Hoạt động" },
    { value: "inactive", label: "Ngừng hoạt động" },
    { value: "archived", label: "Đã lưu trữ" },
  ] as const;

  return (
    <AdminLayout
      isDev={true}
      title="Danh sách tỉnh/thành"
      description="Tra cứu danh mục tỉnh/thành và các xã/phường trực thuộc theo dữ liệu hành chính Việt Nam"
    >
      <div className="space-y-6">
        {error ? (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <span className="text-sm font-medium">⚠️ {error}</span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            searchable
            searchPlaceholder="Tìm theo mã, tên tỉnh/thành..."
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
                options: [...provinceStatusOptions],
              },
            ]}
            selectable={false}
            loading={loading}
            onView={setSelectedProvince}
          />
        )}
      </div>

      {selectedProvince && (
        <ProvinceWardDetailModal
          province={selectedProvince}
          onClose={() => setSelectedProvince(null)}
        />
      )}
    </AdminLayout>
  );
}
