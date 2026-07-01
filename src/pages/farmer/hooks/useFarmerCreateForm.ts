import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import QrScanner from "qr-scanner";
import readXlsxFile from "read-excel-file";
import { useEffect, useMemo, useRef, useState, type SetStateAction } from "react";
import { useLocation, useRoute } from "wouter";

import { vietQrBankData } from "@/constants/banks";
import { useMasterData } from "@/features/master-data";
import {
  useCreateOrganization,
  useOrganizationById,
  useUpdateOrganization,
} from "@/features/organization";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { useUploadStorageFile } from "@/features/storage/hooks/useUploadStorageFile";
import { parseVietQR } from "@/utils/commons";
import type {
  OrganizationBusinessLineRecord,
  OrganizationCreateRequest,
  OrganizationRecord,
} from "@/features/organization";
import type { BankAccount, Contact, FarmerFormData } from "../types";

type BusinessLineRecord = {
  id: number | string;
  code: string;
  name: string;
};

type QrScanResult = Array<{ rawValue: string }>;

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

const defaultFarmerFormValues: FarmerFormData = {
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
};

const mapOrganizationToFarmerFormData = (
  data: OrganizationRecord,
): FarmerFormData => ({
  type: (data.type as FarmerFormData["type"]) || "farm",
  code: data.code || "",
  name: data.name || "",
  brandName: data.brandName || "",
  taxCode: data.taxCode || "",
  taxAddress: data.taxAddress || "",
  taxAuthority: data.taxAuthority || "",
  issueDate: data.issueDate || "",
  classification:
    data.businessLines?.map((line) => line.code || line.name).filter(Boolean) ?? [],
  foundedDate: data.foundedDate || "",
  representative: data.representative || "",
  website: data.website || "",
  phone: "",
  email: "",
  province: data.province || "",
  district: data.district || "",
  ward: data.ward || "",
  latitude: data.latitude,
  longitude: data.longitude,
  address: data.address || "",
  image: data.imageUrl || "",
  description: data.description || "",
  contacts:
    data.contacts?.map((contact) => ({
      name: contact.name || contact.fullName || "",
      phone: contact.phone || "",
      email: contact.email || "",
    })) ?? [],
  branches:
    data.branches?.map((branch) => ({
      name: branch.name || "",
      taxCode: branch.taxCode || "",
      phone: branch.contacts?.[0]?.phone || "",
      taxAddress: branch.taxAddress || "",
      email: branch.contacts?.[0]?.email || "",
      address: branch.address || "",
      note: branch.metadataJson?.note ? String(branch.metadataJson.note) : "",
    })) ?? [],
  bankAccounts:
    data.bankAccounts?.map((account) => ({
      bankName: account.bank?.name || account.bankName || "",
      accountHolder: account.accountHolder || "",
      accountNumber: account.accountNumber || "",
      branch: account.branch || "",
      note: account.note || "",
      bin: account.bin || account.bank?.bin || "",
      logo: account.logoUrl || account.bank?.logoUrl || "",
    })) ?? [],
  documents:
    data.documents?.map((doc) => ({
      name: doc.name || "",
      type: doc.mimeType || doc.documentType || "",
      size: doc.sizeBytes
        ? `${(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB`
        : "",
      url: doc.fileUrl || "",
      fileName: doc.fileName || "",
      fileUrl: doc.fileUrl || "",
      mimeType: doc.mimeType || "",
      sizeBytes: doc.sizeBytes,
      content: doc.content,
    })) ?? [],
});

const mapClassificationToBusinessLines = (
  classifications: string[],
  businessLineRecords: BusinessLineRecord[],
): OrganizationBusinessLineRecord[] =>
  classifications.map((classification: string) => {
    const mappedCode =
      CLASSIFICATION_TO_BUSINESS_LINE[classification] || classification;
    const mappedName = CLASSIFICATION_LABELS[classification] || classification;
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
  });

