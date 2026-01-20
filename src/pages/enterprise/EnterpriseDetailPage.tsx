import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import {
  Building2,
  User,
  MapPin,
  FileText,
  Image,
  Check,
  Users,
  Info,
  Globe,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  ChevronLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@tankhang1/eco-shared-ui";
import { Badge } from "@tankhang1/eco-shared-ui";
import { AdminLayout } from "@tankhang1/eco-shared-ui";
import { Button } from "@tankhang1/eco-shared-ui";
import { Separator } from "@tankhang1/eco-shared-ui";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@tankhang1/eco-shared-ui";

interface Branch {
  name: string;
  taxCode: string;
  phone: string;
  taxAddress: string;
  email: string;
  address: string;
  note: string;
}

interface BankAccount {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branch: string;
  note: string;
}

export default function EnterpriseDetailPage() {
  const [, params] = useRoute("/enterprise/:id");
  const [, setLocation] = useLocation();

  // Mock data fetching
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        id: params?.id || "DN2024001",
        type: "enterprise",
        code: "DN2024001",
        name: "Công ty Cổ phần Nông nghiệp Xanh EcoFarm",
        brandName: "EcoFarm Vietnam",
        taxCode: "0101234567",
        taxAddress: "Tầng 5, Tòa nhà ABC, Cầu Giấy, Hà Nội",
        classification: "production",
        foundedDate: "2020-03-15",
        representative: "Nguyễn Văn Giám Đốc",
        phone: "02438888999",
        email: "contact@ecofarm.vn",
        website: "https://ecofarm.vn",
        province: "Hà Nội",
        district: "Cầu Giấy",
        ward: "Dịch Vọng",
        address: "Số 123 Đường Xuân Thủy",
        description:
          "Doanh nghiệp tiên phong trong lĩnh vực nông nghiệp công nghệ cao, chuyên sản xuất và cung ứng rau sạch chuẩn VietGAP. Chúng tôi cam kết mang đến những sản phẩm an toàn, chất lượng nhất cho người tiêu dùng.",
        branches: [
          {
            name: "Chi nhánh Miền Nam",
            taxCode: "0101234567-001",
            phone: "02839999888",
            taxAddress: "Quận 1, TP.HCM",
            email: "hcm@ecofarm.vn",
            address: "Số 456 Nguyễn Thị Minh Khai, Q1",
            note: "Văn phòng đại diện phía Nam",
          },
        ],
        bankAccounts: [
          {
            bankName: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
            accountHolder: "ECOFARM CORP",
            accountNumber: "0011001234567",
            branch: "Sở Giao Dịch",
            note: "Tài khoản chính",
          },
          {
            bankName: "Ngân hàng TMCP Quân Đội (MBBank)",
            accountHolder: "NGUYEN VAN A",
            accountNumber: "88889999",
            branch: "Hoàn Kiếm",
            note: "Tài khoản cá nhân",
          },
        ],
        documents: [
          {
            name: "giay_phep_kinh_doanh.pdf",
            type: "application/pdf",
            size: "2.5MB",
            date: "15/03/2020",
          },
          {
            name: "chung_chi_vietgap.jpg",
            type: "image/jpeg",
            size: "1.8MB",
            date: "20/04/2021",
          },
        ],
        status: "active",
        createdAt: "2024-01-15T10:30:00Z",
      });
    }, 500);
  }, []);

  if (!data) {
    return (
      <AdminLayout title="Chi tiết đơn vị" description="Đang tải thông tin...">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={data.name}
      description={`Chi tiết thông tin ${
        data.type === "enterprise"
          ? "doanh nghiệp"
          : data.type === "cooperative"
            ? "hợp tác xã"
            : "nông hộ"
      }`}
      actions={
        <Button variant="outline" onClick={() => setLocation("/enterprise")}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Overview & Contact - Sticky */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-32 bg-linear-to-r from-blue-500/10 to-green-500/10 flex items-center justify-center">
              {data.type === "enterprise" ? (
                <Building2 className="w-16 h-16 text-blue-600/50" />
              ) : data.type === "cooperative" ? (
                <Users className="w-16 h-16 text-orange-600/50" />
              ) : (
                <User className="w-16 h-16 text-green-600/50" />
              )}
            </div>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-20 h-20 -mt-12 rounded-full border-4 border-background bg-white shadow-sm flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-primary">
                  {data.brandName.charAt(0)}
                </span>
              </div>
              <CardTitle className="text-xl">{data.brandName}</CardTitle>
              <CardDescription>{data.name}</CardDescription>
              <div className="flex justify-center gap-2 mt-2">
                <Badge
                  variant={data.status === "active" ? "default" : "secondary"}
                >
                  {data.status === "active"
                    ? "Đang hoạt động"
                    : "Dừng hoạt động"}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {data.classification === "production"
                    ? "Sản xuất"
                    : data.classification === "processing"
                      ? "Chế biến"
                      : data.classification === "trading"
                        ? "Thương mại"
                        : "Dịch vụ"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{data.code}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>
                    Đại diện:{" "}
                    <span className="font-medium">{data.representative}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    Thành lập:{" "}
                    {new Date(data.foundedDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span>
                    {data.address}, {data.ward}, {data.district},{" "}
                    {data.province}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={`tel:${data.phone}`}
                    className="hover:underline hover:text-primary transition-colors"
                  >
                    {data.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={`mailto:${data.email}`}
                    className="hover:underline hover:text-primary transition-colors"
                  >
                    {data.email}
                  </a>
                </div>
                {data.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={data.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-primary transition-colors text-blue-600"
                    >
                      {data.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => setLocation(`/enterprise/${data.id}/edit`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Xóa
            </Button>
          </div>
        </div>

        {/* Right Column: Details Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
              <TabsTrigger
                value="info"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Thông tin chung
              </TabsTrigger>
              <TabsTrigger
                value="branches"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Chi nhánh ({data.branches.length})
              </TabsTrigger>
              <TabsTrigger
                value="bankAccounts"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Ngân hàng ({data.bankAccounts?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Tài liệu ({data.documents.length})
              </TabsTrigger>
            </TabsList>

            <div className="pt-6">
              <TabsContent value="info" className="m-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      Thông tin thuế & Pháp lý
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Mã số thuế
                        </div>
                        <div className="font-medium text-base">
                          {data.taxCode}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Ngày cấp
                        </div>
                        <div className="font-medium text-base">15/03/2020</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Cơ quan thuế
                        </div>
                        <div className="font-medium text-base">
                          Chi cục thuế Quận Cầu Giấy
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Địa chỉ đăng ký thuế
                        </div>
                        <div className="font-medium text-base">
                          {data.taxAddress}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mô tả chi tiết</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {data.description || "Chưa có mô tả chi tiết."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="branches" className="m-0">
                <div className="grid gap-4">
                  {data.branches.map((branch: Branch, i: number) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{branch.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" /> {branch.address}
                            </p>
                          </div>
                          <Badge variant="outline">Hoạt động</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                          <div>
                            <span className="text-muted-foreground">
                              Mã số thuế:
                            </span>
                            <div className="font-medium mt-0.5">
                              {branch.taxCode || "-"}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Điện thoại:
                            </span>
                            <div className="font-medium mt-0.5">
                              {branch.phone || "-"}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Email:
                            </span>
                            <div className="font-medium mt-0.5">
                              {branch.email || "-"}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Ghi chú:
                            </span>
                            <div className="font-medium mt-0.5 max-w-full truncate">
                              {branch.note || "-"}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bankAccounts" className="m-0">
                <div className="grid gap-4">
                  {data.bankAccounts?.map((account: BankAccount, i: number) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">
                                {account.bankName}
                              </h3>
                              <p className="text-sm text-muted-foreground font-mono">
                                {account.accountNumber}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-green-600 bg-green-50"
                          >
                            Hoạt động
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                          <div>
                            <span className="text-muted-foreground">
                              Chủ tài khoản:
                            </span>
                            <div className="font-medium mt-0.5 uppercase">
                              {account.accountHolder}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Chi nhánh:
                            </span>
                            <div className="font-medium mt-0.5">
                              {account.branch || "-"}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">
                              Ghi chú:
                            </span>
                            <div className="font-medium mt-0.5">
                              {account.note || "-"}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.documents.map((doc: any, i: number) => (
                    <Card
                      key={i}
                      className="group hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          {doc.type.includes("image") ? (
                            <Image className="w-5 h-5 text-blue-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className="font-medium text-sm truncate"
                            title={doc.name}
                          >
                            {doc.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>{doc.date}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}
