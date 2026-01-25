import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";

interface BankAccount {
  id: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch: string;
  note: string;
  status: "active" | "inactive";
  logo: string;
}

const initialData: BankAccount[] = [
  {
    id: 1,
    bankName: "Vietcombank",
    accountNumber: "0011001234567",
    accountHolder: "ECOFARM CORP",
    branch: "Sở Giao Dịch",
    note: "Tài khoản chính",
    status: "active",
    logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-Vietcombank.png",
  },
  {
    id: 2,
    bankName: "Agribank",
    accountNumber: "9876543210",
    accountHolder: "ECOFARM CORP",
    branch: "Chi nhánh Cầu Giấy",
    note: "Tài khoản phụ",
    status: "active",
    logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Agribank-V.png",
  },
  {
    id: 3,
    bankName: "MBBank",
    accountNumber: "88889999",
    accountHolder: "NGUYEN VAN A",
    branch: "Chi nhánh Hoàn Kiếm",
    note: "Tài khoản cá nhân",
    status: "inactive",
    logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-MB-Bank-MBB.png",
  },
];

export default function BankPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<BankAccount[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<BankAccount | null>(null);

  const columns: Column<BankAccount>[] = [
    {
      key: "bankName",
      label: "Ngân hàng",
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border bg-white flex items-center justify-center p-1 overflow-hidden shrink-0">
            <img
              src={item.logo}
              alt={value as string}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/40x40?text=" + (value as string)?.[0];
              }}
            />
          </div>
          <div className="font-medium">{value}</div>
        </div>
      ),
    },
    { key: "accountNumber", label: "Số tài khoản" },
    { key: "accountHolder", label: "Chủ tài khoản" },
    { key: "branch", label: "Chi nhánh" },
    { key: "note", label: "Ghi chú" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "outline"}>
          {value === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
  ];

  const filters = [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Không hoạt động", value: "inactive" },
      ],
    },
    {
      key: "bankName",
      label: "Ngân hàng",
      options: [
        { label: "Vietcombank", value: "Vietcombank" },
        { label: "Agribank", value: "Agribank" },
        { label: "MBBank", value: "MBBank" },
        { label: "BIDV", value: "BIDV" },
        { label: "VietinBank", value: "VietinBank" },
      ],
    },
  ];

  const handleDelete = (item: BankAccount) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa tài khoản ngân hàng",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý tài khoản ngân hàng"
      description="Danh sách tài khoản ngân hàng của doanh nghiệp"
      actions={
        <Link href="/bank/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onView={(item) => setLocation(`/bank/${item.id}/edit`)}
        onEdit={(item) => setLocation(`/bank/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm tài khoản..."
        filters={filters}
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa tài khoản này? Hoạt động này không thể hoàn tác."
      />
    </AdminLayout>
  );
}
