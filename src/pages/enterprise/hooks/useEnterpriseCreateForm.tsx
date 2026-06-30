import { useToast, type Step } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import QrScanner from "qr-scanner";
import { useEffect, useMemo, useRef, useState, type SetStateAction } from "react";
import readXlsxFile from "read-excel-file";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";

import { vietQrBankData } from "@/constants/banks";
import { useCreateOrganization } from "@/features/organization";
import { useMasterData } from "@/features/master-data";
import { useUploadStorageFile } from "@/features/storage/hooks/useUploadStorageFile";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { EnterpriseBankAccountsStep } from "../components/steps/EnterpriseBankAccountsStep";
import { EnterpriseBasicInfoStep } from "../components/steps/EnterpriseBasicInfoStep";
import { EnterpriseContactsStep } from "../components/steps/EnterpriseContactsStep";
import { EnterpriseBranchesStep } from "../components/steps/EnterpriseBranchesStep";
import { EnterpriseConfirmationStep } from "../components/steps/EnterpriseConfirmationStep";
import { EnterpriseDocumentsStep } from "../components/steps/EnterpriseDocumentsStep";

import type { BankAccount, Branch, Contact } from "../data/constants";
import {
  defaultEnterpriseFormValues,
  enterpriseFormSchema,
  type EnterpriseFormInput,
  type EnterpriseFormValues,
} from "../data/enterprise-form.schema";
import type { EnterpriseFormData } from "../types";
import { parseVietQR } from "@/utils/commons";

type BusinessLineRecord = {
  id: number | string;
  code: string;
  name: string;
};

const CLASSIFICATION_TO_BUSINESS_LINE: Record<string, string> = {
  production: "SX",
  processing: "CB",
  trading: "TM",
  service: "DV",
  other: "KHAC",
};

const CLASSIFICATION_LABELS: Record<string, string> = {
  production: "Sản xuất",
  processing: "Chế biến",
  trading: "Thương mại",
  service: "Dịch vụ",
  other: "Khác",
};

const normalizeBytes = (size?: string) => {
  if (!size) return undefined;
  const numeric = Number.parseFloat(size.replace(/[^0-9.,]/g, "").replace(",", "."));
  if (!Number.isFinite(numeric)) return undefined;
  const unit = size.toLowerCase();
  if (unit.includes("kb")) return Math.round(numeric * 1024);
  if (unit.includes("mb")) return Math.round(numeric * 1024 * 1024);
  if (unit.includes("gb")) return Math.round(numeric * 1024 * 1024 * 1024);
  return Math.round(numeric);
};

