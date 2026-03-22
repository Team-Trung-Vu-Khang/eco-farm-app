import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Label,
  Combobox,
  Input,
  Textarea,
  Button,
  Badge,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Building2,
  Plus,
  FileText,
  QrCode,
  Scan,
  Download,
  Upload,
  Camera,
  Search,
  Trash2,
  CreditCard,
} from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner";
import type { BankAccount, CooperativeFormData } from "../../types/types";
import { BANK_OPTIONS } from "../../data/constants";
import { vietQrBankData } from "@/constants/banks";

interface BankInfoStepProps {
  formData: CooperativeFormData;
  newBankAccount: BankAccount;
  setNewBankAccount: (acc: BankAccount) => void;
  bankInputMethod: "manual" | "excel" | "qr-image" | "qr-scan";
  setBankInputMethod: (
    method: "manual" | "excel" | "qr-image" | "qr-scan",
  ) => void;
  hasCamera: boolean;
  bankSearchQuery: string;
  setBankSearchQuery: (q: string) => void;
  isDragging: Record<string, boolean>;
  handleDrag: (id: string, e: React.DragEvent) => void;
  handleExcelUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExcelDrop: (e: React.DragEvent) => void;
  handleQRImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleQRImageDrop: (e: React.DragEvent) => void;
  handleLiveScan: (result: any) => void;
  addBankAccount: () => void;
  removeBankAccount: (index: number) => void;
}

