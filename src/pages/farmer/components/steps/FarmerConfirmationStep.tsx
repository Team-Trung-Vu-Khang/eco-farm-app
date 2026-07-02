import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Check,
  CreditCard,
  FileText,
  Image,
  Info,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
  Users,
} from "lucide-react";
import { vietQrBankData } from "../../../../constants/banks";
import {
  farmerClassificationOptions,
  type FarmerFormData,
} from "../../types";

interface FarmerConfirmationStepProps {
  formData: FarmerFormData;
  bankSearchQuery: string;
  setBankSearchQuery: (val: string) => void;
}

export const FarmerConfirmationStep = ({
  formData,
  bankSearchQuery,
  setBankSearchQuery,
}: FarmerConfirmationStepProps) => {
  return (
    <div className="space-y-10 max-w-6xl mx-auto pt-4">
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
        {/* Overview Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-primary/20 shadow-lg">
            <div className="h-32 bg-muted relative">
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Banner"
                  className="w-full h-full object-cover opacity-40 blur-[2px]"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
            </div>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-24 h-24 -mt-16 rounded-full border-4 border-background bg-white shadow-xl flex items-center justify-center mb-4 overflow-hidden relative z-10 transition-transform hover:scale-105">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <CardTitle className="text-xl font-bold">
                {formData.brandName || "Tên thương hiệu"}
              </CardTitle>
              <CardDescription className="text-sm font-medium">
                {formData.name || "Tên nông hộ"}
              </CardDescription>
              <div className="px-2 flex justify-center gap-2 mt-4 flex-wrap">
                {formData.classification.map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className="capitalize px-3 py-1 text-xs font-semibold bg-primary/5 text-primary border-primary/20"
                  >
                    {farmerClassificationOptions.find((opt) => opt.value === item)
                      ?.label ?? item}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 border-t bg-muted/5">
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-4">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Mã nông hộ
                    </p>
                    <p className="font-bold text-base">
                      {formData.code || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <User className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Người đại diện
                    </p>
                    <p className="font-bold text-base">
                      {formData.representative || "Chưa nhập"}
                    </p>
                  </div>
                </div>
              </div>
              <Separator className="bg-primary/10" />
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Địa chỉ
                    </p>
                    <p className="text-sm font-medium leading-normal">
                      {formData.address}
                      {formData.ward && `, ${formData.ward}`}
                      {formData.province && `, ${formData.province}`}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="legal" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8 mb-6">
              <TabsTrigger
                value="legal"
                className="text-sm font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-4 tracking-wide"
              >
                Pháp lý
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
                  <CardContent className="grid md:grid-cols-2 gap-8 py-6 px-6">
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
                        Cơ quan thuế
                      </div>
                      <div className="font-medium text-base leading-relaxed">
                        {formData.taxAuthority || "-"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {formData.contacts && formData.contacts.length > 0 && (
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
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-base">
                                {contact.name}
                              </div>
                              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2 mt-0.5">
                                <Phone className="w-3 h-3" /> {contact.phone}
                              </div>
                            </div>
                          </div>
                          {contact.email && (
                            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border">
                              <Mail className="w-3 h-3 text-primary" />{" "}
                              {contact.email}
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="banks" className="m-0 space-y-6">
                <div className="flex flex-col gap-4 justify-between bg-muted/5 p-4 rounded-xl border border-primary/10">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h4 className="font-bold text-lg">Tài khoản thanh toán</h4>
                    <Badge variant="secondary">
                      {formData.bankAccounts.length}
                    </Badge>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm nhanh..."
                      value={bankSearchQuery}
                      onChange={(e) => setBankSearchQuery(e.target.value)}
                      className="pl-10 h-10 text-sm"
                    />
                  </div>
                </div>

                {formData.bankAccounts.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed rounded-3xl bg-muted/5">
                    <CreditCard className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">
                      Chưa có tài khoản ngân hàng nào
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.bankAccounts
                      .filter((acc) => {
                        const query = bankSearchQuery.toLowerCase();
                        return (
                          acc.bankName.toLowerCase().includes(query) ||
                          acc.accountNumber.includes(query) ||
                          acc.accountHolder.toLowerCase().includes(query)
                        );
                      })
                      .map((acc, i) => {
                        const bankInfo = vietQrBankData.find(
                          (b) => b.bin === acc.bin,
                        );
                        return (
                          <Card
                            key={i}
                            className="hover:border-primary/40 transition-all shadow-sm"
                          >
                            <CardContent className="p-5">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl border bg-white flex items-center justify-center p-2">
                                  <img
                                    src={
                                      bankInfo?.logo ||
                                      "https://placehold.co/40x40"
                                    }
                                    alt={acc.bankName}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-bold text-sm truncate">
                                    {acc.bankName}
                                  </h3>
                                  <p className="text-lg font-mono font-black text-primary tracking-tight">
                                    {acc.accountNumber}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-xs font-medium border-t pt-4">
                                <div>
                                  <span className="text-muted-foreground uppercase text-[9px] font-bold block mb-0.5">
                                    Chủ thẻ
                                  </span>
                                  <div className="font-bold uppercase text-foreground truncate">
                                    {acc.accountHolder}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground uppercase text-[9px] font-bold block mb-0.5">
                                    Chi nhánh
                                  </span>
                                  <div className="font-bold text-foreground truncate">
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
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center justify-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-lg text-blue-900">
                    Hồ sơ đính kèm
                  </h4>
                  <Badge className="bg-blue-100 text-blue-700 border-none ml-auto">
                    {formData.documents.length} tệp
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.documents.map((doc, i) => (
                    <Card
                      key={i}
                      className="group overflow-hidden hover:border-blue-300 transition-all"
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
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
                          <div className="text-xs font-medium text-blue-700 mt-1">
                            {doc.size} • Thành công
                          </div>
                        </div>
                        <Check className="w-4 h-4 text-green-600" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
