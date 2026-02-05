import { useState } from "react";
import { AdminLayout, DataTable, type Column } from "@tankhang1/eco-shared-ui";
import { bankList, type Bank } from "../../constants/banks";

export default function BankDirectoryPage() {
  const [data] = useState<Bank[]>(bankList);

  const columns: Column<Bank>[] = [
    {
      key: "id",
      label: "ID",
      render: (value) => (
        <span className="font-mono text-muted-foreground">#{value}</span>
      ),
    },
    {
      key: "name",
      label: "Ngân hàng",
      render: (value, item) => (
        <div className="flex items-center gap-4 py-1">
          <div className="w-10 h-10 rounded-xl border bg-white flex items-center justify-center p-2 shadow-sm overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
            <img
              src={item.logo}
              alt={value as string}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/48x48?text=" + (value as string)?.[0];
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-tight">{value}</span>
            <span className="text-sm text-muted-foreground line-clamp-1">
              {item.fullName}
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Danh mục ngân hàng"
      description="Danh sách các ngân hàng được hỗ trợ trong hệ thống"
    >
      <DataTable
        columns={columns}
        data={data}
        pageSize={10}
        searchPlaceholder="Tìm kiếm tên ngân hàng..."
        // No actions (onEdit, onDelete, onView) to keep it read-only
      />
    </AdminLayout>
  );
}
