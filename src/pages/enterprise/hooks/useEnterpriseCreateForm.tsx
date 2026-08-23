import { zodResolver } from "@hookform/resolvers/zod";
import { useToast, type Step } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import QrScanner from "qr-scanner";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type SetStateAction,
} from "react";
import { useForm } from "react-hook-form";
import readXlsxFile from "read-excel-file";
import { useLocation } from "wouter";

import { useMasterData, type MasterDataRecord } from "@/features/master-data";
import { useCreateOrganization } from "@/features/organization";
import { useUploadStorageFile } from "@/features/storage/hooks/useUploadStorageFile";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { EnterpriseBankAccountsStep } from "../components/steps/EnterpriseBankAccountsStep";
import { EnterpriseBasicInfoStep } from "../components/steps/EnterpriseBasicInfoStep";
import { EnterpriseBranchesStep } from "../components/steps/EnterpriseBranchesStep";
import { EnterpriseConfirmationStep } from "../components/steps/EnterpriseConfirmationStep";
import { EnterpriseContactsStep } from "../components/steps/EnterpriseContactsStep";
import { EnterpriseDocumentsStep } from "../components/steps/EnterpriseDocumentsStep";

import { parseVietQR } from "@/utils/commons";
import type { BankAccount, Branch, Contact } from "../data/constants";
import {
  defaultEnterpriseFormValues,
  EMAIL_REGEX,
  enterpriseFormSchema,
  PHONE_REGEX,
  simpleEnterpriseFormSchema,
  type EnterpriseFormInput,
  type EnterpriseFormValues,
} from "../data/enterprise-form.schema";
import type { EnterpriseFormData } from "../types";

type BusinessLineRecord = {
  id: number | string;
  code: string;
  name: string;
};

type BankMasterDataRecord = MasterDataRecord<"banks"> & {
  shortName?: string;
  logoUrl?: string;
  bin?: string;
};

const normalizeBytes = (size?: string) => {
  if (!size) return undefined;
  const numeric = Number.parseFloat(
    size.replace(/[^0-9.,]/g, "").replace(",", "."),
  );
  if (!Number.isFinite(numeric)) return undefined;
  const unit = size.toLowerCase();
  if (unit.includes("kb")) return Math.round(numeric * 1024);
  if (unit.includes("mb")) return Math.round(numeric * 1024 * 1024);
  if (unit.includes("gb")) return Math.round(numeric * 1024 * 1024 * 1024);
  return Math.round(numeric);
};

