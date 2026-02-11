import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import {
  User,
  MapPin,
  FileText,
  Image,
  Check,
  Info,
  Globe,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  ChevronLeft,
  Search,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
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
import useEnterpriseStore from "../../stores/useEnterpriseStore";
import { type Branch, type BankAccount } from "./constants";

export default function EnterpriseDetailPage() {
  const [, params] = useRoute("/enterprise/:id");
  const [, setLocation] = useLocation();
  const getEnterpriseById = useEnterpriseStore(
    (state) => state.getEnterpriseById,
  );

  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [branchSearchQuery, setBranchSearchQuery] = useState("");

  const data = params?.id ? getEnterpriseById(Number(params.id)) : undefined;

  if (!data) {
    return (
      <AdminLayout title="Chi tiết đơn vị" description="Đang tải thông tin...">
        <div className="flex flex-col items-center justify-center p-12 gap-4">
          <div className="text-muted-foreground">
            Không tìm thấy thông tin doanh nghiệp
          </div>
          <Button variant="outline" onClick={() => setLocation("/enterprise")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
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
          <Card className="overflow-hidden relative shadow-md">
            <div className="h-32 bg-gray-100 flex items-center justify-center relative">
              <img
                src={
                  data.image ||
                  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
                }
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 z-10">
                <div
                  className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg rounded-bl-xl ${data.status === "active" ? "bg-green-600" : "bg-gray-500"}`}
                >
                  {data.status === "active"
                    ? "Đang hoạt động"
                    : "Dừng hoạt động"}
                </div>
              </div>
            </div>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-20 h-20 -mt-12 rounded-full border-4 border-background bg-white shadow-sm flex items-center justify-center mb-2 overflow-hidden relative">
                {data.image ? (
                  <img
                    src={data.image}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {data.name.charAt(0)}
                  </span>
                )}
              </div>
              <CardTitle className="text-xl flex items-center justify-center gap-2">
                {data.brandName || data.name}
                {data.status === "active" && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                )}
              </CardTitle>
              <CardDescription>{data.name}</CardDescription>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {Array.isArray(data.classification) ? (
                  data.classification.map((item: string) => (
                    <Badge key={item} variant="outline" className="capitalize">
                      {item === "production"
                        ? "Sản xuất"
                        : item === "processing"
                          ? "Chế biến"
                          : item === "trading"
                            ? "Thương mại"
                            : "Dịch vụ"}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="capitalize">
                    {data.classification === "production"
                      ? "Sản xuất"
                      : data.classification === "processing"
                        ? "Chế biến"
                        : data.classification === "trading"
                          ? "Thương mại"
                          : "Dịch vụ"}
                  </Badge>
                )}
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
                    <span className="font-medium">
                      {data.representative || "---"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    Thành lập:{" "}
                    {data.foundedDate
                      ? new Date(data.foundedDate).toLocaleDateString("vi-VN")
                      : "---"}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span>
                    {data.address}
                    {data.ward ? `, ${data.ward}` : ""}
                    {data.district ? `, ${data.district}` : ""}
                    {data.province ? `, ${data.province}` : ""}
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
                Chi nhánh ({data.branches?.length || 0})
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
                Tài liệu ({data.documents?.length || 0})
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
                        <div className="font-medium text-base">
                          {data.issueDate
                            ? new Date(data.issueDate).toLocaleDateString(
                                "vi-VN",
                              )
                            : "---"}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Cơ quan thuế
                        </div>
                        <div className="font-medium text-base">
                          {data.taxAuthority || "---"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Địa chỉ đăng ký thuế
                        </div>
                        <div className="font-medium text-base">
                          {data.taxAddress || "---"}
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

              <TabsContent value="branches" className="m-0 space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm chi nhánh..."
                    className="pl-10"
                    value={branchSearchQuery}
                    onChange={(e) => setBranchSearchQuery(e.target.value)}
                  />
                </div>
                <div className="grid gap-4">
                  {data.branches?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có chi nhánh nào.
                    </div>
                  )}

                  {data.branches
                    ?.filter(
                      (b: Branch) =>
                        b.name
                          .toLowerCase()
                          .includes(branchSearchQuery.toLowerCase()) ||
                        b.address
                          .toLowerCase()
                          .includes(branchSearchQuery.toLowerCase()),
                    )
                    .map((branch: Branch, i: number) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3
                                className="font-bold text-lg cursor-pointer hover:text-primary transition-colors"
                                onClick={() => setLocation(`/branch/${i}/edit`)}
                              >
                                {branch.name}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" /> {branch.address}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-green-600 bg-green-50 shrink-0"
                            >
                              Hoạt động
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                            <div>
                              <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                                Mã số thuế:
                              </span>
                              <div className="font-medium">
                                {branch.taxCode || "-"}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                                Điện thoại:
                              </span>
                              <div className="font-medium">
                                {branch.phone || "-"}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                                Email:
                              </span>
                              <div
                                className="font-medium truncate"
                                title={branch.email}
                              >
                                {branch.email || "-"}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                                Ghi chú:
                              </span>
                              <div
                                className="font-medium truncate"
                                title={branch.note}
                              >
                                {branch.note || "-"}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="bankAccounts" className="m-0 space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm tài khoản ngân hàng..."
                    className="pl-10"
                    value={bankSearchQuery}
                    onChange={(e) => setBankSearchQuery(e.target.value)}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {data.bankAccounts?.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      Chưa có tài khoản ngân hàng nào.
                    </div>
                  )}
                  {data.bankAccounts
                    ?.filter(
                      (acc: BankAccount) =>
                        acc.bankName
                          .toLowerCase()
                          .includes(bankSearchQuery.toLowerCase()) ||
                        acc.accountNumber.includes(bankSearchQuery) ||
                        acc.accountHolder
                          .toLowerCase()
                          .includes(bankSearchQuery.toLowerCase()),
                    )
                    .map((account: BankAccount, i: number) => (
                      <Card
                        key={i}
                        className="hover:border-primary/50 transition-colors"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <CreditCard className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-bold text-sm line-clamp-1 h-10 flex items-center">
                                  {account.bankName}
                                </h3>
                                <p className="text-sm text-muted-foreground font-mono">
                                  {account.accountNumber}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-green-600 bg-green-50 shrink-0"
                            >
                              Hoạt động
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                            <div>
                              <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                                Chủ tài khoản:
                              </span>
                              <div className="font-medium uppercase truncate">
                                {account.accountHolder}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                                Chi nhánh:
                              </span>
                              <div className="font-medium truncate">
                                {account.branch || "-"}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                                Ghi chú:
                              </span>
                              <div className="font-medium truncate">
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
                  {data.documents?.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      Chưa có tài liệu nào.
                    </div>
                  )}
                  {data.documents?.map((doc: any, i: number) => (
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
                            <span>
                              {doc.date ||
                                new Date().toLocaleDateString("vi-VN")}
                            </span>
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