export function BankInfoStep({
  formData,
  newBankAccount,
  setNewBankAccount,
  bankInputMethod,
  setBankInputMethod,
  hasCamera,
  bankSearchQuery,
  setBankSearchQuery,
  isDragging,
  handleDrag,
  handleExcelUpload,
  handleExcelDrop,
  handleQRImageUpload,
  handleQRImageDrop,
  handleLiveScan,
  addBankAccount,
  removeBankAccount,
}: BankInfoStepProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="overflow-hidden border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Thêm tài khoản ngân hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Tabs
            value={bankInputMethod}
            onValueChange={(val: any) => setBankInputMethod(val)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-muted/50 p-1">
              <TabsTrigger
                value="manual"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" /> Nhập tay
              </TabsTrigger>
              <TabsTrigger
                value="excel"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <FileText className="w-4 h-4 mr-2" /> Excel
              </TabsTrigger>
              <TabsTrigger
                value="qr-image"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <QrCode className="w-4 h-4 mr-2" /> Đọc QR
              </TabsTrigger>
              <TabsTrigger
                value="qr-scan"
                disabled={!hasCamera}
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Scan className="w-4 h-4 mr-2" /> Quét mã
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="manual"
              className="space-y-6 animate-in fade-in-50 duration-300"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Chọn Ngân hàng *
                  </Label>
                  <Combobox
                    options={BANK_OPTIONS}
                    value={newBankAccount.bin}
                    onChange={(val) =>
                      setNewBankAccount({
                        ...newBankAccount,
                        bin: val,
                        bankName:
                          BANK_OPTIONS.find((bank) => bank.bin === val)
                            ?.label || "",
                      })
                    }
                    placeholder="Chọn ngân hàng..."
                    searchPlaceholder="Tìm tên ngân hàng..."
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Số tài khoản *
                  </Label>
                  <Input
                    value={newBankAccount.accountNumber}
                    onChange={(e) =>
                      setNewBankAccount({
                        ...newBankAccount,
                        accountNumber: e.target.value,
                      })
                    }
                    placeholder="Nhập số tài khoản"
                    className="bg-muted/30 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Chủ tài khoản *
                  </Label>
                  <Input
                    value={newBankAccount.accountHolder}
                    onChange={(e) =>
                      setNewBankAccount({
                        ...newBankAccount,
                        accountHolder: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="TÊN CHỦ TÀI KHOẢN"
                    className="bg-muted/30 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Chi nhánh</Label>
                  <Input
                    value={newBankAccount.branch}
                    onChange={(e) =>
                      setNewBankAccount({
                        ...newBankAccount,
                        branch: e.target.value,
                      })
                    }
                    placeholder="VD: CN Hoàn Kiếm"
                    className="bg-muted/30 focus-visible:ring-primary"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-sm font-semibold">Ghi chú</Label>
                  <Textarea
                    value={newBankAccount.note}
                    onChange={(e) =>
                      setNewBankAccount({
                        ...newBankAccount,
                        note: e.target.value,
                      })
                    }
                    placeholder="Ghi chú thêm (không bắt buộc)"
                    rows={2}
                    className="bg-muted/30 focus-visible:ring-primary resize-none"
                  />
                </div>
              </div>
              <Button
                onClick={addBankAccount}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12"
              >
                <Plus className="w-5 h-5 mr-2" />
                Thêm vào danh sách
              </Button>
            </TabsContent>

            <TabsContent
              value="excel"
              className="animate-in fade-in-50 duration-300"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Download className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-blue-900">
                        Mẫu file Excel
                      </p>
                      <p className="text-xs text-blue-700">
                        Tải xuống file mẫu để nhập liệu chính xác
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-blue-200 hover:bg-blue-50"
                    onClick={() =>
                      window.open(
                        "https://static.affina.com.vn/affina/49cc7798-57fc-4f22-83a0-542fbf3b3c36.xlsx",
                        "_blank",
                      )
                    }
                  >
                    <Download className="w-4 h-4 mr-2" /> Tải mẫu
                  </Button>
                </div>

                <div
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all group cursor-pointer ${isDragging["excel"] ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"}`}
                  onClick={() =>
                    document.getElementById("excel-upload")?.click()
                  }
                  onDragEnter={(e) => handleDrag("excel", e)}
                  onDragOver={(e) => handleDrag("excel", e)}
                  onDragLeave={(e) => handleDrag("excel", e)}
                  onDrop={handleExcelDrop}
                >
                  <input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx, .xls"
                    className="hidden"
                    onChange={handleExcelUpload}
                  />
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Tải lên file Excel</h4>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                    Kéo thả file .xlsx hoặc .xls vào đây để nhập danh sách tài
                    khoản tự động
                  </p>
                  <Button
                    variant="secondary"
                    className="px-8 pointer-events-none"
                  >
                    Chọn file từ máy tính
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="qr-image"
              className="animate-in fade-in-50 duration-300"
            >
              <div
                className={`flex flex-col justify-center items-center border-2 border-dashed rounded-2xl p-12 text-center transition-all group cursor-pointer ${isDragging["qr-image"] ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"}`}
                onClick={() =>
                  document.getElementById("qr-image-upload")?.click()
                }
                onDragEnter={(e) => handleDrag("qr-image", e)}
                onDragOver={(e) => handleDrag("qr-image", e)}
                onDragLeave={(e) => handleDrag("qr-image", e)}
                onDrop={handleQRImageDrop}
              >
                <input
                  id="qr-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleQRImageUpload}
                />
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                  <QrCode className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">Đọc mã QR từ ảnh</h4>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                  Tải lên ảnh chứa mã QR ngân hàng (VietQR) để tự động điền
                  thông tin
                </p>
                <Button
                  variant="secondary"
                  className="px-8 flex items-center gap-2 pointer-events-none"
                >
                  <Upload className="w-4 h-4" />
                  Chọn ảnh QR
                </Button>
              </div>
            </TabsContent>

            <TabsContent
              value="qr-scan"
              className="animate-in fade-in-50 duration-300"
            >
              <div className="bg-black/5 rounded-2xl p-4 text-center aspect-video flex flex-col items-center justify-center border border-border overflow-hidden relative min-h-[300px]">
                {bankInputMethod === "qr-scan" && hasCamera ? (
                  <div className="w-full h-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-2xl relative border-4 border-primary/20 bg-black">
                    <Scanner
                      constraints={{
                        aspectRatio: 1,
                        facingMode: "environment",
                      }}
                      allowMultiple={false}
                      onScan={handleLiveScan}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-12">
                    <Camera
                      className={`w-12 h-12 mb-4 ${hasCamera ? "text-primary animate-bounce" : "text-muted-foreground opacity-20"}`}
                    />
                    <h4 className="font-bold text-lg mb-2">
                      {hasCamera
                        ? "Máy ảnh sẵn sàng"
                        : "Không tìm thấy máy ảnh"}
                    </h4>
                    <p className="text-sm text-muted-foreground text-center max-w-xs">
                      {hasCamera
                        ? "Vui lòng đưa mã QR vào khung hình để quét tự động"
                        : "Vui lòng sử dụng chức năng đọc QR từ ảnh hoặc nhập tay"}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          <h4 className="font-bold text-xl flex items-center gap-3">
            Danh sách đã thêm
            <Badge
              variant="secondary"
              className="px-3 py-1 rounded-full text-sm"
            >
              {formData.bankAccounts.length}
            </Badge>
          </h4>
          {formData.bankAccounts.length > 0 && (
            <p className="hidden md:block text-sm text-muted-foreground italic">
              * Nhấn vào biểu tượng thùng rác để xóa tài khoản
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          {formData.bankAccounts.length > 0 && (
            <div className="relative w-full md:w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Tìm kiếm tài khoản..."
                value={bankSearchQuery}
                onChange={(e) => setBankSearchQuery(e.target.value)}
                className="pl-10 bg-muted/30 focus-visible:ring-primary border-none shadow-none"
              />
            </div>
          )}
        </div>

        {formData.bankAccounts.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-3xl bg-muted/5 transition-colors hover:bg-muted/10">
            <div className="w-20 h-20 rounded-full bg-muted/40 flex items-center justify-center mx-auto mb-4 group">
              <CreditCard className="w-10 h-10 text-muted-foreground group-hover:scale-110 transition-transform" />
            </div>
            <h5 className="text-lg font-bold text-muted-foreground">
              Chưa có tài khoản nào
            </h5>
            <p className="text-sm text-muted-foreground/70 mt-2 max-w-sm mx-auto">
              Các tài khoản ngân hàng bạn thêm sẽ hiển thị tại đây để kiểm tra
              trước khi lưu
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.bankAccounts
              .filter((acc) => {
                const query = bankSearchQuery.toLowerCase();
                return (
                  acc.bankName.toLowerCase().includes(query) ||
                  acc.accountNumber.includes(query) ||
                  acc.accountHolder.toLowerCase().includes(query)
                );
              })
              .map((acc, index) => {
                const bankInfo = vietQrBankData.find((b) => b.bin === acc.bin);

                return (
                  <Card
                    key={index}
                    className="group hover:border-primary/50 transition-all hover:shadow-md cursor-default border-primary/10"
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl border bg-white flex items-center justify-center p-2 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-base truncate">
                            {acc.bankName}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                            onClick={() => removeBankAccount(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="font-mono text-lg font-bold text-primary tracking-wider">
                          {acc.accountNumber}
                        </p>
                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                          <span className="uppercase font-medium">
                            {acc.accountHolder}
                          </span>
                          {acc.branch && (
                            <span className="italic truncate ml-2">
                              CN: {acc.branch}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
