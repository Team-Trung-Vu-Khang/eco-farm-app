import {
  AdminLayout,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Combobox,
  Input,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  StepperForm,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  useToast,
  type Step,
} from "@tankhang1/eco-shared-ui";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Building2,
  Calendar,
  Camera,
  Check,
  CreditCard,
  Download,
  FileText,
  Globe,
  Image,
  Info,
  Mail,
  MapPin,
  Phone,
  Plus,
  QrCode,
  Scan,
  Search,
  Trash2,
  Upload,
  User,
  Users,
} from "lucide-react";
import QrScanner from "qr-scanner";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { vietQrBankData } from "../../constants/banks";
import { parseVietQR } from "../../utils/commons";
import readXlsxFile from "read-excel-file";
import { PROVINCES } from "@/constants/province";

interface BankAccount {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branch: string;
  note: string;
  bin: string;
}

interface Contact {
  name: string;
  phone: string;
  email: string;
}

interface Branch {
  name: string;
  taxCode: string;
  phone: string;
  taxAddress: string;
  email: string;
  address: string;
  note: string;
}

const bankOptions = vietQrBankData.map((bank) => ({
  id: bank.id,
  bin: bank.bin,
  label: bank.name,
  image: bank.logo,
  value: bank.bin,
}));

const classificationOptions = [
  { value: "production", label: "Sản xuất" },
  { value: "processing", label: "Chế biến" },
  { value: "trading", label: "Thương mại" },
  { value: "service", label: "Dịch vụ" },
  { value: "other", label: "Khác" },
];

