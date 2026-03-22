import {
  AdminLayout,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronLeft,
  Edit,
  Download,
  Trash2,
} from "lucide-react";
import { useContractDetail } from "./hooks/useContractDetail";
import { ContractDetailHeader } from "./components/ContractDetailHeader";
import { ContractDetailContent } from "./components/ContractDetailContent";
import { ContractDetailCommodities } from "./components/ContractDetailCommodities";
import { ContractDetailParties } from "./components/ContractDetailParties";

const ContractDetailPage = () => {
  const {
    contract,
    handleBack,
    handleEdit,
    handleDelete,
    handleDownload,
  } = useContractDetail();

  if (!contract) return null;

  return (
    <AdminLayout
      title="Chi tiết hợp đồng"
      description="Xem thông tin chi tiết hợp đồng"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Tải xuống
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa
            </Button>
          </div>
        </div>

        {/* Contract Header */}
        <ContractDetailHeader contract={contract} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contract Content */}
          <ContractDetailContent contract={contract} />

          {/* Commodity Info */}
          <ContractDetailCommodities contract={contract} />
        </div>

        {/* Parties Information */}
        <ContractDetailParties contract={contract} />
      </div>
    </AdminLayout>
  );
};

export default ContractDetailPage;
