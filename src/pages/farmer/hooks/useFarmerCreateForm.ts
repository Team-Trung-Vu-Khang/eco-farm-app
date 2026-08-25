import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import QrScanner from "qr-scanner";
import readXlsxFile from "read-excel-file";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type SetStateAction,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
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
import { getDefaultOrganizationImage } from "../../enterprise/data/default-organization-images";
import {
  defaultFarmerFormValues,
  farmerFormSchema,
  type FarmerFormInput,
  type FarmerFormValues,
} from "../data/farmer-form.schema";
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

type BankMasterDataRecord = {
  id: number | string;
  code: string;
  name: string;
  shortName?: string;
  bin?: string;
  logoUrl?: string;
};

type QrScanResult = Array<{ rawValue: string }>;

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

const getBankDisplayName = (bank?: BankMasterDataRecord | null) =>
  bank?.shortName || bank?.name || "";

const findBankDirectoryItem = (
  bankMasterData: BankMasterDataRecord[],
  value: string,
) => {
  const query = value.toLowerCase().trim();
  if (!query) return undefined;

  return bankMasterData.find((bank) => {
    const searchable = [bank.code, bank.bin, bank.shortName, bank.name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);
  });
};

const getFirstValidationMessage = (
  errors: FieldErrors<FarmerFormInput>,
): string | undefined => {
  const stack: Array<unknown> = [errors];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;

    for (const value of Object.values(current as Record<string, unknown>)) {
      if (!value) continue;

      if (
        typeof value === "object" &&
        "message" in value &&
        typeof (value as { message?: unknown }).message === "string" &&
        (value as { message?: string }).message
      ) {
        return (value as { message: string }).message;
      }

      if (typeof value === "object") {
        stack.push(value);
      }
    }
  }

  return undefined;
};

const mapOrganizationToFarmerFormData = (
  data: OrganizationRecord,
): FarmerFormInput => {
  const primaryContact =
    data.contacts?.find((contact) => contact.isPrimary) ?? data.contacts?.[0];

  return {
  type: (data.type as FarmerFormInput["type"]) || "farm",
  code: data.code || "",
  name: data.name || "",
  aliasName: data.aliasName || "",
  brandName: data.brandName || "",
  taxCode: data.taxCode || "",
  taxAddress: data.taxAddress || "",
  taxAuthority: data.taxAuthority || "",
  issueDate: data.issueDate || "",
  classification:
    data.businessLines?.map((line) => String(line.id)) ?? [],
  foundedDate: data.foundedDate || "",
  representative: data.representative || "",
  website: data.website || "",
  phone: primaryContact?.phone || "",
  email: primaryContact?.email || "",
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
      id: contact.id,
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
      id: account.id,
      bankId: account.bank?.id || "",
      bankName: account.bank?.name || "",
      accountHolder: account.accountHolder || "",
      accountNumber: account.accountNumber || "",
      branch: account.branch || "",
      note: account.note || "",
      bin: account.bank?.bin || "",
      logo: account.bank?.logoUrl || "",
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
  };
};

