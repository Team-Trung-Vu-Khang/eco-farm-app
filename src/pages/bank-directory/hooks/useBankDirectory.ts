import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useBankDirectory as useBankDirectoryQuery } from "../../../features/bank-directory/hooks/useBankDirectory";
import { useCreateBankDirectory } from "../../../features/bank-directory/hooks/useCreateBankDirectory";
import { useDeleteBankDirectory } from "../../../features/bank-directory/hooks/useDeleteBankDirectory";
import { useUpdateBankDirectory } from "../../../features/bank-directory/hooks/useUpdateBankDirectory";
import { useUploadStorageFile } from "../../../features/storage/hooks/useUploadStorageFile";
import type {
  BankDirectoryCreateRequest,
  BankDirectoryItem,
  BankDirectoryStatus,
  BankDirectoryUpdateRequest,
} from "../../../features/bank-directory/types/bank-directory.type";
import { emptyBankFormData } from "../data/constants";
import type { Bank } from "../types/types";

const DEFAULT_STATUS: BankDirectoryCreateRequest["status"] = "active";
const ALL_STATUS = "all" as const;
const ALL_BOOL = "all" as const;

const normalizeText = (value?: string) => value?.trim() ?? "";

function mapDirectoryItemToBank(item: BankDirectoryItem): Bank {
  return {
    id: item.code,
    name: item.shortName,
    fullName: item.name,
    shortName: item.shortName,
    logo: item.logoUrl,
    bin: item.bin,
    swiftCode: item.swiftCode ?? "",
    status: item.status,
    transferSupported: item.transferSupported,
    lookupSupported: item.lookupSupported,
    displayOrder: item.displayOrder,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function buildCreatePayload(
  formData: Bank,
  displayOrder: number,
): BankDirectoryCreateRequest {
  const shortName = normalizeText(formData.shortName ?? formData.name);
  const status = formData.status ?? DEFAULT_STATUS;

  return {
    code: normalizeText(formData.id).toUpperCase(),
    bin: normalizeText(formData.bin),
    shortName,
    name: normalizeText(formData.fullName),
    logoUrl: formData.logo,
    swiftCode: normalizeText(formData.swiftCode).toUpperCase() || null,
    transferSupported: formData.transferSupported ?? true,
    lookupSupported: formData.lookupSupported ?? true,
    displayOrder: formData.displayOrder ?? displayOrder,
    status,
    metadataJson: {
      source: "manual",
    },
  };
}

function buildUpdatePayload(
  formData: Bank,
  currentItem: BankDirectoryItem,
): BankDirectoryUpdateRequest {
  const shortName = normalizeText(formData.shortName ?? formData.name);

  return {
    code: currentItem.code,
    bin: normalizeText(formData.bin),
    shortName,
    name: normalizeText(formData.fullName),
    logoUrl: formData.logo,
    swiftCode: normalizeText(formData.swiftCode).toUpperCase() || null,
    transferSupported:
      formData.transferSupported ?? currentItem.transferSupported,
    lookupSupported: formData.lookupSupported ?? currentItem.lookupSupported,
    displayOrder: formData.displayOrder ?? currentItem.displayOrder,
    status: formData.status ?? currentItem.status,
    metadataJson: {
      ...(currentItem.metadataJson ?? {}),
      source: "manual",
    },
  };
}

export function useBankDirectory() {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Bank | null>(null);
  const [deleteItem, setDeleteItem] = useState<Bank | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [formData, setFormData] = useState<Bank>(emptyBankFormData);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BankDirectoryStatus | typeof ALL_STATUS>(
    ALL_STATUS,
  );
  const [transferSupported, setTransferSupported] = useState<
    boolean | typeof ALL_BOOL
  >(ALL_BOOL);
  const [lookupSupported, setLookupSupported] = useState<
    boolean | typeof ALL_BOOL
  >(ALL_BOOL);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);

  const bankQuery = useBankDirectoryQuery({
    initialQuery: {
      keyword: search.trim() || undefined,
      status: status === ALL_STATUS ? undefined : status,
      transferSupported:
        transferSupported === ALL_BOOL ? undefined : transferSupported,
      lookupSupported: lookupSupported === ALL_BOOL ? undefined : lookupSupported,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });
  const { banks: directoryBanks, loading, error, response } = bankQuery;

  const createBank = useCreateBankDirectory({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã thêm ngân hàng mới",
      });
    },
    onError: (err) => {
      toast({
        title: "Không thể thêm",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const updateBank = useUpdateBankDirectory({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin ngân hàng",
      });
    },
    onError: (err) => {
      toast({
        title: "Không thể cập nhật",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const deleteBank = useDeleteBankDirectory({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã xóa ngân hàng",
      });
    },
    onError: (err) => {
      toast({
        title: "Không thể xóa",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const uploadLogo = useUploadStorageFile({
    onError: (err) => {
      toast({
        title: "Không thể tải logo",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const data = useMemo(
    () => directoryBanks.map(mapDirectoryItemToBank),
    [directoryBanks],
  );

  const handleAdd = () => {
    setEditItem(null);
    const nextDisplayOrder =
      directoryBanks.reduce(
        (max, item) => Math.max(max, item.displayOrder ?? 0),
        0,
      ) + 1;

    setFormData({
      ...emptyBankFormData,
      status: DEFAULT_STATUS,
      transferSupported: true,
      lookupSupported: true,
      displayOrder: nextDisplayOrder,
    });
    setLogoPreview("");
    setFormOpen(true);
  };

  const handleEdit = (item: Bank) => {
    const currentItem = directoryBanks.find((bank) => bank.code === item.id);

    setEditItem(item);

    if (currentItem) {
      setFormData({
        id: currentItem.code,
        name: currentItem.shortName,
        fullName: currentItem.name,
        shortName: currentItem.shortName,
        bin: currentItem.bin,
        swiftCode: currentItem.swiftCode ?? "",
        logo: currentItem.logoUrl,
        status: currentItem.status,
        transferSupported: currentItem.transferSupported,
        lookupSupported: currentItem.lookupSupported,
        displayOrder: currentItem.displayOrder,
      });
      setLogoPreview(currentItem.logoUrl);
    } else {
      setFormData({
        ...item,
        shortName: item.shortName ?? item.name,
      });
      setLogoPreview(item.logo);
    }

    setFormOpen(true);
  };

  const handleDelete = (item: Bank) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploaded = await uploadLogo.uploadStorageFile({
        file,
        folder: "bank-directory",
      });

      setLogoPreview(uploaded.fileUrl);
      e.target.value = "";
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview("");
  };

  const handleSubmit = async (submittedFormData: Bank) => {
    try {
      if (editItem) {
        const currentItem = directoryBanks.find(
          (bank) => bank.code === editItem.id,
        );
        if (!currentItem) {
          toast({
            title: "Không tìm thấy",
            description: "Ngân hàng này không còn tồn tại.",
            variant: "destructive",
          });
          return;
        }

        await updateBank.updateBankDirectory({
          id: currentItem.id,
          payload: buildUpdatePayload(submittedFormData, currentItem),
        });
      } else {
        const displayOrder =
          directoryBanks.reduce(
            (max, item) => Math.max(max, item.displayOrder ?? 0),
            0,
          ) + 1;

        await createBank.createBankDirectory(
          buildCreatePayload(submittedFormData, displayOrder),
        );
      }

      setFormOpen(false);
      setEditItem(null);
    } catch {
      // Toast is handled by the mutation callbacks.
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteItem) {
        const currentItem = directoryBanks.find(
          (bank) => bank.code === deleteItem.id,
        );
        if (currentItem) {
          await deleteBank.deleteBankDirectory(currentItem.id);
        }
      }

      setDeleteOpen(false);
      setDeleteItem(null);
    } catch {
      // Toast is handled by the mutation callbacks.
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus((value === ALL_STATUS ? ALL_STATUS : value) as
        | BankDirectoryStatus
        | typeof ALL_STATUS);
      setCurrentIndex(1);
      return;
    }

    if (key === "transferSupported") {
      setTransferSupported(
        value === ALL_BOOL ? ALL_BOOL : value === "true",
      );
      setCurrentIndex(1);
      return;
    }

    if (key === "lookupSupported") {
      setLookupSupported(value === ALL_BOOL ? ALL_BOOL : value === "true");
      setCurrentIndex(1);
    }
  };

  return {
    data,
    loading,
    error,
    response,
    search,
    status,
    transferSupported,
    lookupSupported,
    pageSize,
    currentIndex,
    formData,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    logoPreview,
    isUploadingLogo: uploadLogo.isPending,
    handleAdd,
    handleEdit,
    handleDelete,
    handleLogoUpload,
    handleRemoveLogo,
    handleSubmit,
    handleConfirmDelete,
    handleFilterChange,
    setSearch: (value: string) => {
      setSearch(value);
      setCurrentIndex(1);
    },
    setPageSize: (value: number) => {
      setPageSize(value);
      setCurrentIndex(1);
    },
    setCurrentIndex,
  };
}
