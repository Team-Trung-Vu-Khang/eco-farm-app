import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Combobox,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Building2,
  Camera,
  CreditCard,
  Download,
  FileText,
  Plus,
  QrCode,
  Scan,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { vietQrBankData } from "../../../../constants/banks";
import type { BankAccount } from "../../types";

const bankOptions = vietQrBankData.map((bank: any) => ({
  id: bank.id,
  bin: bank.bin || "",
  label: bank.name,
  image: bank.logo,
  value: bank.bin || "",
}));

interface FarmerBankStepProps {
  bankAccounts: BankAccount[];
  newBankAccount: BankAccount;
  setNewBankAccount: (acc: BankAccount) => void;
  bankInputMethod: string;
  setBankInputMethod: (val: any) => void;
  hasCamera: boolean;
  bankSearchQuery: string;
  setBankSearchQuery: (val: string) => void;
  isDragging: Record<string, boolean>;
  handleDrag: (id: string, e: React.DragEvent) => void;
  processExcelFile: (file: File) => void;
  processQRImage: (file: File) => void;
  handleLiveScan: (result: any) => void;
  addBankAccount: () => void;
  removeBankAccount: (index: number) => void;
}

export const FarmerBankStep = ({
  bankAccounts,
  newBankAccount,
  setNewBankAccount,
  bankInputMethod,
  setBankInputMethod,
  hasCamera,
  bankSearchQuery,
  setBankSearchQuery,
  isDragging,
  handleDrag,
  processExcelFile,
  processQRImage,
  handleLiveScan,
  addBankAccount,
  removeBankAccount,
}: FarmerBankStepProps) => {
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
            onValueChange={setBankInputMethod}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-muted/50 p-1">
              <TabsTrigger value="manual">
                <Plus className="w-4 h-4 mr-2" /> Nhập tay
              </TabsTrigger>
              <TabsTrigger value="excel">
                <FileText className="w-4 h-4 mr-2" /> Excel
              </TabsTrigger>
              <TabsTrigger value="qr-image">
                <QrCode className="w-4 h-4 mr-2" /> Đọc QR
              </TabsTrigger>
              <TabsTrigger value="qr-scan" disabled={!hasCamera}>
                <Scan className="w-4 h-4 mr-2" /> Quét mã
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Chọn Ngân hàng *</Label>
                  <Combobox
                    options={bankOptions}
                    value={newBankAccount.bin || ""}
                    onChange={(val) =>
                      setNewBankAccount({
                        ...newBankAccount,
                        bin: val,
                        bankName:
                          bankOptions.find((bank) => bank.bin === val)?.label || "",
                      })
                    }
                    placeholder="Chọn ngân hàng..."
                    searchPlaceholder="Tìm tên ngân hàng..."
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Số tài khoản *</Label>
                  <Input
                    value={newBankAccount.accountNumber}
                    onChange={(e) =>
                      setNewBankAccount({
                        ...newBankAccount,
                        accountNumber: e.target.value,
                      })
                    }
                    placeholder="Nhập số tài khoản"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Chủ tài khoản *</Label>
                  <Input
                    value={newBankAccount.accountHolder}
                    onChange={(e) =>
                      setNewBankAccount({
                        ...newBankAccount,
                        accountHolder: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="TÊN CHỦ TÀI KHOẢN"
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
                  />
                </div>
              </div>
              <Button onClick={addBankAccount} className="w-full h-12">
                <Plus className="w-5 h-5 mr-2" />
                Thêm vào danh sách
              </Button>
            </TabsContent>

            <TabsContent value="excel">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-bold text-sm text-blue-900">Mẫu file Excel</p>
                      <p className="text-xs text-blue-700">Tải xuống file mẫu</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        "https://static.affina.com.vn/affina/49cc7798-57fc-4f22-83a0-542fbf3b3c36.xlsx",
                        "_blank",
                      )
                    }
                  >
                    Tải mẫu
                  </Button>
                </div>
                <div
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${isDragging["excel"] ? "border-primary bg-primary/5" : "border-muted-foreground/20"}`}
                  onClick={() => document.getElementById("excel-upload")?.click()}
                  onDragEnter={(e) => handleDrag("excel", e)}
                  onDragOver={(e) => handleDrag("excel", e)}
                  onDragLeave={(e) => handleDrag("excel", e)}
                  onDrop={(e) => {
                    handleDrag("excel", e);
                    const file = e.dataTransfer.files?.[0];
                    if (file) processExcelFile(file);
                  }}
                >
                  <input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx, .xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processExcelFile(file);
                    }}
                  />
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-bold text-lg mb-2">Tải lên file Excel</h4>
                  <p className="text-sm text-muted-foreground">Kéo thả file .xlsx hoặc .xls vào đây</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="qr-image">
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${isDragging["qr-image"] ? "border-primary bg-primary/5" : "border-muted-foreground/20"}`}
                onClick={() => document.getElementById("qr-image-upload")?.click()}
                onDragEnter={(e) => handleDrag("qr-image", e)}
                onDragOver={(e) => handleDrag("qr-image", e)}
                onDragLeave={(e) => handleDrag("qr-image", e)}
                onDrop={(e) => {
                    handleDrag("qr-image", e);
                    const file = e.dataTransfer.files?.[0];
                    if (file) processQRImage(file);
                }}
              >
                <input
                  id="qr-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processQRImage(file);
                  }}
                />
                <QrCode className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-bold text-lg mb-2">Đọc mã QR từ ảnh</h4>
                <p className="text-sm text-muted-foreground">Tải lên ảnh chứa mã QR ngân hàng</p>
              </div>
            </TabsContent>

            <TabsContent value="qr-scan">
              <div className="bg-black/5 rounded-2xl p-4 text-center aspect-video flex flex-col items-center justify-center border border-border relative min-h-[300px]">
                {bankInputMethod === "qr-scan" && hasCamera ? (
                  <Scanner
                    constraints={{ facingMode: "environment" }}
                    allowMultiple={false}
                    onScan={handleLiveScan}
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="w-12 h-12 mb-4 text-muted-foreground" />
                    <h4 className="font-bold text-lg mb-2">Máy ảnh chưa sẵn sàng</h4>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h4 className="font-bold text-xl flex items-center gap-3">
          Danh sách đã thêm <Badge variant="secondary">{bankAccounts.length}</Badge>
        </h4>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tài khoản..."
            value={bankSearchQuery}
            onChange={(e) => setBankSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {bankAccounts.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-3xl bg-muted/5">
            <CreditCard className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h5 className="text-lg font-bold text-muted-foreground">Chưa có tài khoản nào</h5>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts
              .filter((acc) => {
                const query = bankSearchQuery.toLowerCase();
                return (
                  acc.bankName.toLowerCase().includes(query) ||
                  acc.accountNumber.includes(query) ||
                  acc.accountHolder.toLowerCase().includes(query)
                );
              })
              .map((acc, index) => {
                const bankInfo = vietQrBankData.find((b: any) => b.bin === acc.bin);
                return (
                  <Card key={index} className="group hover:border-primary/50 transition-all shadow-sm">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl border bg-white flex items-center justify-center p-2">
                        <img
                          src={bankInfo?.logo || "https://placehold.co/40x40"}
                          alt={acc.bankName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-base truncate">{acc.bankName}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeBankAccount(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="font-mono text-lg font-bold text-primary">{acc.accountNumber}</p>
                        <p className="uppercase text-xs text-muted-foreground">{acc.accountHolder}</p>
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
};