const mapClassificationToBusinessLines = (
  classifications: string[],
  businessLineRecords: BusinessLineRecord[],
): OrganizationBusinessLineRecord[] =>
  classifications.flatMap((businessLineId: string) => {
    const record = businessLineRecords.find(
      (item) => String(item.id) === businessLineId,
    );

    return record
      ? [{ id: record.id, code: record.code, name: record.name }]
      : [];
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
  const banksQuery = useMasterData("banks", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });
  const bankMasterData = useMemo(
    () => banksQuery.items as BankMasterDataRecord[],
    [banksQuery.items],
  );

  const farmOrganizationType = useMemo(() => {
    const items = organizationTypesQuery.items;

    return (
      items.find((item) => {
        const searchable = [
          item.code,
          item.name,
          item.type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return (
          searchable.includes("farm") ||
          searchable.includes("nông hộ") ||
          searchable.includes("farmer")
        );
      }) ?? items[0] ?? null
    );
  }, [organizationTypesQuery.items]);

  const logoUploadSeqRef = useRef(0);
  const documentUploadSeqRef = useRef(0);

  const form = useForm<FarmerFormInput, unknown, FarmerFormValues>({
    defaultValues: defaultFarmerFormValues,
    resolver: zodResolver(farmerFormSchema),
    mode: "onSubmit",
  });
  const {
    getValues,
    setValue,
    trigger,
    control,
    formState: { errors },
    reset,
  } = form;
  const formData = useWatch({ control }) as FarmerFormData;
  const [newContact, setNewContact] = useState<Contact>({
    id: "",
    name: "",
    phone: "",
    email: "",
  });
  const [newBankAccount, setNewBankAccount] = useState<BankAccount>({
    bankId: "",
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
  const [isDragging, setIsDragging] = useState<Record<string, boolean>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const isSubmitting =
    createOrganization.isPending || updateOrganization.isPending;

  useEffect(() => {
    if (!isEdit) return;

    const organizationData = organizationQuery.item;
    if (!organizationData) return;

    queueMicrotask(() => {
      reset(mapOrganizationToFarmerFormData(organizationData));
    });
  }, [isEdit, organizationQuery.item, reset]);

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
    const currentValue = getValues(
      field as keyof FarmerFormInput,
    ) as FarmerFormData[keyof FarmerFormData];
    const nextValue =
      typeof value === "function" ? value(currentValue) : value;

    setValue(field as keyof FarmerFormInput, nextValue as never, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const setFormData = (updater: SetStateAction<FarmerFormData>) => {
    const nextValue =
      typeof updater === "function"
        ? updater(getValues() as FarmerFormData)
        : updater;

    Object.entries(nextValue).forEach(([key, value]) => {
      setValue(key as keyof FarmerFormInput, value as never, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    });
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
              bankId: bankInfo.id,
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
        setValue("bankAccounts", [...newAccounts, ...formData.bankAccounts], {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
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
        const bankInfo = findBankDirectoryItem(
          bankMasterData,
          parsed.bin || parsed.bankName || "",
        );

        setNewBankAccount((prev) => ({
          ...prev,
          bankId: bankInfo?.id ?? prev.bankId ?? "",
          bin: parsed.bin || prev.bin,
          bankName: parsed.bankName || prev.bankName,
          accountNumber: parsed.accountNumber || prev.accountNumber,
          accountHolder: parsed.accountHolder || prev.accountHolder,
          note: parsed.note || prev.note,
          logo: parsed.bin
            ? bankInfo?.logoUrl ||
              vietQrBankData.find((bank) => bank.bin === parsed.bin)?.logo ||
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

  const handleLiveScan = (result: QrScanResult | null) => {
    if (!result || result.length === 0) return;
    const text = result[0].rawValue;
    const parsed = parseVietQR(text);

    if (parsed) {
      const bankInfo = findBankDirectoryItem(
        bankMasterData,
        parsed.bin || parsed.bankName || "",
      );

      setNewBankAccount((prev) => ({
        ...prev,
        bankId: bankInfo?.id ?? prev.bankId ?? "",
        bin: parsed.bin || prev.bin,
        note: parsed.note || prev.note,
        bankName: parsed.bankName || prev.bankName,
        accountNumber: parsed.accountNumber || prev.accountNumber,
        accountHolder: parsed.accountHolder || prev.accountHolder,
        logo: parsed.bin
          ? bankInfo?.logoUrl ||
            vietQrBankData.find((bank) => bank.bin === parsed.bin)?.logo ||
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
    setValue("image", previewUrl, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

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

      setValue("image", uploaded.fileUrl, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
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
    setValue(
      "documents",
      formData.documents.filter((_, i) => i !== index),
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  };

  const processDocuments = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const previousDocuments = formData.documents;
    const requestSeq = ++documentUploadSeqRef.current;

    setValue(
      "documents",
      [
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
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );

    try {
      const uploaded = await uploadDocument.uploadStorageFile({
        file,
        folder: "organizations-documents",
      });

      if (documentUploadSeqRef.current !== requestSeq) {
        URL.revokeObjectURL(previewUrl);
        return;
      }

      setValue(
        "documents",
        [
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
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        },
      );
      toast({
        title: "Đã tải lên",
        description: "Tài liệu đã được tải lên thành công.",
      });
    } catch {
      if (documentUploadSeqRef.current === requestSeq) {
        setValue("documents", previousDocuments, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
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
      setValue("bankAccounts", [newBankAccount, ...formData.bankAccounts], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setNewBankAccount({
        bankId: "",
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
    setValue(
      "bankAccounts",
      formData.bankAccounts.filter((_, i) => i !== index),
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  };

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setValue("contacts", [...formData.contacts, newContact], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setNewContact({ id: "", name: "", phone: "", email: "" });
    } else {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên và số điện thoại",
        variant: "destructive",
      });
    }
  };

  const removeContact = (index: number) => {
    setValue(
      "contacts",
      formData.contacts.filter((_, i) => i !== index),
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
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

    const values = getValues() as unknown as FarmerFormValues;
    const businessLines = mapClassificationToBusinessLines(
      values.classification,
      businessLineRecords,
    );

    if (businessLines.length !== values.classification.length) {
      toast({
        title: "Không thể xác định phân loại",
        description:
          "Không tìm thấy ID phân loại từ dữ liệu danh mục. Vui lòng tải lại trang và thử lại.",
        variant: "destructive",
      });
      return;
    }

    const contacts = [...values.contacts];
    if (values.phone.trim() || values.email.trim()) {
      if (contacts[0]) {
        contacts[0] = {
          ...contacts[0],
          phone: values.phone.trim(),
          email: values.email.trim(),
        };
      } else {
        contacts.push({
          id: "",
          name: values.representative?.trim() || values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
        });
      }
    }

    const payload: OrganizationCreateRequest = {
      type: values.type,
      organizationTypeId,
      code: values.code?.trim() || "",
      name: values.name.trim(),
      aliasName: values.aliasName?.trim(),
      brandName: values.brandName?.trim(),
      taxCode: values.taxCode.trim(),
      taxAuthority: values.taxAuthority?.trim(),
      taxAddress: values.taxAddress?.trim(),
      issueDate: values.issueDate?.trim(),
      businessLines,
      representative: values.representative?.trim(),
      foundedDate: values.foundedDate?.trim(),
      province: values.province?.trim(),
      ward: values.ward?.trim(),
      address: values.address.trim(),
      latitude: values.latitude,
      longitude: values.longitude,
      imageUrl: values.image || getDefaultOrganizationImage("farm"),
      description: values.description || "",
      status: "active",
      contacts: contacts.map((contact, index) => ({
        contactId: contact.id,
        name: contact.name,
        position: "",
        phone: contact.phone,
        email: contact.email,
        isPrimary: index === 0,
      })),
      branches: values.branches.map((branch, index) => ({
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
      bankAccounts: values.bankAccounts.map((account, index) => {
        const bankInfo =
          (account.bankId
            ? bankMasterData.find((bank) => bank.id === Number(account.bankId))
            : undefined) ||
          findBankDirectoryItem(bankMasterData, account.bin || account.bankName);

        return {
          ...(isEdit && account.id ? { id: account.id } : {}),
          ownerType: values.type,
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

  const openConfirmDialog = async () => {
    const isValid = await trigger(undefined, { shouldFocus: true });

    if (!isValid) {
      toast({
        title: "Vui lòng kiểm tra lại",
        description:
          getFirstValidationMessage(errors) ||
          "Vẫn còn một số trường bắt buộc chưa hợp lệ.",
        variant: "destructive",
      });
      return false;
    }

    setShowConfirmDialog(true);
    return true;
  };

  return {
    isEdit,
    formData,
    control,
    errors,
    isSubmitting,
    setFormData,
    updateField,
    trigger,
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
    openConfirmDialog,
    showConfirmDialog,
    setShowConfirmDialog,
    navigateBack: () => setLocation("/farmer"),
  };
}
