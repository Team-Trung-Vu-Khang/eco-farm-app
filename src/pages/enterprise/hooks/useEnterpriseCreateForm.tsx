import { useToast, type Step } from "@Team-Trung-Vu-Khang/eco-shared-ui";

import { vietQrBankData } from "@/constants/banks";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import { parseVietQR } from "@/utils/commons";
import QrScanner from "qr-scanner";
import { useEffect, useMemo, useState } from "react";
import readXlsxFile from "read-excel-file";
import { useLocation } from "wouter";
import { EnterpriseBankAccountsStep } from "../components/steps/EnterpriseBankAccountsStep";
import { EnterpriseBasicInfoStep } from "../components/steps/EnterpriseBasicInfoStep";
import { EnterpriseContactsStep } from "../components/steps/EnterpriseContactsStep";
import { EnterpriseBranchesStep } from "../components/steps/EnterpriseBranchesStep";
import { EnterpriseConfirmationStep } from "../components/steps/EnterpriseConfirmationStep";
import { EnterpriseDocumentsStep } from "../components/steps/EnterpriseDocumentsStep";

import type { BankAccount, Branch, Contact } from "../data/constants";
import type { EnterpriseFormData } from "../types";

export function useEnterpriseCreateForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<EnterpriseFormData>({
    type: "enterprise",
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
    district: "",
    ward: "",
    latitude: undefined,
    longitude: undefined,
    address: "",
    image: "",
    description: "",
    contacts: [],
    branches: [],
    bankAccounts: [],
    documents: [],
  });

  const [newBankAccount, setNewBankAccount] = useState<BankAccount>({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    branch: "",
    note: "",
    bin: "",
  });
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

  const [bankInputMethod, setBankInputMethod] = useState<
    "manual" | "excel" | "qr-image" | "qr-scan"
  >("manual");
  const [branchInputMethod, setBranchInputMethod] = useState<
    "create" | "excel"
  >("create");
  const [hasCamera, setHasCamera] = useState(false);
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [confirmBankSearchQuery, setConfirmBankSearchQuery] = useState("");

  useEffect(() => {
    // Check for camera availability
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput",
        );
        setHasCamera(videoDevices.length > 0);
      });
    }
  }, []);

  const [isDragging, setIsDragging] = useState<Record<string, boolean>>({});

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

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processExcelFile(file);
  };

  const handleExcelDrop = (e: React.DragEvent) => {
    handleDrag("excel", e);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      processExcelFile(file);
    } else if (file) {
      toast({
        title: "Lỗi",
        description: "Vui lòng tải lên file Excel (.xlsx, .xls)",
        variant: "destructive",
      });
    }
  };

  const processBranchExcelFile = async (file: File) => {
    try {
      const rows = await readXlsxFile(file);
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

  const handleQRImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processQRImage(file);
  };

  const handleQRImageDrop = (e: React.DragEvent) => {
    handleDrag("qr-image", e);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processQRImage(file);
    }
  };

  const processLogoImage = (file: File) => {
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processLogoImage(file);
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    handleDrag("logo", e);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processLogoImage(file);
    }
  };

  const handleDocumentDelete = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const processDocuments = (files: FileList) => {
    const file = files[0];
    if (!file) return;

    const newDoc = {
      name: file.name,
      type: file.type,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      url: URL.createObjectURL(file),
    };

    setFormData((prev) => ({
      ...prev,
      documents: [newDoc],
    }));

    toast({
      title: "Đã tải lên",
      description: "Đã tải lên tài liệu.",
    });
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processDocuments(e.target.files);
  };

  const handleDocumentDrop = (e: React.DragEvent) => {
    handleDrag("documents", e);
    if (e.dataTransfer.files) processDocuments(e.dataTransfer.files);
  };

  const addBankAccount = () => {
    if (newBankAccount.bankName && newBankAccount.accountNumber) {
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
        logo: "",
      });
    } else {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên ngân hàng và số tài khoản",
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

  const addContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      setFormData((prev) => ({
        ...prev,
        contacts: [...prev.contacts, newContact],
      }));
      setNewContact({
        name: "",
        phone: "",
        email: "",
      });
    } else {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên và số điện thoại liên hệ",
        variant: "destructive",
      });
    }
  };

  const removeContact = (index: number) => {
    setFormData({
      ...formData,
      contacts: formData.contacts.filter((_, i) => i !== index),
    });
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

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleComplete = () => {
    setShowConfirmDialog(true);
  };

  const addEnterprise = useEnterpriseStore((state) => state.addEnterprise);

  const submitForm = () => {
    const newEnterprise = {
      code: formData.code,
      name: formData.name,
      brandName: formData.brandName,
      image: formData.image,
      type: formData.type,
      classification: formData.classification as (
        | "production"
        | "processing"
        | "trading"
        | "service"
        | "other"
      )[],
      taxCode: formData.taxCode,
      taxAddress: formData.taxAddress,
      taxAuthority: formData.taxAuthority,
      issueDate: formData.issueDate,
      address: formData.address,
      ward: formData.ward,
      district: formData.district,
      province: formData.province,
      latitude: formData.latitude,
      longitude: formData.longitude,
      foundedDate: formData.foundedDate,
      representative: formData.representative,
      website: formData.website,
      description: formData.description,
      phone: formData.phone,
      email: formData.email,
      status: "active" as const,
      contacts: formData.contacts,
      documents: formData.documents,
      branches: formData.branches,
      bankAccounts: formData.bankAccounts,
    };

    addEnterprise(newEnterprise);
    setShowConfirmDialog(false);
    toast({
      title: "Thành công",
      description: `Đã tạo doanh nghiệp "${formData.name}"`,
    });
    setLocation("/enterprise");
  };

  const steps: Step[] = useMemo(() => {
    const nextSteps: Step[] = [
      {
        id: "basic",
        title: "Thông tin cơ bản",
        description: "Tên, thương hiệu, mã, thuế",
        content: <EnterpriseBasicInfoStep />,
        isValid: formData.name.length > 0 && formData.code.length > 0,
      },
      {
        id: "contacts",
        title: "Thông tin liên hệ",
        description: "Danh sách liên hệ",
        content: <EnterpriseContactsStep />,
        isValid: formData.contacts.length > 0,
      },
      {
        id: "branches",
        title: "Chi nhánh",
        description: "Quản lý chi nhánh",
        content: <EnterpriseBranchesStep />,
      },
      {
        id: "bank",
        title: "Ngân hàng",
        description: "Tài khoản thanh toán",
        content: <EnterpriseBankAccountsStep />,
      },
    ];

    if (formData.type !== "farm") {
      nextSteps.push({
        id: "documents",
        title:
          formData.type === "cooperative"
            ? "Giấy chứng nhận đăng ký hợp tác xã (do cơ quan đăng ký kinh doanh cấp huyện cấp)."
            : "Giấy phép kinh doanh",
        description:
          formData.type === "cooperative"
            ? "Giấy chứng nhận đăng ký hợp tác xã (do cơ quan đăng ký kinh doanh cấp huyện cấp)."
            : "Tải lên hoặc kiểm tra các giấy tờ pháp lý liên quan đến doanh nghiệp.",
        content: (
          <EnterpriseDocumentsStep
            title={
              formData.type === "cooperative"
                ? "Giấy chứng nhận đăng ký hợp tác xã (do cơ quan đăng ký kinh doanh cấp huyện cấp)."
                : "Sửa giấy phép kinh doanh"
            }
            description={
              formData.type === "cooperative"
                ? "Giấy chứng nhận đăng ký hợp tác xã (do cơ quan đăng ký kinh doanh cấp huyện cấp)."
                : "Chỉ upload 1 file giấy phép kinh doanh."
            }
            uploadLabel="Chọn file"
          />
        ),
      });
    }

    nextSteps.push({
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: <EnterpriseConfirmationStep />,
    });

    return nextSteps;
  }, [
    formData.bankAccounts.length,
    formData.branches.length,
    formData.code,
    formData.contacts.length,
    formData.name,
    formData.type,
  ]);

  return {
    isDragging,
    handleDrag,
    handleLogoDrop,
    handleImageUpload,
    newContact,
    setNewContact,
    addContact,
    removeContact,
    newBranch,
    setNewBranch,
    branchInputMethod,
    setBranchInputMethod,
    handleBranchExcelDrop,
    handleBranchExcelUpload,
    addBranch,
    removeBranch,
    bankInputMethod,
    setBankInputMethod,
    hasCamera,
    newBankAccount,
    setNewBankAccount,
    addBankAccount,
    removeBankAccount,
    handleExcelDrop,
    handleExcelUpload,
    handleQRImageDrop,
    handleQRImageUpload,
    handleLiveScan,
    bankSearchQuery,
    setBankSearchQuery,
    confirmBankSearchQuery,
    setConfirmBankSearchQuery,
    handleDocumentDrop,
    handleDocumentUpload,
    handleDocumentDelete,
    setFormData,
    steps,
    showConfirmDialog,
    setShowConfirmDialog,
    submitForm,
    formData,
    setLocation,
    handleComplete,
  };
}