export function useEnterpriseCreateForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const workspaceId = useSelectedWorkspaceId();

  const businessLinesQuery = useMasterData("business-lines", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });

  const createOrganization = useCreateOrganization({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã tạo doanh nghiệp mới",
      });
      setLocation("/enterprise");
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadLogo = useUploadStorageFile({
    onError: (error) => {
      toast({
        title: "Không thể tải logo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const businessLineRecords = useMemo(
    () => businessLinesQuery.items as BusinessLineRecord[],
    [businessLinesQuery.items],
  );
  const logoUploadSeqRef = useRef(0);

  const form = useForm<EnterpriseFormInput, unknown, EnterpriseFormValues>({
    defaultValues: defaultEnterpriseFormValues,
    resolver: zodResolver(enterpriseFormSchema),
    mode: "onSubmit",
  });

  const { watch, getValues, setValue, handleSubmit, control } = form;
  const formData = watch() as EnterpriseFormData;
  const setFormData = (updater: SetStateAction<EnterpriseFormData>) => {
    const nextValue =
      typeof updater === "function"
        ? updater(getValues() as EnterpriseFormData)
        : updater;

    Object.entries(nextValue).forEach(([key, value]) => {
      setValue(key as keyof EnterpriseFormInput, value as never, {
        shouldDirty: true,
        shouldTouch: true,
      });
    });
  };

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
          bankAccounts: [...newAccounts, ...(prev.bankAccounts ?? [])],
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
          branches: [...(prev.branches ?? []), ...importedBranches],
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

  const processLogoImage = async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: previewUrl }));

    const requestSeq = ++logoUploadSeqRef.current;

    try {
      const uploaded = await uploadLogo.uploadStorageFile({
        file,
        folder: "organizations",
      });

      if (logoUploadSeqRef.current !== requestSeq) return;

      setFormData((prev) => ({ ...prev, image: uploaded.fileUrl }));
      URL.revokeObjectURL(previewUrl);
      toast({
        title: "Thành công",
        description: "Đã tải lên logo doanh nghiệp",
      });
    } catch {
      // Error toast is handled by the mutation callback.
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processLogoImage(file);
      e.target.value = "";
    }
  };

  const handleLogoDrop = async (e: React.DragEvent) => {
    handleDrag("logo", e);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await processLogoImage(file);
    }
  };

  const handleDocumentDelete = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: (prev.documents ?? []).filter((_, i) => i !== index),
    }));
  };

  const processDocuments = (files: FileList) => {
    const file = files[0];
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);

    const newDoc = {
      name: file.name,
      type: file.type,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      url: fileUrl,
      fileName: file.name,
      fileUrl,
      mimeType: file.type,
      sizeBytes: file.size,
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
        bankAccounts: [newBankAccount, ...(prev.bankAccounts ?? [])],
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
      bankAccounts: (formData.bankAccounts ?? []).filter((_, i) => i !== index),
    });
  };

  const addContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      setFormData((prev) => ({
        ...prev,
        contacts: [...(prev.contacts ?? []), newContact],
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
      contacts: (formData.contacts ?? []).filter((_, i) => i !== index),
    });
  };

  const addBranch = () => {
    if (newBranch.name.trim()) {
      setFormData({
        ...formData,
        branches: [...(formData.branches ?? []), newBranch],
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
      branches: (formData.branches ?? []).filter((_, i) => i !== index),
    });
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleComplete = () => {
    setShowConfirmDialog(true);
  };

  const submitForm = handleSubmit(async (values: EnterpriseFormValues) => {
    if (workspaceId === null) {
      toast({
        title: "Thiếu workspace",
        description: "Vui lòng chọn workspace trước khi tạo doanh nghiệp.",
        variant: "destructive",
      });
      return;
    }

    const businessLines: BusinessLineRecord[] = values.classification.map(
      (classification: string) => {
      const mappedCode =
        CLASSIFICATION_TO_BUSINESS_LINE[classification] || classification;
      const mappedName =
        CLASSIFICATION_LABELS[classification] || classification;
      const record = businessLineRecords.find(
        (item) =>
          item.code === mappedCode ||
          item.name.toLowerCase() === mappedName.toLowerCase(),
      );

      return (
        record || {
          id: mappedCode,
          code: mappedCode,
          name: mappedName,
        }
      );
      },
    );

    const payload = {
      type: values.type,
      organizationTypeId: values.organizationTypeId,
      code: values.code.trim(),
      name: values.name.trim(),
      brandName: values.brandName.trim(),
      taxCode: values.taxCode.trim(),
      taxAuthority: values.taxAuthority.trim(),
      taxAddress: values.taxAddress.trim(),
      issueDate: values.issueDate || undefined,
      businessLines,
      representative: values.representative.trim(),
      foundedDate: values.foundedDate || undefined,
      website: values.website.trim(),
      province: values.province.trim(),
      ward: values.ward.trim(),
      address: values.address.trim(),
      latitude: values.latitude ?? 0,
      longitude: values.longitude ?? 0,
      imageUrl: values.image.trim(),
      description: values.description.trim(),
      status: "active" as const,
      contacts: values.contacts.map((contact, index) => ({
        contactId: index + 1,
        name: contact.name,
        position: "",
        phone: contact.phone,
        email: contact.email,
        isPrimary: index === 0,
      })),
      branches: values.branches.map((branch, index) => ({
        id: index + 1,
        code: branch.name.slice(0, 10).toUpperCase(),
        name: branch.name,
        taxCode: branch.taxCode,
        taxAddress: branch.taxAddress,
        website: "",
        address: branch.address,
        city: "",
        ward: "",
        imageUrl: "",
        latitude: 0,
        longitude: 0,
        status: "active" as const,
        contacts: branch.phone || branch.email
          ? [
              {
                contactId: index + 1,
                name: branch.name,
                position: "",
                phone: branch.phone,
                email: branch.email,
                isPrimary: true,
              },
            ]
          : [],
        bankAccounts: [],
        metadataJson: null,
      })),
      bankAccounts: values.bankAccounts.map((account, index) => {
        const bankInfo = vietQrBankData.find(
          (bank) =>
            bank.bin === account.bin ||
            bank.name.toLowerCase() === account.bankName.toLowerCase() ||
            bank.shortName.toLowerCase() === account.bankName.toLowerCase(),
        );

        return {
          id: index + 1,
          ownerType: values.type,
          bankCode: bankInfo?.bin || account.bin || account.bankName,
          bankName: account.bankName,
          bin: account.bin || bankInfo?.bin || "",
          accountNumber: account.accountNumber,
          accountHolder: account.accountHolder,
          branch: account.branch,
          note: account.note,
          logoUrl: account.logo || bankInfo?.logo || "",
          status: "active" as const,
          isPrimary: index === 0,
          metadataJson: null,
        };
      }),
      documents: values.documents.map((doc, index) => ({
        id: index + 1,
        documentType: doc.type,
        name: doc.name,
        fileUrl: doc.fileUrl || doc.url || "",
        fileName: doc.fileName || doc.name,
        mimeType: doc.mimeType || doc.type,
        sizeBytes: doc.sizeBytes ?? normalizeBytes(doc.size),
        content: doc.content,
      })),
      metadataJson: null,
    };

    try {
      await createOrganization.createOrganization({
        payload,
        workspaceId,
      });
      setShowConfirmDialog(false);
    } catch {
      // Error toast is handled by the mutation callback.
    }
  });

  const steps: Step[] = useMemo(() => {
    const nextSteps: Step[] = [
      {
        id: "basic",
        title: "Thông tin cơ bản",
        description: "Tên, thương hiệu, mã, thuế",
        content: <EnterpriseBasicInfoStep />,
        isValid:
          formData.name.length > 0 &&
          formData.code.length > 0 &&
          formData.organizationTypeId !== "",
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
    formData.organizationTypeId,
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
    control,
    steps,
    showConfirmDialog,
    setShowConfirmDialog,
    submitForm,
    formData,
    setLocation,
    handleComplete,
  };
}