export function useFarmerCreateForm() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/farmer/:id/edit");
  const { toast } = useToast();
  const workspaceId = useSelectedWorkspaceId();

  const farmerId = params?.id ? Number(params.id) : null;
  const isEdit = farmerId !== null && Number.isFinite(farmerId);

  const organizationQuery = useOrganizationById(
    farmerId ?? "missing",
    workspaceId ?? "missing",
    {
      enabled: workspaceId !== null && isEdit,
    },
  );

  const createOrganization = useCreateOrganization({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã tạo nông hộ mới",
      });
      setLocation("/farmer");
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
        description: "Đã cập nhật thông tin nông hộ",
      });
      setLocation("/farmer");
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

  const uploadDocument = useUploadStorageFile({
    onError: (error) => {
      toast({
        title: "Không thể tải tài liệu",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const businessLinesQuery = useMasterData("business-lines", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });

  const organizationTypesQuery = useMasterData("organization-types", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });

  const businessLineRecords = useMemo(
    () => businessLinesQuery.items as BusinessLineRecord[],
    [businessLinesQuery.items],
  );

  const farmOrganizationType = useMemo(
    () =>
      organizationTypesQuery.items.find(
        (item) =>
          item.code?.toLowerCase() === "farm" ||
          item.type?.toLowerCase() === "farm" ||
          item.name?.toLowerCase().includes("farm"),
      ) ?? null,
    [organizationTypesQuery.items],
  );

  const logoUploadSeqRef = useRef(0);
  const documentUploadSeqRef = useRef(0);

  const [formData, setFormData] = useState<FarmerFormData>(
    defaultFarmerFormValues,
  );
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
    logo: "",
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
    if (!isEdit) return;

    const organizationData = organizationQuery.item;
    if (!organizationData) return;

    queueMicrotask(() => {
      setFormData(mapOrganizationToFarmerFormData(organizationData));
    });
  }, [isEdit, organizationQuery.item]);

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

  const updateField = (
    field: keyof FarmerFormData,
    value: SetStateAction<FarmerFormData[keyof FarmerFormData]>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        typeof value === "function"
          ? value(prev[field] as FarmerFormData[keyof FarmerFormData])
          : value,
    }));
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
              logo: bankInfo.logo,
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
          logo: parsed.bin
            ? vietQrBankData.find((bank) => bank.bin === parsed.bin)?.logo ||
              prev.logo
            : prev.logo,
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

  const handleLiveScan = (result: QrScanResult) => {
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
        logo: parsed.bin
          ? vietQrBankData.find((bank) => bank.bin === parsed.bin)?.logo ||
            prev.logo
          : prev.logo,
      }));
      toast({
        title: "Quét thành công",
        description: "Thông tin ngân hàng đã được trích xuất.",
      });
      setBankInputMethod("manual");
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

      if (logoUploadSeqRef.current !== requestSeq) {
        URL.revokeObjectURL(previewUrl);
        return;
      }

      setFormData((prev) => ({ ...prev, image: uploaded.fileUrl }));
      toast({
        title: "Thành công",
        description: "Đã tải lên logo doanh nghiệp",
      });
    } catch {
      // Error toast is handled by the mutation callback.
    } finally {
      URL.revokeObjectURL(previewUrl);
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
    const previousDocuments = formData.documents;
    const requestSeq = ++documentUploadSeqRef.current;

    setFormData((prev) => ({
      ...prev,
      documents: [
        {
          name: file.name,
          type: file.type,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
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
        logo: "",
      });
      setBankInputMethod("manual");
      toast({
        title: "Thành công",
        description: "Đã thêm tài khoản ngân hàng",
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

  const submitForm = async () => {
    if (workspaceId === null) {
      toast({
        title: "Thiếu workspace",
        description: "Vui lòng chọn workspace trước khi lưu nông hộ.",
        variant: "destructive",
      });
      return;
    }

    const organizationTypeId =
      organizationQuery.item?.organizationType?.id ?? farmOrganizationType?.id;

    if (organizationTypeId === undefined || organizationTypeId === null) {
      toast({
        title: "Thiếu loại hình tổ chức",
        description: "Không tìm thấy loại hình tổ chức cho nông hộ.",
        variant: "destructive",
      });
      return;
    }

    const businessLines = mapClassificationToBusinessLines(
      formData.classification,
      businessLineRecords,
    );

    const payload: OrganizationCreateRequest = {
      type: formData.type,
      organizationTypeId,
      code: formData.code.trim(),
      name: formData.name.trim(),
      brandName: formData.brandName?.trim(),
      taxCode: formData.taxCode.trim(),
      taxAuthority: formData.taxAuthority?.trim(),
      taxAddress: formData.taxAddress?.trim(),
      issueDate: formData.issueDate?.trim(),
      businessLines,
      representative: formData.representative?.trim(),
      foundedDate: formData.foundedDate?.trim(),
      website: formData.website?.trim(),
      province: formData.province?.trim(),
      district: formData.district?.trim(),
      ward: formData.ward?.trim(),
      address: formData.address.trim(),
      latitude: formData.latitude,
      longitude: formData.longitude,
      imageUrl: formData.image || "",
      description: formData.description || "",
      status: "active",
      contacts: formData.contacts.map((contact, index) => ({
        contactId: index + 1,
        name: contact.name,
        position: "",
        phone: contact.phone,
        email: contact.email,
        isPrimary: index === 0,
      })),
      branches: formData.branches.map((branch, index) => ({
        id: index + 1,
        code: branch.taxCode || branch.name || undefined,
        name: branch.name,
        taxCode: branch.taxCode || "",
        taxAddress: branch.taxAddress || "",
        address: branch.address || "",
        city: "",
        district: "",
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
      bankAccounts: formData.bankAccounts.map((account, index) => {
        const bankInfo = vietQrBankData.find(
          (bank) =>
            bank.bin === account.bin ||
            bank.name.toLowerCase() === account.bankName.toLowerCase() ||
            bank.shortName.toLowerCase() === account.bankName.toLowerCase(),
        );

        return {
          id: index + 1,
          ownerType: formData.type,
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
      documents: formData.documents.map((doc, index) => ({
        id: index + 1,
        documentType: doc.type,
        name: doc.name,
        fileUrl: doc.fileUrl || doc.url || "",
        fileName: doc.fileName || doc.name,
        mimeType: doc.mimeType || doc.type,
        sizeBytes: doc.sizeBytes ?? normalizeBytes(doc.size),
        content: doc.content,
      })),
      metadataJson: organizationQuery.item?.metadataJson ?? null,
    };

    try {
      if (isEdit && farmerId !== null) {
        await updateOrganization.updateOrganization({
          id: farmerId,
          payload,
          workspaceId,
        });
      } else {
        await createOrganization.createOrganization({
          payload,
          workspaceId,
        });
      }
      setShowConfirmDialog(false);
    } catch {
      // Error toast is handled by the mutation callbacks.
    }
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
    handleDocumentDelete,
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
