import { useRoute, useLocation } from "wouter";
import {
  AdminLayout,
  Card,
  CardContent,
  Button,
  Badge,
  Separator,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronLeft,
  Edit,
  FileText,
  Calendar,
  Building2,
  Package,
  Download,
  Trash2,
} from "lucide-react";
import {
  contractTypes,
  mockEnterprises,
  commodityTypes,
  packagingSpecs,
  units,
} from "./constants";

const ContractDetailPage = () => {
  const [, params] = useRoute("/contract/:id");
  const [, setLocation] = useLocation();

  // Mock data - in real app, fetch from API
  const contract = {
    id: params?.id || "1",
    code: "HD001",
    name: "Hợp đồng mua bán phân bón NPK",
    type: "purchase",
    signDate: "2024-01-10",
    status: "active",
    isAppendix: false,
    parentContractCode: null,
    contentType: "file",
    contentFileName: "hop-dong-mua-ban-phan-bon.pdf",
    commodities: [
      {
        id: "1",
        commodityType: "fertilizer",
        commodityId: "1",
        commodityName: "Phân NPK 16-16-8",
        commodityCode: "PB001",
        specType: "detailed" as "general" | "detailed",
        packagingSpec: "",
        quantity: "100",
        unit: "bag",
      },
      {
        id: "2",
        commodityType: "pesticide",
        commodityId: "2",
        commodityName: "Thuốc trừ sâu Abamectin 1.8EC",
        commodityCode: "BVTV002",
        specType: "general" as "general" | "detailed",
        packagingSpec: "bottle500ml",
        quantity: "",
        unit: "",
      },
    ],
    partyA: mockEnterprises[0],
    partyB: mockEnterprises[1],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  };

  const contractType = contractTypes.find((t) => t.id === contract.type);

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

  return (
    <AdminLayout
      title="Chi tiết hợp đồng"
      description="Xem thông tin chi tiết hợp đồng"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setLocation("/contract")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setLocation(`/contract/${contract.id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Tải xuống
            </Button>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa
            </Button>
          </div>
        </div>

        {/* Contract Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{contract.name}</h2>
                  {getStatusBadge(contract.status)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Mã hợp đồng:{" "}
                  <span className="font-mono font-medium">{contract.code}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Loại hợp đồng
                </div>
                <div className="font-medium">{contractType?.name}</div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  Ngày ký kết
                </div>
                <div className="font-medium">{contract.signDate}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Ngày tạo</div>
                <div className="font-medium">{contract.createdAt}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">
                  Cập nhật lần cuối
                </div>
                <div className="font-medium">{contract.updatedAt}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contract Content */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Nội dung hợp đồng
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Loại hợp đồng
                  </div>
                  <div className="font-medium">
                    {contract.isAppendix ? "Phụ lục hợp đồng" : "Hợp đồng mới"}
                  </div>
                </div>

                {contract.isAppendix && contract.parentContractCode && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Hợp đồng gốc
                    </div>
                    <div className="font-medium">
                      {contract.parentContractCode}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Nội dung
                  </div>
                  {contract.contentType === "file" ? (
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border">
                      <FileText className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {contract.contentFileName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          File đính kèm
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-lg border">
                      <div className="text-sm">Nội dung văn bản</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commodity Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Danh sách hàng hóa ({contract.commodities.length})
              </h3>

              <div className="space-y-3">
                {contract.commodities.map((commodity, index) => {
                  const commodityType = commodityTypes.find(
                    (t) => t.id === commodity.commodityType,
                  );
                  return (
                    <div
                      key={commodity.id}
                      className="p-4 bg-slate-50 rounded-lg border"
                    >
                      <div className="flex items-start gap-3">
                        <div className="font-semibold text-primary">
                          {index + 1}.
                        </div>
                        <div className="flex-1 space-y-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">
                                {commodityType?.icon}
                              </span>
                              <span className="font-semibold">
                                {commodity.commodityName}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Mã: {commodity.commodityCode}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {commodityType?.name}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {commodity.specType === "general"
                                ? packagingSpecs.find(
                                    (p) => p.id === commodity.packagingSpec,
                                  )?.name
                                : `${commodity.quantity} ${units.find((u) => u.id === commodity.unit)?.name}`}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Parties Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Thông tin các bên
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Party A */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-700 border-blue-300"
                  >
                    Bên A
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Bên cung cấp
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="font-semibold text-lg">
                      {contract.partyA.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Mã: {contract.partyA.code}
                    </div>
                  </div>
                  <Separator />
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-muted-foreground">Mã số thuế:</span>{" "}
                      <span className="font-medium">
                        {contract.partyA.taxCode}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Đại diện:</span>{" "}
                      <span className="font-medium">
                        {contract.partyA.representative}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Điện thoại:</span>{" "}
                      <span className="font-medium">
                        {contract.partyA.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Địa chỉ:</span>{" "}
                      <span className="font-medium">
                        {contract.partyA.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Party B */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 border-green-300"
                  >
                    Bên B
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Bên nhận
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="font-semibold text-lg">
                      {contract.partyB.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Mã: {contract.partyB.code}
                    </div>
                  </div>
                  <Separator />
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-muted-foreground">Mã số thuế:</span>{" "}
                      <span className="font-medium">
                        {contract.partyB.taxCode}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Đại diện:</span>{" "}
                      <span className="font-medium">
                        {contract.partyB.representative}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Điện thoại:</span>{" "}
                      <span className="font-medium">
                        {contract.partyB.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Địa chỉ:</span>{" "}
                      <span className="font-medium">
                        {contract.partyB.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ContractDetailPage;
