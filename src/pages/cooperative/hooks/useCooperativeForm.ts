import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMasterData } from "@/features/master-data";
import { useCreateOrganization, useUpdateOrganization } from "@/features/organization";
import { useUploadStorageFile } from "@/features/storage/hooks/useUploadStorageFile";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type {
  Contact,
  BankAccount,
  CooperativeFormData,
  Branch,
} from "../types/types";
import readXlsxFile from "read-excel-file";
import QrScanner from "qr-scanner";
import { vietQrBankData } from "@/constants/banks";
import { parseVietQR } from "@/utils/commons";
import type { OrganizationBusinessLineRecord, OrganizationCreateRequest } from "@/features/organization";

type BankMasterDataRecord = {
  id: number | string;
  code: string;
  name: string;
  shortName?: string;
  bin?: string;
  logoUrl?: string;
};

const getBankDisplayName = (bank?: BankMasterDataRecord | null) =>
  bank?.shortName || bank?.name || "";

const findBankInfo = (
  banks: BankMasterDataRecord[],
  value: string,
) => {
  const query = value.toLowerCase().trim();
  if (!query) return undefined;

  return banks.find((bank) => {
    const searchable = [bank.code, bank.bin, bank.shortName, bank.name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return searchable.includes(query);
  });
};

const normalizeDocumentSize = (size?: string) => {
  if (!size) return undefined;
  const numeric = Number.parseFloat(
    size.replace(/[^0-9.,]/g, "").replace(",", "."),
  );
  if (!Number.isFinite(numeric)) return undefined;
  const lower = size.toLowerCase();
  if (lower.includes("kb")) return Math.round(numeric * 1024);
  if (lower.includes("mb")) return Math.round(numeric * 1024 * 1024);
  if (lower.includes("gb")) return Math.round(numeric * 1024 * 1024 * 1024);
  return Math.round(numeric);
};

const mapClassificationToBusinessLines = (
  classifications: string[],
  businessLineRecords: OrganizationBusinessLineRecord[],
): OrganizationBusinessLineRecord[] =>
  classifications.map((classification) => {
    const mappedName = classification;
    const record = businessLineRecords.find(
      (item) =>
        item.code === classification ||
        item.name.toLowerCase() === mappedName.toLowerCase(),
    );

    return (
      record || {
        id: classification,
        code: classification,
        name: mappedName,
      }
    );
  });

export function useCooperativeForm(initialData?: Partial<CooperativeFormData>) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const workspaceId = useSelectedWorkspaceId();

  const organizationTypesQuery = useMasterData("organization-types", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });
  const banksQuery = useMasterData("banks", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });
  const businessLinesQuery = useMasterData("business-lines", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });

  const organizationTypes = organizationTypesQuery.items;
  const bankMasterData = useMemo(
    () => banksQuery.items as BankMasterDataRecord[],
    [banksQuery.items],
  );
  const businessLineRecords = useMemo(
    () => businessLinesQuery.items as OrganizationBusinessLineRecord[],
    [businessLinesQuery.items],
  );

  const cooperativeOrganizationType = useMemo(() => {
    return (
      organizationTypes.find((item) => {
        const searchable = [item.code, item.name, item.type]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return (
          searchable.includes("cooperative") ||
          searchable.includes("hợp tác xã") ||
          searchable.includes("htx")
        );
      }) ?? organizationTypes[0] ?? null
    );
  }, [organizationTypes]);

  const createOrganization = useCreateOrganization({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã tạo hợp tác xã mới",
      });
      setLocation("/cooperative");
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateOrganization = useUpdateOrganization({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin hợp tác xã",
      });
      setLocation("/cooperative");
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadDocument = useUploadStorageFile({
    onError: (error) => {
      toast({
        title: "Không thể tải tài liệu",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState<CooperativeFormData>({
    type: "cooperative",
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
    address: "",
    image: "",
    description: "",
    contacts: [],
    branches: [],
    bankAccounts: [],
    documents: [],
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      queueMicrotask(() => {
        setFormData((prev) => ({ ...prev, ...initialData }));
      });
    }
  }, [initialData]);

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

  const [bankInputMethod, setBankInputMethod] = useState<
    "manual" | "excel" | "qr-image" | "qr-scan"
  >("manual");
  const [branchInputMethod, setBranchInputMethod] = useState<
    "create" | "excel"
  >("create");
  const [hasCamera, setHasCamera] = useState(false);
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [confirmBankSearchQuery, setConfirmBankSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState<Record<string, boolean>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const documentUploadSeqRef = useRef(0);

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
    } catch {
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
    } catch {
      toast({
        title: "Lỗi",
        description: "Không thể đọc file Excel. Vui lòng kiểm tra định dạng.",
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
        const bankInfo = vietQrBankData.find((b) => b.bin === parsed.bin);
        setNewBankAccount((prev) => ({
          ...prev,
          bin: parsed.bin || prev.bin,
          bankName: bankInfo ? bankInfo.name : prev.bankName,
          accountNumber: parsed.accountNumber || prev.accountNumber,
          accountHolder:
            (parsed.accountHolder || "").toUpperCase() || prev.accountHolder,
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
    } catch {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy mã QR trong ảnh này.",
        variant: "destructive",
      });
    }
  };

  const handleLiveScan = (result: Array<{ rawValue: string }> | null) => {
    if (!result || result.length === 0) return;
    const text = result[0].rawValue;
    const parsed = parseVietQR(text);

    if (parsed) {
      const bankInfo = vietQrBankData.find((b) => b.bin === parsed.bin);
      setNewBankAccount((prev) => ({
        ...prev,
        bin: parsed.bin || prev.bin,
        note: parsed.note || prev.note,
        bankName: bankInfo ? bankInfo.name : prev.bankName,
        accountNumber: parsed.accountNumber || prev.accountNumber,
        accountHolder:
          (parsed.accountHolder || "").toUpperCase() || prev.accountHolder,
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

  const processDocuments = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const requestSeq = ++documentUploadSeqRef.current;
    const previousDocuments = formData.documents;

    setFormData((prev) => ({
      ...prev,
      documents: [
        ...prev.documents,
        {
          name: file.name,
          type: file.type,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          url: previewUrl,
          fileName: file.name,
          fileUrl: previewUrl,
          mimeType: file.type,
          sizeBytes: file.size,
        },
      ],
    }));

    try {
      const uploaded = await uploadDocument.uploadStorageFile({
        file,
        folder: "organizations-documents",
      });

      if (documentUploadSeqRef.current !== requestSeq) {
        URL.revokeObjectURL(previewUrl);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        documents: [
          ...prev.documents.filter((doc) => doc.fileUrl !== previewUrl),
          {
            name: uploaded.fileName || file.name,
            type: uploaded.mimeType || file.type,
            size: `${(uploaded.sizeBytes / (1024 * 1024)).toFixed(2)} MB`,
            url: uploaded.fileUrl,
            fileName: uploaded.fileName || file.name,
            fileUrl: uploaded.fileUrl,
            mimeType: uploaded.mimeType || file.type,
            sizeBytes: uploaded.sizeBytes,
          },
        ],
      }));

      toast({
        title: "Đã tải lên",
        description: "Tài liệu đã được tải lên thành công.",
      });
    } catch {
      if (documentUploadSeqRef.current === requestSeq) {
        setFormData((prev) => ({
          ...prev,
          documents: previousDocuments,
        }));
      }
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      await processDocuments(e.target.files);
      e.target.value = "";
    }
  };

  const handleDocumentDrop = async (e: React.DragEvent) => {
    handleDrag("documents", e);
    if (e.dataTransfer.files) await processDocuments(e.dataTransfer.files);
  };

  const addContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      setFormData({
        ...formData,
        contacts: [...formData.contacts, newContact],
      });
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
        description: "Vui lòng nhập tên ngân hàng và số tài khoản",
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

  const handleComplete = () => {
    setShowConfirmDialog(true);
  };

  const submitForm = () => {
    if (workspaceId === null) {
      toast({
        title: "Thiếu workspace",
        description: "Vui lòng chọn workspace trước khi lưu hợp tác xã.",
        variant: "destructive",
      });
      return;
    }

    if (!cooperativeOrganizationType) {
      toast({
        title: "Thiếu loại hình tổ chức",
        description: "Không tìm thấy loại hình tổ chức cho hợp tác xã.",
        variant: "destructive",
      });
      return;
    }

    const payload: OrganizationCreateRequest = {
      code: formData.code,
      name: formData.name,
      brandName: formData.brandName,
      type: "cooperative" as const,
      organizationTypeId: cooperativeOrganizationType.id,
      businessLines: mapClassificationToBusinessLines(
        formData.classification,
        businessLineRecords,
      ),
      taxCode: formData.taxCode,
      address: formData.address,
      status: "active" as const,
      taxAddress: formData.taxAddress,
      taxAuthority: formData.taxAuthority,
      issueDate: formData.issueDate,
      foundedDate: formData.foundedDate,
      representative: formData.representative,
      website: formData.website,
      province: formData.province,
      district: formData.district,
      latitude: formData.latitude,
      longitude: formData.longitude,
      description: formData.description,
      imageUrl: formData.image,
      contacts: formData.contacts.map((contact, index) => ({
        contactId: contact.id,
        name: contact.name,
        position: "",
        phone: contact.phone,
        email: contact.email,
        isPrimary: index === 0,
      })),
      branches: formData.branches.map((branch) => ({
        id: branch.id,
        code: branch.taxCode || branch.name || undefined,
        name: branch.name,
        taxCode: branch.taxCode || "",
        taxAddress: branch.taxAddress || "",
        address: branch.address || "",
        city: "",
        ward: "",
        imageUrl: "",
        latitude: 0,
        longitude: 0,
        status: "active" as const,
        contacts: branch.phone || branch.email
          ? [
              {
                name: branch.name,
                position: "",
                phone: branch.phone,
                email: branch.email,
                isPrimary: true,
              },
            ]
          : [],
        bankAccounts: [],
        metadataJson: branch.note ? { note: branch.note } : null,
      })),
      bankAccounts: formData.bankAccounts.map((account, index) => {
        const bankInfo =
          (account.bankId
            ? bankMasterData.find(
                (bank) => String(bank.id) === String(account.bankId),
              )
            : undefined) ||
          findBankInfo(bankMasterData, account.bin || account.bankName);

        return {
          ...(initialData?.id && account.id ? { id: account.id } : {}),
          ownerType: formData.type,
          bankId: bankInfo?.id,
          bankCode: bankInfo?.code || account.bin || account.bankName,
          bankName: getBankDisplayName(bankInfo) || account.bankName,
          bin: account.bin || bankInfo?.bin || "",
          accountNumber: account.accountNumber,
          accountHolder: account.accountHolder,
          branch: account.branch,
          note: account.note,
          logoUrl: account.logo || bankInfo?.logoUrl || "",
          status: "active" as const,
          isPrimary: index === 0,
          metadataJson: null,
        };
      }),
      documents: formData.documents.map((doc, index) => ({
        id: index + 1,
        documentType: doc.type,
        name: doc.name,
        fileUrl: doc.fileUrl || doc.url || "",
        fileName: doc.fileName || doc.name,
        mimeType: doc.mimeType || doc.type,
        sizeBytes: doc.sizeBytes ?? normalizeDocumentSize(doc.size),
        content: undefined,
      })),
      metadataJson: null,
    };

    const mutation = initialData?.id
      ? updateOrganization.updateOrganization({
          id: Number(initialData.id),
          payload,
          workspaceId,
        })
      : createOrganization.createOrganization({
          payload,
          workspaceId,
        });

    mutation
      .then(() => {
        setShowConfirmDialog(false);
      })
      .catch(() => {
        // Error toast handled by mutation callbacks.
      });
  };

  return {
    formData,
    setFormData,
    newContact,
    setNewContact,
    newBranch,
    setNewBranch,
    newBankAccount,
    setNewBankAccount,
    bankInputMethod,
    setBankInputMethod,
    branchInputMethod,
    setBranchInputMethod,
    hasCamera,
    bankSearchQuery,
    setBankSearchQuery,
    confirmBankSearchQuery,
    setConfirmBankSearchQuery,
    isDragging,
    handleDrag,
    handleExcelUpload,
    handleExcelDrop,
    handleBranchExcelUpload,
    handleBranchExcelDrop,
    handleQRImageUpload,
    handleQRImageDrop,
    handleLiveScan,
    handleImageUpload,
    handleLogoDrop,
    handleDocumentUpload,
    handleDocumentDrop,
    handleDocumentDelete,
    addContact,
    removeContact,
    addBranch,
    removeBranch,
    addBankAccount,
    removeBankAccount,
    showConfirmDialog,
    setShowConfirmDialog,
    handleComplete,
    submitForm,
  };
}
