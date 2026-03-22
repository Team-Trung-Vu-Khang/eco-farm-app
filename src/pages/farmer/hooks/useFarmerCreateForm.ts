import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import type { FarmerFormData, BankAccount, Document, Contact } from "../types";
import { vietQrBankData } from "../../../constants/banks";
import { parseVietQR } from "../../../utils/commons";
import readXlsxFile from "read-excel-file";
import QrScanner from "qr-scanner";

export function useFarmerCreateForm() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/farmer/:id/edit");
  const isEdit = match && !!params?.id;
  const { toast } = useToast();

  const addEnterprise = useEnterpriseStore((state) => state.addEnterprise);
  const updateEnterprise = useEnterpriseStore((state) => state.updateEnterprise);
  const getEnterpriseById = useEnterpriseStore((state) => state.getEnterpriseById);

  const [formData, setFormData] = useState<FarmerFormData>({
    type: "farm",
    code: "",
    name: "",
    brandName: "",
    taxCode: "",
    taxAddress: "",
    taxAuthority: "",
    issueDate: "",
    classification: [],
    foundedDate: "",
    representative: "",
    website: "",
    phone: "",
    email: "",
    province: "",
    ward: "",
    address: "",
    image: "",
    description: "",
    contacts: [],
    branches: [],
    bankAccounts: [],
    documents: [],
  });

  const [newContact, setNewContact] = useState<Contact>({
    name: "",
    phone: "",
    email: "",
  });

  const [newBankAccount, setNewBankAccount] = useState<BankAccount>({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    branch: "",
    note: "",
    bin: "",
  });

  const [bankInputMethod, setBankInputMethod] = useState<
    "manual" | "excel" | "qr-image" | "qr-scan"
  >("manual");
  const [hasCamera, setHasCamera] = useState(false);
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [confirmBankSearchQuery, setConfirmBankSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState<Record<string, boolean>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (isEdit && params?.id) {
      const item = getEnterpriseById(Number(params.id));
      if (item) {
        setFormData({
          ...item,
          brandName: item.brandName || "",
          type: item.type as "enterprise" | "farm" | "cooperative",
          classification: item.classification || [],
          contacts: (item.contacts as any) || [],
          branches: (item.branches as any) || [],
          bankAccounts: (item.bankAccounts as any) || [],
          documents: (item.documents as any) || [],
        } as FarmerFormData);
      }
    }
  }, [isEdit, params?.id, getEnterpriseById]);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput",
        );
        setHasCamera(videoDevices.length > 0);
      });
    }
  }, []);

  const updateField = (field: keyof FarmerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDrag = (id: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging((prev) => ({ ...prev, [id]: true }));
    } else if (e.type === "dragleave" || e.type === "drop") {
      setIsDragging((prev) => ({ ...prev, [id]: false }));
    }
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

  const processQRImage = async (file: File) => {
    try {
      const result = await QrScanner.scanImage(file);
      const parsed = parseVietQR(result);

      if (parsed) {
        setNewBankAccount((prev) => ({
          ...prev,
          bin: parsed.bin || prev.bin,
          bankName: parsed.bankName || prev.bankName,
          accountNumber: parsed.accountNumber || prev.accountNumber,
          accountHolder: parsed.accountHolder || prev.accountHolder,
          note: parsed.note || prev.note,
        }));
        toast({
          title: "Đã đọc mã QR",
          description: "Thông tin ngân hàng đã được trích xuất.",
        });
        setBankInputMethod("manual");
      } else {
        toast({
          title: "Thông báo",
          description:
            "Đã đọc được QR nhưng không tìm thấy thông tin tài khoản ngân hàng standard.",
        });
      }
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy mã QR trong ảnh này.",
        variant: "destructive",
      });
    }
  };

  const handleLiveScan = (result: any) => {
    if (!result || result.length === 0) return;
    const text = result[0].rawValue;
    const parsed = parseVietQR(text);

    if (parsed) {
      setNewBankAccount((prev) => ({
        ...prev,
        bin: parsed.bin || prev.bin,
        note: parsed.note || prev.note,
        bankName: parsed.bankName || prev.bankName,
        accountNumber: parsed.accountNumber || prev.accountNumber,
        accountHolder: parsed.accountHolder || prev.accountHolder,
      }));
      toast({
        title: "Quét thành công",
        description: "Thông tin ngân hàng đã được trích xuất.",
      });
      setBankInputMethod("manual");
    }
  };

  const processLogoImage = (file: File) => {
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const processDocuments = (files: FileList) => {
    const newDocs = Array.from(files).map((file) => ({
      name: file.name,
      type: file.type,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
    }));

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newDocs],
    }));

    toast({
      title: "Đã tải lên",
      description: `Đã thêm ${newDocs.length} tài liệu.`,
    });
  };

  const addBankAccount = () => {
    if (
      newBankAccount.bankName &&
      newBankAccount.accountNumber &&
      newBankAccount.accountHolder
    ) {
      setFormData((prev) => ({
        ...prev,
        bankAccounts: [newBankAccount, ...prev.bankAccounts],
      }));
      setNewBankAccount({
        bankName: "",
        accountHolder: "",
        accountNumber: "",
        branch: "",
        note: "",
        bin: "",
      });
    } else {
      toast({
        title: "Lỗi",
        description:
          "Vui lòng nhập tên ngân hàng, số tài khoản và chủ tài khoản",
        variant: "destructive",
      });
    }
  };

  const removeBankAccount = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter((_, i) => i !== index),
    }));
  };

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setFormData((prev) => ({
        ...prev,
        contacts: [...prev.contacts, newContact],
      }));
      setNewContact({ name: "", phone: "", email: "" });
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

  const submitForm = () => {
    if (isEdit && params?.id) {
       updateEnterprise(Number(params.id), {
        ...formData,
        status: "active" as const,
      } as any);
      toast({
        title: "Thành công",
        description: `Đã cập nhật nông hộ "${formData.name}"`,
      });
    } else {
      addEnterprise({
        ...formData,
        status: "active" as const,
      } as any);
      toast({
        title: "Thành công",
        description: `Đã tạo nông hộ "${formData.name}"`,
      });
    }
    setShowConfirmDialog(false);
    setLocation("/farmer");
  };

  return {
    isEdit,
    formData,
    setFormData,
    updateField,
    newBankAccount,
    setNewBankAccount,
    bankInputMethod,
    setBankInputMethod,
    hasCamera,
    bankSearchQuery,
    setBankSearchQuery,
    confirmBankSearchQuery,
    setConfirmBankSearchQuery,
    isDragging,
    handleDrag,
    processExcelFile,
    processQRImage,
    handleLiveScan,
    processLogoImage,
    processDocuments,
    newContact,
    setNewContact,
    addContact,
    removeContact,
    addBankAccount,
    removeBankAccount,
    submitForm,
    showConfirmDialog,
    setShowConfirmDialog,
    navigateBack: () => setLocation("/farmer"),
  };
}