const getBankDisplayName = (bank?: BankMasterDataRecord | null) =>
  bank?.shortName || bank?.name || "";

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
  const banksQuery = useMasterData("banks", {
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

  const uploadDocument = useUploadStorageFile({
    onError: (error) => {
      toast({
        title: "Không thể tải tài liệu",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const businessLineRecords = useMemo(
    () => businessLinesQuery.items as BusinessLineRecord[],
    [businessLinesQuery.items],
  );
  const bankMasterData = useMemo(
    () => banksQuery.items as BankMasterDataRecord[],
    [banksQuery.items],
  );
  const logoUploadSeqRef = useRef(0);
  const documentUploadSeqRef = useRef(0);

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
    bankId: "",
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    branch: "",
    note: "",
    bin: "",
  });
  const [newContact, setNewContact] = useState<Contact>({
    id: "",
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

  const findBankInfo = (value: string) => {
    const query = value.toLowerCase().trim();
    if (!query) return undefined;

    return bankMasterData.find((bank) => {
      const searchable = [
        bank.code,
        bank.bin,
        bank.name,
        getBankDisplayName(bank),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  };

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
          const bankInfo = findBankInfo(binOrName);

          if (bankInfo) {
            newAccounts.push({
              bankId: bankInfo.id,
              bin: bankInfo.bin || "",
              bankName: getBankDisplayName(bankInfo),
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
        const bankInfo = findBankInfo(parsed.bin || parsed.bankName || "");

        setNewBankAccount((prev) => ({
          ...prev,
          bankId: bankInfo?.id ?? prev.bankId,
          bin: parsed.bin || prev.bin,
          bankName: parsed.bankName || getBankDisplayName(bankInfo) || prev.bankName,
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
      const bankInfo = findBankInfo(parsed.bin || parsed.bankName || "");

      setNewBankAccount((prev) => ({
        ...prev,
        bankId: bankInfo?.id ?? prev.bankId,
        bin: parsed.bin || prev.bin,
        note: parsed.note || prev.note,
        bankName: parsed.bankName || getBankDisplayName(bankInfo) || prev.bankName,
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

  const processDocuments = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    const previousDocuments = getValues(
      "documents",
    ) as EnterpriseFormData["documents"];
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
    if (e.dataTransfer.files) {
      await processDocuments(e.dataTransfer.files);
    }
  };

  const addBankAccount = () => {
    if (newBankAccount.bankName && newBankAccount.accountNumber) {
      setFormData((prev) => ({
        ...prev,
        bankAccounts: [newBankAccount, ...(prev.bankAccounts ?? [])],
      }));
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
      bankAccounts: (prev.bankAccounts ?? []).filter((_, i) => i !== index),
    }));
  };

  const addContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên và số điện thoại liên hệ",
        variant: "destructive",
      });
      return;
    }

    if (!PHONE_REGEX.test(newContact.phone.trim())) {
      toast({
        title: "Lỗi",
        description: "Số điện thoại không hợp lệ",
        variant: "destructive",
      });
      return;
    }

    if (newContact.email.trim() && !EMAIL_REGEX.test(newContact.email.trim())) {
      toast({
        title: "Lỗi",
        description: "Email không hợp lệ",
        variant: "destructive",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      contacts: [...(prev.contacts ?? []), newContact],
    }));
    setNewContact({
      id: "",
      name: "",
      phone: "",
      email: "",
    });
  };

  const removeContact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contacts: (prev.contacts ?? []).filter((_, i) => i !== index),
    }));
  };

  const addBranch = () => {
    if (!newBranch.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên chi nhánh không được để trống",
        variant: "destructive",
      });
      return;
    }

    if (newBranch.phone.trim() && !PHONE_REGEX.test(newBranch.phone.trim())) {
      toast({
        title: "Lỗi",
        description: "Số điện thoại chi nhánh không hợp lệ",
        variant: "destructive",
      });
      return;
    }

    if (newBranch.email.trim() && !EMAIL_REGEX.test(newBranch.email.trim())) {
      toast({
        title: "Lỗi",
        description: "Email chi nhánh không hợp lệ",
        variant: "destructive",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      branches: [...(prev.branches ?? []), newBranch],
    }));
    setNewBranch({
      name: "",
      taxCode: "",
      phone: "",
      taxAddress: "",
      email: "",
      address: "",
      note: "",
    });
  };

  const removeBranch = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      branches: (prev.branches ?? []).filter((_, i) => i !== index),
    }));
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isAdvancedInfo, setIsAdvancedInfo] = useState(true);

  const handleComplete = () => {
    setShowConfirmDialog(true);
  };

  const findFirstFormError = (
    node: unknown,
    path: string[] = [],
  ): { path: string; message: string } | null => {
    if (!node || typeof node !== "object") return null;

    const current = node as { message?: unknown; [key: string]: unknown };
    if (typeof current.message === "string" && current.message.trim()) {
      return {
        path: path.join("."),
        message: current.message,
      };
    }

    for (const [key, value] of Object.entries(current)) {
      if (key === "message" || key === "type" || key === "ref") continue;
      const found = findFirstFormError(value, [...path, key]);
      if (found) return found;
    }

    return null;
  };

  const submitForm = handleSubmit(
    async (values: EnterpriseFormValues) => {
      if (!isAdvancedInfo) {
        const simpleResult = simpleEnterpriseFormSchema.safeParse(values);
        if (!simpleResult.success) {
          toast({
            title: "Dữ liệu chưa hợp lệ",
            description: simpleResult.error.issues[0]?.message ?? "Vui lòng kiểm tra lại thông tin.",
            variant: "destructive",
          });
          return;
        }
      }

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
          const record = businessLineRecords.find(
            (item) => item.code === classification || item.name === classification,
          );

          return (
            record || {
              id: classification,
              code: classification,
              name: classification,
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
          contactId: contact.id || undefined,
          name: contact.name,
          position: "",
          phone: contact.phone,
          email: contact.email,
          isPrimary: index === 0,
        })),
        branches: values.branches.map((branch) => ({
          id: branch.id ?? undefined,
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
          contacts:
            branch.phone || branch.email
              ? [
                  {
                    contactId: branch.contactId ?? undefined,
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
          const bankInfo = account.bankId
            ? bankMasterData.find((bank) => bank.id === Number(account.bankId))
            : findBankInfo(account.bin || account.bankName || "");

          return {
            ownerType: values.type,
            bankId: account.bankId
              ? Number(account.bankId)
              : bankInfo?.id ?? undefined,
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
        documents: values.documents.map((doc) => ({
          documentType: doc.type,
          name: doc.name,
          fileUrl: doc.fileUrl || doc.url || "",
          fileName: doc.fileName || doc.name,
          mimeType: doc.mimeType || doc.type,
          sizeBytes: doc.sizeBytes ?? normalizeBytes(doc.size),
          content: doc.content ?? undefined,
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
    },
    (errors) => {
      const firstError = findFirstFormError(errors);
      toast({
        title: "Dữ liệu chưa hợp lệ",
        description: firstError
          ? `${firstError.path || "form"}: ${firstError.message}`
          : "Vui lòng kiểm tra lại các trường bắt buộc.",
        variant: "destructive",
      });
    },
  );

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
    isSubmitting: createOrganization.isPending,
    formData,
    setLocation,
    handleComplete,
    isAdvancedInfo,
    setIsAdvancedInfo,
  };
}
