import { useToast, type Step } from "@Team-Trung-Vu-Khang/eco-shared-ui";

import QrScanner from "qr-scanner";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";

import { vietQrBankData } from "@/constants/banks";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import { parseVietQR } from "@/utils/commons";
import readXlsxFile from "read-excel-file";
import { EnterpriseBankAccountsStep } from "../components/steps/EnterpriseBankAccountsStep";
import { EnterpriseBasicInfoStep } from "../components/steps/EnterpriseBasicInfoStep";
import { EnterpriseBranchesStep } from "../components/steps/EnterpriseBranchesStep";
import { EnterpriseConfirmationStep } from "../components/steps/EnterpriseConfirmationStep";
import { EnterpriseDocumentsStep } from "../components/steps/EnterpriseDocumentsStep";
import type { BankAccount, Branch } from "../data/constants";
import type { EnterpriseFormData } from "../types";

export function useEnterpriseEditForm() {
  const [, params] = useRoute("/enterprise/:id/edit");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const getEnterpriseById = useEnterpriseStore(
    (state) => state.getEnterpriseById,
  );
  const updateEnterprise = useEnterpriseStore(
    (state) => state.updateEnterprise,
  );

  const enterpriseId = params?.id ? Number(params.id) : null;
  const enterpriseData = enterpriseId
    ? getEnterpriseById(enterpriseId)
    : undefined;

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
    province: "",
    district: "",
    ward: "",
    address: "",
    image: "",
    description: "",
    phone: "",
    email: "",
    contacts: [],
    branches: [],
    bankAccounts: [],
    documents: [],
  });

  useEffect(() => {
    if (enterpriseData) {
      setFormData({
        type: enterpriseData.type,
        code: enterpriseData.code,
        name: enterpriseData.name,
        brandName: enterpriseData.brandName || "",
        taxCode: enterpriseData.taxCode,
        taxAddress: enterpriseData.taxAddress || "",
        taxAuthority: enterpriseData.taxAuthority || "",
        issueDate: enterpriseData.issueDate || "",
        classification: enterpriseData.classification,
        foundedDate: enterpriseData.foundedDate || "",
        representative: enterpriseData.representative || "",
        website: enterpriseData.website || "",
        province: enterpriseData.province || "",
        district: enterpriseData.district || "",
        ward: enterpriseData.ward || "",
        address: enterpriseData.address,
        image: enterpriseData.image || "",
        description: enterpriseData.description || "",
        phone: enterpriseData.phone || "",
        email: enterpriseData.email || "",
        contacts: enterpriseData.contacts || [],
        branches: enterpriseData.branches || [],
        bankAccounts: enterpriseData.bankAccounts || [],
        documents: enterpriseData.documents || [],
      });
    } else if (enterpriseId) {
      // Handle not found if needed, or redirect
      // setLocation("/enterprise");
    }
  }, [enterpriseData, enterpriseId]);

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
    if (!enterpriseId) return;

    const updatedEnterprise: any = {
      id: enterpriseId,
      code: formData.code,
      name: formData.name,
      image: formData.image,
      type: formData.type,
      classification: formData.classification as any,
      taxCode: formData.taxCode,
      address: formData.address, // Mapping only address as per current store structure, ideally should store components too if needed
      phone: formData.phone,
      email: formData.email,
      status: enterpriseData?.status || "active",
      createdAt: enterpriseData?.createdAt || new Date().toISOString(),

      // Extended fields
      brandName: formData.brandName,
      representative: formData.representative,
      foundedDate: formData.foundedDate,
      website: formData.website,
      province: formData.province,
      district: formData.district,
      ward: formData.ward,
      taxAddress: formData.taxAddress,
      taxAuthority: formData.taxAuthority,
      issueDate: formData.issueDate,
      description: formData.description,
      contacts: formData.contacts,
      branches: formData.branches,
      bankAccounts: formData.bankAccounts,
      documents: formData.documents,
    };

    // Exclude ID from the update object as it is passed separately
    const { id, ...updateData } = updatedEnterprise;
    updateEnterprise(enterpriseId, updateData);
    setShowConfirmDialog(false);
    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật thông tin ${
        formData.type === "enterprise"
          ? "doanh nghiệp"
          : formData.type === "cooperative"
            ? "hợp tác xã"
            : "nông hộ"
      } "${formData.name}"`,
    });
    setLocation("/enterprise");
  };

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Tên, thương hiệu, mã, thuế",
      content: <EnterpriseBasicInfoStep />,
      isValid: formData.name.length > 0 && formData.code.length > 0,
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
    {
      id: "documents",
      title: "Tài liệu",
      description: "Giấy phép, chứng chỉ",
      content: <EnterpriseDocumentsStep />,
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: <EnterpriseConfirmationStep />,
    },
  ];

  return {
    isDragging,
    handleDrag,
    handleLogoDrop,
    handleImageUpload,
    branchInputMethod,
    setBranchInputMethod,
    handleBranchExcelDrop,
    handleBranchExcelUpload,
    newBranch,
    setNewBranch,
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
