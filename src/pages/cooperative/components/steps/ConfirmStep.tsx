import {
  Check,
  Image,
  CreditCard,
  User,
  Calendar,
  MapPin,
  Globe,
  Info,
  Phone,
  Mail,
  Building2,
  FileText,
  Users,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMasterData } from "@/features/master-data";
import type { CooperativeFormData } from "../../types/types";
import { vietQrBankData } from "@/constants/banks";
import { getDefaultOrganizationImage } from "../../../enterprise/data/default-organization-images";

interface ConfirmStepProps {
  formData: CooperativeFormData;
}

export function ConfirmStep({ formData }: ConfirmStepProps) {
  const displayImage = formData.image || getDefaultOrganizationImage("cooperative");
  const businessLinesQuery = useMasterData("business-lines", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h3 className="font-display font-bold text-2xl mb-2">
          Kiểm tra thông tin
        </h3>
        <p className="text-muted-foreground text-base">
          Vui lòng xem lại tất cả các thông tin trước khi hoàn tất đăng ký
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overview Card (Column 1) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-primary/20 shadow-lg">
            <div className="h-32 bg-muted relative">
              {displayImage && (
                <img
                  src={displayImage}
                  alt="Banner"
                  className="w-full h-full object-cover opacity-40 blur-[2px]"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
            </div>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-24 h-24 -mt-16 rounded-full border-4 border-background bg-white shadow-xl flex items-center justify-center mb-4 overflow-hidden relative z-10 transition-transform hover:scale-105">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <CardTitle className="text-xl font-bold">
                {formData.aliasName || "Tên gợi nhớ"}
              </CardTitle>
              <CardDescription className="text-sm font-medium">
                {formData.name || "Tên hợp tác xã"}
              </CardDescription>
              <div className="px-2 flex justify-center gap-2 mt-4 flex-wrap">
                {formData.classification.map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className="capitalize px-3 py-1 text-xs font-semibold bg-primary/5 text-primary border-primary/20"
                  >
                    {businessLinesQuery.items.find(
                      (businessLine) => String(businessLine.id) === item,
                    )?.name ?? item}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 border-t bg-muted/5">
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shadow-sm border">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Đại diện pháp luật
                    </p>
                    <p className="font-bold text-base">
                      {formData.representative || "Chưa nhập"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shadow-sm border">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Ngày thành lập
                    </p>
                    <p className="font-bold text-base">
                      {formData.foundedDate
                        ? new Date(formData.foundedDate).toLocaleDateString(
                            "vi-VN",
                          )
                        : "Chưa nhập"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-primary/10" />

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shadow-sm border shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Địa chỉ trụ sở
                    </p>
                    <p className="text-sm font-medium leading-normal">
                      {formData.address}
                      {formData.district && `, ${formData.district}`}
                      {formData.province && `, ${formData.province}`}
                    </p>
                  </div>
                </div>
                {formData.website && (
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shadow-sm border shrink-0">
                      <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        Website
                      </p>
                      <p className="text-sm font-bold text-blue-600 truncate underline decoration-blue-200 underline-offset-4">
                        {formData.website}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Info (Column 2-3) */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="legal" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-4 sm:gap-8 mb-6 overflow-x-auto flex-nowrap whitespace-nowrap scrollbar-none">
              <TabsTrigger
                value="legal"
                className="text-sm font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-4 tracking-wide"
              >
                Pháp lý
              </TabsTrigger>
              <TabsTrigger
                value="branches"
                className="text-sm font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-4 tracking-wide"
              >
                Chi nhánh ({formData.branches.length})
              </TabsTrigger>
              <TabsTrigger
                value="banks"
                className="text-sm font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-4 tracking-wide"
              >
                Ngân hàng ({formData.bankAccounts.length})
              </TabsTrigger>
              <TabsTrigger
                value="docs"
                className="text-sm font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-4 tracking-wide"
              >
                Tài liệu ({formData.documents.length})
              </TabsTrigger>
            </TabsList>

            <div className="pt-2">
              <TabsContent value="legal" className="m-0 space-y-6">
                <Card className="border-primary/10">
                  <CardHeader className="py-5 px-6 border-b bg-muted/5">
                    <CardTitle className="text-lg flex items-center gap-3">
                      <Info className="w-5 h-5 text-primary" />
                      Thông tin thuế & Pháp lý
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 px-6">
                    <div className="space-y-6">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-widest">
                          Mã số thuế
                        </div>
                        <div className="font-bold text-lg text-primary">
                          {formData.taxCode || "-"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-widest">
                          Địa chỉ đăng ký thuế
                        </div>
                        <div className="font-medium text-base leading-relaxed">
                          {formData.taxAddress || "-"}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-widest">
                          Tên thương hiệu
                        </div>
                        <div className="font-medium text-base leading-relaxed">
                          {formData.brandName || "-"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-widest">
                          Mô tả hợp tác xã
                        </div>
                        <div className="font-medium text-base text-muted-foreground leading-relaxed italic">
                          "{formData.description || "Không có mô tả."}"
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {formData.contacts.length > 0 && (
                  <Card className="border-primary/10">
                    <CardHeader className="py-5 px-6 border-b bg-muted/5">
                      <CardTitle className="text-lg flex items-center gap-3">
                        <Users className="w-5 h-5 text-primary" />
                        Danh sách người liên hệ
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 py-6 px-6">
                      {formData.contacts.map((contact, i) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 gap-3 sm:gap-4 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-base">
                                {contact.name}
                              </div>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-muted-foreground mt-0.5">
                                {contact.phone && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <Phone className="w-3 h-3 text-primary shrink-0" />
                                    {contact.phone}
                                  </span>
                                )}
                                {contact.phone && contact.email && <span className="text-border">-</span>}
                                {contact.email && (
                                  <span className="inline-flex items-center gap-1.5 truncate" title={contact.email}>
                                    <Mail className="w-3 h-3 text-primary shrink-0" />
                                    {contact.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent
                value="branches"
                className="m-0 space-y-6 animate-in fade-in duration-300"
              >
                <div className="flex items-center gap-3 bg-muted/5 p-4 rounded-xl border border-primary/10">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h4 className="font-bold text-lg">Danh sách chi nhánh</h4>
                  <Badge className="bg-primary/10 text-primary border-none">
                    {formData.branches.length}
                  </Badge>
                </div>

                {formData.branches.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed rounded-3xl bg-muted/5">
                    <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">
                      Chưa có chi nhánh nào được thêm
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {formData.branches.map((branch, i) => (
                      <Card
                        key={i}
                        className="hover:border-primary/40 transition-all shadow-sm"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-lg">
                                {branch.name}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-primary" />{" "}
                                {branch.address || "Chưa cập nhật địa chỉ"}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Hoạt động
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
                                Mã số thuế
                              </span>
                              <div className="font-medium">
                                {branch.taxCode || "-"}
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
                                Điện thoại
                              </span>
                              <div className="font-medium">
                                {branch.phone || "-"}
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
                                Email
                              </span>
                              <div
                                className="font-medium truncate"
                                title={branch.email}
                              >
                                {branch.email || "-"}
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
                                Ghi chú
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
                )}
              </TabsContent>

              <TabsContent
                value="banks"
                className="m-0 space-y-6 animate-in fade-in duration-300"
              >
                <div className="flex items-center gap-3 bg-muted/5 p-4 rounded-xl border border-primary/10">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h4 className="font-bold text-lg">Tài khoản thanh toán</h4>
                  <Badge className="bg-primary/10 text-primary border-none">
                    {formData.bankAccounts.length}
                  </Badge>
                </div>

                {formData.bankAccounts.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed rounded-3xl bg-muted/5">
                    <CreditCard className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">
                      Chưa có tài khoản ngân hàng nào
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {formData.bankAccounts.map((acc, i) => {
                        const bankInfo = vietQrBankData.find(
                          (b) => b.bin === acc.bin,
                        );
                        return (
                          <Card
                            key={i}
                            className="hover:border-primary/40 transition-all shadow-sm hover:shadow-md group overflow-hidden"
                          >
                            <CardContent className="p-5">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl border bg-white flex items-center justify-center p-2 shadow-sm group-hover:scale-105 transition-transform">
                                    <img
                                      src={
                                        bankInfo?.logo ||
                                        "https://placehold.co/40x40?text=" +
                                          acc.bankName?.[0]
                                      }
                                      alt={acc.bankName}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-sm truncate max-w-[150px]">
                                      {acc.bankName}
                                    </h3>
                                    <p className="text-lg font-mono font-black text-primary tracking-tight">
                                      {acc.accountNumber}
                                    </p>
                                  </div>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium border-t pt-4">
                                <div>
                                  <span className="text-muted-foreground uppercase text-[9px] font-bold block mb-0.5">
                                    Chủ tài khoản
                                  </span>
                                  <div className="font-bold uppercase text-foreground">
                                    {acc.accountHolder}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground uppercase text-[9px] font-bold block mb-0.5">
                                    Chi nhánh
                                  </span>
                                  <div className="font-bold text-foreground">
                                    {acc.branch || "-"}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="docs" className="m-0 space-y-6">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-lg text-blue-900">
                    Hồ sơ đính kèm
                  </h4>
                  <Badge className="bg-blue-100 text-blue-700 border-none ml-auto">
                    {formData.documents.length} tệp
                  </Badge>
                </div>

                {formData.documents.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed rounded-3xl bg-muted/5">
                    <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">
                      Chưa có tài liệu đính kèm
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.documents.map((doc, i) => (
                      <Card
                        key={i}
                        className="group overflow-hidden hover:border-blue-300 transition-all cursor-default"
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                            {doc.type.includes("image") ? (
                              <Image className="w-6 h-6 text-blue-600" />
                            ) : (
                              <FileText className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate text-blue-900">
                              {doc.name}
                            </h4>
                            <div className="text-xs font-medium text-blue-700 mt-1 flex items-center gap-2">
                              <span className="bg-blue-100 px-2 py-0.5 rounded-full">
                                {doc.size}
                              </span>
                              <span>Tải lên thành công</span>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 shadow-inner">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