export default function CooperativeEditPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    type: "cooperative" as "enterprise" | "farm" | "cooperative",
    code: "",
    name: "",
    brandName: "",
    taxCode: "",
    taxAddress: "",
    classification: [] as Array<string>,
    foundedDate: "",
    representative: "",
    website: "",
    province: "",
    ward: "",
    address: "",
    image: "",
    description: "",
    contacts: [] as Contact[],
    branches: [] as any[],
    bankAccounts: [] as BankAccount[],
    documents: [] as { name: string; type: string; size: string }[],
  });

  // Mock data fetching
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFormData({
        type: "enterprise",
        code: "DN2024001",
        name: "Hợp tác xã Nông nghiệp Xanh EcoFarm",
        brandName: "EcoFarm Vietnam",
        taxCode: "0101234567",
        taxAddress: "Tầng 5, Tòa nhà ABC, Cầu Giấy, Hà Nội",
        classification: ["production"],
        foundedDate: "2020-03-15",
        representative: "Nguyễn Văn Giám Đốc",
        website: "https://ecofarm.vn",
        province: "hn",
        ward: "dich_vong",
        address: "Số 123 Đường Xuân Thủy",
        image:
          "https://images.unsplash.com/photo-1595839019623-668b555776a3?w=800&q=80",
        description:
          "Hợp tác xã tiên phong trong lĩnh vực nông nghiệp công nghệ cao, chuyên sản xuất và cung ứng rau sạch chuẩn VietGAP.",
        contacts: [
          {
            name: "Lê Văn Tiến",
            phone: "0333444555",
            email: "tien.lv@ecofarm.vn",
          },
        ],
        branches: [],
        bankAccounts: [
          {
            bin: "970436",
            bankName: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
            accountHolder: "ECOFARM CORP",
            accountNumber: "0011001234567",
            branch: "Sở Giao Dịch",
            note: "Tài khoản chính",
          },
        ],
        documents: [
          { name: "giay_phep_kd.pdf", type: "application/pdf", size: "2.5MB" },
        ],
      });
    }, 500);
  }, []);

  const [newContact, setNewContact] = useState<Contact>({
    name: "",
    phone: "",
    email: "",
  });

  const [newBranch, setNewBranch] = useState<Branch>({
    name: "",
    taxCode: "",
    phone: "",
    taxAddress: "",
    email: "",
    address: "",
    note: "",
  });

  const [newBankAccount, setNewBankAccount] = useState<BankAccount>({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    branch: "",
    note: "",
    bin: "",
  });

  const [isDragging, setIsDragging] = useState<Record<string, boolean>>({});
  const [bankInputMethod, setBankInputMethod] = useState<
    "manual" | "excel" | "qr-image" | "qr-scan"
  >("manual");
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [confirmBankSearchQuery, setConfirmBankSearchQuery] = useState("");
  const [branchInputMethod, setBranchInputMethod] = useState<
    "create" | "excel"
  >("create");
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    // Check for camera
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        setHasCamera(devices.some((device) => device.kind === "videoinput"));
      })
      .catch(() => setHasCamera(false));
  }, []);

  const handleDrag = (id: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging((prev) => ({ ...prev, [id]: true }));
    } else if (e.type === "dragleave" || e.type === "drop") {
      setIsDragging((prev) => ({ ...prev, [id]: false }));
    }
  };

  const processLogoImage = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: url }));
      toast({
        title: "Thành công",
        description: "Đã tải lên logo mới",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processLogoImage(file);
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    handleDrag("logo", e);
    const file = e.dataTransfer.files?.[0];
    if (file) processLogoImage(file);
  };

  const processExcelFile = async (file: File) => {
    try {
      const rows = await readXlsxFile(file);
      const dataRows = rows.slice(1);
      const newAccounts: BankAccount[] = [];
      let failCount = 0;
      let successCount = 0;

      dataRows.forEach((row) => {
        const binOrName = String(row[0] || "").trim();
        const accountNumber = String(row[1] || "").trim();
        const accountHolder = String(row[2] || "")
          .trim()
          .toUpperCase();
        const branch = String(row[3] || "").trim();
        const note = String(row[4] || "").trim();

        if (binOrName && accountNumber && accountHolder) {
          const bankInfo = vietQrBankData.find(
            (b) =>
              b.bin === binOrName ||
              b.shortName.toLowerCase() === binOrName.toLowerCase() ||
              b.name.toLowerCase() === binOrName.toLowerCase(),
          );

          if (bankInfo) {
            newAccounts.push({
              bin: bankInfo.bin,
              bankName: bankInfo.name,
              accountNumber,
              accountHolder,
              branch,
              note,
            });
            successCount++;
          } else {
            failCount++;
          }
        }
      });

      if (newAccounts.length > 0) {
        setFormData((prev) => ({
          ...prev,
          bankAccounts: [...newAccounts, ...prev.bankAccounts],
        }));
        toast({
          title: "Nhập Excel thành công",
          description: `Đã thêm ${successCount} tài khoản. ${failCount > 0 ? `Thất bại ${failCount} dòng do không khớp ngân hàng.` : ""}`,
        });
      } else {
        toast({
          title: "Thông báo",
          description: "Không tìm thấy dữ liệu hợp lệ trong file Excel.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể đọc file Excel. Vui lòng kiểm tra định dạng.",
        variant: "destructive",
      });
    }
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processExcelFile(file);
  };

  const handleExcelDrop = (e: React.DragEvent) => {
    handleDrag("excel", e);
    const file = e.dataTransfer.files?.[0];
    if (file) processExcelFile(file);
  };

  const processBranchExcelFile = async (file: File) => {
    try {
      const rows = await readXlsxFile(file);
      // Skip header row
      const dataRows = rows.slice(1);

      const importedBranches: Branch[] = [];

      for (const row of dataRows) {
        if (row[0]) {
          importedBranches.push({
            name: row[0].toString().trim(),
            taxCode: row[1] ? row[1].toString().trim() : "",
            phone: row[2] ? row[2].toString().trim() : "",
            email: row[3] ? row[3].toString().trim() : "",
            taxAddress: row[4] ? row[4].toString().trim() : "",
            address: row[5] ? row[5].toString().trim() : "",
            note: row[6] ? row[6].toString().trim() : "Nhập từ Excel",
          });
        }
      }

      if (importedBranches.length > 0) {
        setFormData((prev) => ({
          ...prev,
          branches: [...prev.branches, ...importedBranches],
        }));
        toast({
          title: "Thành công",
          description: `Đã nhập ${importedBranches.length} chi nhánh từ Excel`,
        });
        setBranchInputMethod("create");
      } else {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy dữ liệu hợp lệ trong file Excel",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          "Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng.",
        variant: "destructive",
      });
    }
  };

  const handleBranchExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processBranchExcelFile(file);
  };

  const handleBranchExcelDrop = (e: React.DragEvent) => {
    handleDrag("branch-excel", e);
    const file = e.dataTransfer.files?.[0];
    if (file) processBranchExcelFile(file);
  };

  const processQRImage = async (file: File) => {
    try {
      const result = await QrScanner.scanImage(file);
      if (result) {
        const parsed = parseVietQR(result);
        if (parsed) {
          const bankInfo = vietQrBankData.find((b) => b.bin === parsed.bin);
          setNewBankAccount({
            bin: parsed.bin,
            bankName: bankInfo ? bankInfo.name : `Ngân hàng (${parsed.bin})`,
            accountNumber: parsed.accountNumber,
            accountHolder: (parsed.accountHolder || "").toUpperCase(),
            branch: "",
            note: "Quét từ mã QR",
          });
          setBankInputMethod("manual");
          toast({
            title: "Thành công",
            description: "Đã trích xuất thông tin từ mã QR",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể đọc mã QR từ hình ảnh này",
        variant: "destructive",
      });
    }
  };

  const handleQRImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processQRImage(file);
  };

  const handleQRImageDrop = (e: React.DragEvent) => {
    handleDrag("qr-image", e);
    const file = e.dataTransfer.files?.[0];
    if (file) processQRImage(file);
  };

  const handleLiveScan = (result: any) => {
    if (result && result[0]?.rawValue) {
      const parsed = parseVietQR(result[0].rawValue);
      if (parsed) {
        const bankInfo = vietQrBankData.find((b) => b.bin === parsed.bin);
        setNewBankAccount({
          bin: parsed.bin,
          bankName: bankInfo ? bankInfo.name : `Ngân hàng (${parsed.bin})`,
          accountNumber: parsed.accountNumber,
          accountHolder: (parsed.accountHolder || "").toUpperCase(),
          branch: "",
          note: "Quét trực tiếp",
        });
        setBankInputMethod("manual");
        toast({
          title: "Thành công",
          description: "Đã quét mã QR thành công",
        });
      }
    }
  };

  const processDocuments = (files: FileList) => {
    const newDocs = Array.from(files).map((file) => ({
      name: file.name,
      type: file.type,
      size: (file.size / (1024 * 1024)).toFixed(2) + "MB",
    }));

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newDocs],
    }));

    toast({
      title: "Thành công",
      description: `Đã tải lên ${newDocs.length} tài liệu`,
    });
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processDocuments(e.target.files);
  };

  const handleDocumentDrop = (e: React.DragEvent) => {
    handleDrag("documents", e);
    if (e.dataTransfer.files) processDocuments(e.dataTransfer.files);
  };

  const handleDocumentDelete = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const addBranch = () => {
    if (newBranch.name.trim()) {
      setFormData({
        ...formData,
        branches: [...formData.branches, newBranch],
      });
      setNewBranch({
        name: "",
        taxCode: "",
        phone: "",
        taxAddress: "",
        email: "",
        address: "",
        note: "",
      });
    } else {
      toast({
        title: "Lỗi",
        description: "Tên chi nhánh không được để trống",
        variant: "destructive",
      });
    }
  };

  const removeBranch = (index: number) => {
    setFormData({
      ...formData,
      branches: formData.branches.filter((_, i) => i !== index),
    });
  };

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setFormData((prev) => ({
        ...prev,
        contacts: [...prev.contacts, newContact],
      }));
      setNewContact({ name: "", phone: "", email: "" });
      toast({
        title: "Thành công",
        description: "Đã thêm liên hệ mới",
      });
    } else {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên và số điện thoại",
        variant: "destructive",
      });
    }
  };

  const removeContact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  };

  const addBankAccount = () => {
    if (newBankAccount.bin && newBankAccount.accountNumber) {
      setFormData({
        ...formData,
        bankAccounts: [newBankAccount, ...formData.bankAccounts],
      });
      setNewBankAccount({
        bankName: "",
        accountHolder: "",
        accountNumber: "",
        branch: "",
        note: "",
        bin: "",
      });
      setBankInputMethod("manual");
      toast({
        title: "Thành công",
        description: "Đã thêm tài khoản ngân hàng",
      });
    } else {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin ngân hàng",
        variant: "destructive",
      });
    }
  };

  const removeBankAccount = (index: number) => {
    setFormData({
      ...formData,
      bankAccounts: formData.bankAccounts.filter((_, i) => i !== index),
    });
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleComplete = () => {
    setShowConfirmDialog(true);
  };

  const submitForm = () => {
    setShowConfirmDialog(false);
    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật thông tin hợp tác xã "${formData.name}"`,
    });
    setLocation("/cooperative");
  };

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Tên, thương hiệu, mã, thuế",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex flex-col items-center gap-4 mb-6">
            <Label>Logo / Hình ảnh đại diện</Label>
            <div className="flex items-center gap-6 w-full">
              <div
                className={`w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden relative cursor-pointer transition-all group ${isDragging["logo"] ? "border-primary bg-primary/5 scale-105" : "border-gray-300 bg-gray-50 hover:border-primary"}`}
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
                onDragEnter={(e) => handleDrag("logo", e)}
                onDragOver={(e) => handleDrag("logo", e)}
                onDragLeave={(e) => handleDrag("logo", e)}
                onDrop={handleLogoDrop}
              >
                {formData.image ? (
                  <>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-2">
                    <Image className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs text-gray-500">Upload</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div className="text-sm text-muted-foreground">
                  <p>Tải lên logo hoặc hình ảnh đại diện của hợp tác xã.</p>
                  <p>Định dạng hỗ trợ: JPG, PNG. Kích thước tối đa: 5MB.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("avatar-upload")?.click()
                  }
                  type="button"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Chọn hình ảnh
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã hợp tác xã *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: DN001, DN002..."
                data-testid="input-code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxCode">Mã số thuế</Label>
              <Input
                id="taxCode"
                value={formData.taxCode}
                onChange={(e) =>
                  setFormData({ ...formData, taxCode: e.target.value })
                }
                placeholder="Nhập mã số thuế"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên hợp tác xã *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Hợp tác xã ABC..."
                data-testid="input-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandName">Tên thương hiệu</Label>
              <Input
                id="brandName"
                value={formData.brandName}
                onChange={(e) =>
                  setFormData({ ...formData, brandName: e.target.value })
                }
                placeholder="VD: EcoFarm..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classification">Phân loại</Label>
              <MultiSelect
                options={classificationOptions}
                placeholder="Chọn phân loại..."
                value={formData.classification}
                onChange={(v) =>
                  setFormData({ ...formData, classification: v })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxAddress">Địa chỉ thuế</Label>
              <Input
                id="taxAddress"
                value={formData.taxAddress}
                onChange={(e) =>
                  setFormData({ ...formData, taxAddress: e.target.value })
                }
                placeholder="Địa chỉ đăng ký thuế"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="representative">Người đại diện pháp luật *</Label>
              <Input
                id="representative"
                value={formData.representative}
                onChange={(e) =>
                  setFormData({ ...formData, representative: e.target.value })
                }
                placeholder="Họ và tên"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foundedDate">Ngày thành lập</Label>
              <Input
                id="foundedDate"
                type="date"
                value={formData.foundedDate}
                onChange={(e) =>
                  setFormData({ ...formData, foundedDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Địa chỉ trụ sở</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Tỉnh / Thành phố *</Label>
                <Select
                  value={formData.province}
                  onValueChange={(val) =>
                    setFormData({ ...formData, province: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Tỉnh / Thành Phố" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((province) => (
                      <SelectItem key={province.code} value={province.code}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Phường / Xã *</Label>
                <Select
                  value={formData.ward}
                  onValueChange={(val) =>
                    setFormData({ ...formData, ward: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Phường / Xã" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.find(
                      (p) => p.code === formData.province,
                    )?.districts.map((district) => (
                      <SelectItem key={district.code} value={district.code}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="address">Địa chỉ chi tiết</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Số nhà, đường, ấp..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả hợp tác xã</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Giới thiệu về hợp tác xã"
              rows={3}
            />
          </div>
        </div>
      ),
      isValid: formData.name.length > 0 && formData.code.length > 0,
    },
    {
      id: "contact",
      title: "Thông tin liên hệ",
      description: "Danh sách liên hệ",
      content: (
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Thêm liên hệ mới
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="contact-name">Họ và tên *</Label>
                  <Input
                    id="contact-name"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Số điện thoại *</Label>
                  <Input
                    id="contact-phone"
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact({ ...newContact, phone: e.target.value })
                    }
                    placeholder="09xx xxx xxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <Button onClick={addContact} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Thêm vào danh sách
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Danh sách liên hệ
              </h3>
              <Badge variant="outline">
                {formData.contacts.length} liên hệ
              </Badge>
            </div>

            {formData.contacts.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
                <p>Chưa có thông tin liên hệ nào.</p>
                <p className="text-sm">
                  Vui lòng thêm liên hệ ở form phía trên.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.contacts.map((contact, index) => (
                  <div
                    key={index}
                    className="relative group bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-bold">{contact.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeContact(index)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground ml-10">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <span>{contact.phone}</span>
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
      isValid: formData.contacts.length > 0,
    },
    {
      id: "branches",
      title: "Chi nhánh",
      description: "Quản lý chi nhánh",
      content: (
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Quản lý chi nhánh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={branchInputMethod}
                onValueChange={(val: any) => setBranchInputMethod(val)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1">
                  <TabsTrigger
                    value="create"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Tạo mới
                  </TabsTrigger>
                  <TabsTrigger
                    value="excel"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <FileText className="w-4 h-4 mr-2" /> Nhập Excel
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="excel"
                  className="space-y-4 animate-in fade-in-50 duration-300"
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
                            "https://static.affina.com.vn/affina/3b0bd357-e259-4ff0-9016-0c23334c5279.xlsx",
                            "_blank",
                          )
                        }
                      >
                        <Download className="w-4 h-4 mr-2" /> Tải mẫu
                      </Button>
                    </div>

                    <div
                      className={`border-2 border-dashed rounded-xl p-10 text-center transition-all group cursor-pointer ${isDragging["branch-excel"] ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"}`}
                      onClick={() =>
                        document.getElementById("branch-excel-upload")?.click()
                      }
                      onDragEnter={(e) => handleDrag("branch-excel", e)}
                      onDragOver={(e) => handleDrag("branch-excel", e)}
                      onDragLeave={(e) => handleDrag("branch-excel", e)}
                      onDrop={handleBranchExcelDrop}
                    >
                      <input
                        id="branch-excel-upload"
                        type="file"
                        accept=".xlsx, .xls"
                        className="hidden"
                        onChange={handleBranchExcelUpload}
                      />
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <h4 className="font-bold text-lg mb-2">
                        Tải lên danh sách chi nhánh
                      </h4>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                        Kéo thả file .xlsx hoặc .xls vào đây để nhập danh sách
                        chi nhánh tự động
                      </p>
                      <Button
                        variant="secondary"
                        className="px-8 pointer-events-none"
                      >
                        Chọn file
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="create"
                  className="space-y-4 animate-in fade-in-50 duration-300"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tên chi nhánh *</Label>
                      <Input
                        value={newBranch.name}
                        onChange={(e) =>
                          setNewBranch({ ...newBranch, name: e.target.value })
                        }
                        placeholder="Nhập tên chi nhánh"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mã số thuế</Label>
                      <Input
                        value={newBranch.taxCode}
                        onChange={(e) =>
                          setNewBranch({
                            ...newBranch,
                            taxCode: e.target.value,
                          })
                        }
                        placeholder="MST chi nhánh"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Số điện thoại</Label>
                      <Input
                        value={newBranch.phone}
                        onChange={(e) =>
                          setNewBranch({ ...newBranch, phone: e.target.value })
                        }
                        placeholder="SĐT chi nhánh"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={newBranch.email}
                        onChange={(e) =>
                          setNewBranch({ ...newBranch, email: e.target.value })
                        }
                        placeholder="Email chi nhánh"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Địa chỉ thuế</Label>
                      <Input
                        value={newBranch.taxAddress}
                        onChange={(e) =>
                          setNewBranch({
                            ...newBranch,
                            taxAddress: e.target.value,
                          })
                        }
                        placeholder="Địa chỉ đăng ký thuế"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Địa chỉ chi nhánh</Label>
                      <Input
                        value={newBranch.address}
                        onChange={(e) =>
                          setNewBranch({
                            ...newBranch,
                            address: e.target.value,
                          })
                        }
                        placeholder="Địa chỉ hoạt động"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Ghi chú</Label>
                      <Textarea
                        value={newBranch.note}
                        onChange={(e) =>
                          setNewBranch({ ...newBranch, note: e.target.value })
                        }
                        placeholder="Ghi chú thêm..."
                        rows={2}
                      />
                    </div>
                  </div>
                  <Button onClick={addBranch} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm vào danh sách
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center justify-between">
              Danh sách chi nhánh
              <Badge variant="secondary">{formData.branches.length}</Badge>
            </h4>

            {formData.branches.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">
                  Chưa có chi nhánh nào được thêm
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Vui lòng thêm chi nhánh từ form bên trên
                </p>
              </div>
            ) : (
              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Tên chi nhánh
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Mã số thuế
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Liên hệ
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Địa chỉ
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.branches.map((branch, index) => (
                      <tr
                        key={index}
                        className="border-b last:border-0 hover:bg-muted/10 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">{branch.name}</td>
                        <td className="py-3 px-4">{branch.taxCode || "-"}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs">{branch.phone}</span>
                            <span className="text-xs text-muted-foreground">
                              {branch.email}
                            </span>
                          </div>
                        </td>
                        <td
                          className="py-3 px-4 max-w-[200px] truncate"
                          title={branch.address}
                        >
                          {branch.address || "-"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => removeBranch(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "bank",
      title: "Ngân hàng",
      description: "Tài khoản thanh toán",
      content: (
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
                        options={bankOptions}
                        value={newBankAccount.bin}
                        onChange={(val) =>
                          setNewBankAccount({
                            ...newBankAccount,
                            bin: val,
                            bankName:
                              bankOptions.find((bank) => bank.bin === val)
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
                      <h4 className="font-bold text-lg mb-2">
                        Tải lên file Excel
                      </h4>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                        Kéo thả file .xlsx hoặc .xls vào đây để nhập danh sách
                        tài khoản tự động
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
                  Các tài khoản ngân hàng bạn thêm sẽ hiển thị tại đây để kiểm
                  tra trước khi lưu
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
                    const bankInfo = vietQrBankData.find(
                      (b) => b.bin === acc.bin,
                    );

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
      ),
    },
    {
      id: "documents",
      title: "Tài liệu",
      description: "Giấy phép, chứng chỉ",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-4">
            <h3 className="font-semibold">Tài liệu đính kèm</h3>
            <p className="text-sm text-muted-foreground">
              Upload giấy phép kinh doanh, chứng chỉ VietGAP, GlobalGAP (nếu có)
            </p>
          </div>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${isDragging["documents"] ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50"}`}
            onClick={() => document.getElementById("document-upload")?.click()}
            onDragEnter={(e) => handleDrag("documents", e)}
            onDragOver={(e) => handleDrag("documents", e)}
            onDragLeave={(e) => handleDrag("documents", e)}
            onDrop={handleDocumentDrop}
          >
            <input
              id="document-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleDocumentUpload}
            />
            <Upload
              className={`w-12 h-12 mx-auto mb-4 transition-colors ${isDragging["documents"] ? "text-primary" : "text-muted-foreground"}`}
            />
            <p className="font-medium mb-1">
              Kéo thả file hoặc click để tải lên
            </p>
            <p className="text-sm text-muted-foreground">
              Hỗ trợ PDF, Word, hình ảnh (tối đa 5MB mỗi file)
            </p>
            <Button variant="outline" className="mt-4 pointer-events-none">
              <Upload className="w-4 h-4 mr-2" />
              Chọn file
            </Button>
          </div>
          <div className="space-y-2">
            {formData.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group"
              >
                {doc.type.includes("image") ? (
                  <Image className="w-5 h-5 text-green-600" />
                ) : (
                  <FileText className="w-5 h-5 text-blue-600" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.size} • Đã tải lên
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600">
                    <Check className="w-3 h-3 mr-1" /> Hoàn thành
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDocumentDelete(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: (
        <div className="space-y-10 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-2">
              Kiểm tra thông tin
            </h3>
            <p className="text-muted-foreground text-base">
              Vui lòng xem lại tất cả các thông tin trước khi hoàn tất cập nhật
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Overview Card (Column 1) */}
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
                    {formData.name || "Tên hợp tác xã"}
                  </CardDescription>
                  <div className="flex justify-center gap-2 mt-4">
                    {formData.classification.map((item) => (
                      <Badge
                        key={item}
                        variant="outline"
                        className="capitalize px-3 py-1 text-xs font-semibold bg-primary/5 text-primary border-primary/20"
                      >
                        {classificationOptions.find((opt) => opt.value === item)
                          ?.label ?? item}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 border-t bg-muted/5">
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shadow-sm border">
                        <CreditCard className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                          Mã hợp tác xã
                        </p>
                        <p className="font-bold text-base">
                          {formData.code || "N/A"}
                        </p>
                      </div>
                    </div>
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
                          {formData.ward && `, ${formData.ward}`}
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
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8 mb-6">
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
                      <CardContent className="grid md:grid-cols-2 gap-8 py-6 px-6">
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
                                    <Phone className="w-3 h-3" />{" "}
                                    {contact.phone}
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
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
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
                                    title={branch.note}
                                    className="font-medium truncate"
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
                    <div className="flex flex-col gap-4 justify-between bg-muted/5 p-4 rounded-xl border border-primary/10">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <h4 className="font-bold text-lg">
                          Tài khoản thanh toán
                        </h4>
                        <Badge className="bg-primary/10 text-primary border-none">
                          {formData.bankAccounts.length}
                        </Badge>
                      </div>
                      <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          placeholder="Tìm nhanh: Tên, Số tài khoản, Chủ thẻ..."
                          value={confirmBankSearchQuery}
                          onChange={(e) =>
                            setConfirmBankSearchQuery(e.target.value)
                          }
                          className="pl-10 bg-background border-primary/20 focus:border-primary shadow-sm h-10 text-sm"
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
                            const query = confirmBankSearchQuery.toLowerCase();
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
                                  <div className="grid grid-cols-2 gap-4 text-xs font-medium border-t pt-4">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      ),
    },
  ];

  return (
    <AdminLayout
      title={`Cập nhật Hợp tác xã`}
      description="Cập nhật thông tin chi tiết"
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/cooperative")}
            completeLabel="Cập nhật"
          />
        </CardContent>
      </Card>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận cập nhật</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn cập nhật hợp tác xã "{formData.name}" không?
              <br />
              Thông tin mới sẽ được lưu vào hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={submitForm}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
