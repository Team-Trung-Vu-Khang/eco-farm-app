import { useState } from "react";
import { useLocation } from "wouter";
import {
  AdminLayout,
  Card,
  CardContent,
  Button,
  DataTable,
  Badge,
  useToast,
  DeleteDialog,
} from "@tankhang1/eco-shared-ui";
import { Plus, FileText } from "lucide-react";
import { contractTypes } from "./constants";

interface Contract {
  id: number;
  code: string;
  name: string;
  type: string;
  signDate: string;
  status: string;
  partyA: string;
  partyB: string;
  createdAt: string;
}

const ContractPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );

  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 1,
      code: "HD001",
      name: "Hợp đồng mua bán phân bón NPK",
      type: "purchase",
      signDate: "2024-01-10",
      status: "active",
      partyA: "Công ty TNHH Nông nghiệp Xanh",
      partyB: "Nông hộ Trần Văn B",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "HD002",
      name: "Hợp đồng thuê máy móc",
      type: "lease",
      signDate: "2024-01-15",
      status: "active",
      partyA: "HTX Nông nghiệp Hữu cơ",
      partyB: "Nông hộ Trần Văn B",
      createdAt: "2024-01-15",
    },
    {
      id: 3,
      code: "HD003",
      name: "Hợp đồng dịch vụ kỹ thuật",
      type: "service",
      signDate: "2024-02-01",
      status: "pending",
      partyA: "Công ty TNHH Nông nghiệp Xanh",
      partyB: "HTX Nông nghiệp Hữu cơ",
      createdAt: "2024-02-01",
    },
  ]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      draft: { label: "Bản nháp", variant: "secondary" },
      pending: { label: "Chờ ký", variant: "outline" },
      active: { label: "Đang hiệu lực", variant: "default" },
      expired: { label: "Hết hạn", variant: "destructive" },
      terminated: { label: "Đã chấm dứt", variant: "destructive" },
    };
    const statusInfo = statusMap[status] || statusMap.draft;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getTypeName = (typeId: string) => {
    return contractTypes.find((t) => t.id === typeId)?.name || typeId;
  };

  const columns = [
    {
      key: "code",
      label: "Mã hợp đồng",
      accessorKey: "code",
      cell: (row: Contract) => (
        <div className="font-mono font-medium">{row.code}</div>
      ),
    },
    {
      key: "name",
      label: "Tên hợp đồng",
      accessorKey: "name",
      cell: (row: Contract) => (
        <div className="max-w-[300px]">
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {getTypeName(row.type)}
          </div>
        </div>
      ),
    },
    {
      key: "partyA",
      label: "Bên A",
      accessorKey: "partyA",
      cell: (row: Contract) => <div className="text-sm">{row.partyA}</div>,
    },
    {
      key: "partyB",
      label: "Bên B",
      accessorKey: "partyB",
      cell: (row: Contract) => <div className="text-sm">{row.partyB}</div>,
    },
    {
      key: "signDate",
      label: "Ngày ký",
      accessorKey: "signDate",
      cell: (row: Contract) => <div className="text-sm">{row.signDate}</div>,
    },
    {
      key: "status",
      label: "Trạng thái",
      accessorKey: "status",
      cell: (row: Contract) => getStatusBadge(row.status),
    },
  ];

  const handleView = (contract: Contract) => {
    setLocation(`/contract/${contract.id}`);
  };

  const handleEdit = (contract: Contract) => {
    setLocation(`/contract/${contract.id}/edit`);
  };

  const handleDeleteClick = (contract: Contract) => {
    setSelectedContract(contract);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedContract) {
      setContracts(contracts.filter((c) => c.id !== selectedContract.id));
      toast({
        title: "Đã xóa hợp đồng",
        description: `Hợp đồng ${selectedContract.code} đã được xóa thành công.`,
      });
      setDeleteDialogOpen(false);
      setSelectedContract(null);
    }
  };

  return (
    <AdminLayout
      title="Quản lý hợp đồng"
      description="Quản lý hợp đồng theo đơn vị sở hữu"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Tổng hợp đồng
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {contracts.length}
                  </div>
                </div>
                <FileText className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Đang hiệu lực
                  </div>
                  <div className="text-2xl font-bold mt-1 text-green-600">
                    {contracts.filter((c) => c.status === "active").length}
                  </div>
                </div>
                <FileText className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Chờ ký</div>
                  <div className="text-2xl font-bold mt-1 text-yellow-600">
                    {contracts.filter((c) => c.status === "pending").length}
                  </div>
                </div>
                <FileText className="w-8 h-8 text-yellow-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Hết hạn</div>
                  <div className="text-2xl font-bold mt-1 text-red-600">
                    {contracts.filter((c) => c.status === "expired").length}
                  </div>
                </div>
                <FileText className="w-8 h-8 text-red-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Danh sách hợp đồng</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Quản lý tất cả hợp đồng trong hệ thống
                </p>
              </div>
              <Button onClick={() => setLocation("/contract/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo hợp đồng mới
              </Button>
            </div>

            <DataTable
              columns={columns}
              data={contracts}
              searchPlaceholder="Tìm kiếm hợp đồng..."
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Xóa hợp đồng"
        description={
          selectedContract
            ? `Bạn có chắc chắn muốn xóa hợp đồng "${selectedContract.name}" (${selectedContract.code})? Hành động này không thể hoàn tác.`
            : ""
        }
      />
    </AdminLayout>
  );
};

export default ContractPage;
