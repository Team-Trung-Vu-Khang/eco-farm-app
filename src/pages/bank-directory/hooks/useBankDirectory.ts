import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useBankDirectory as useBankDirectoryQuery } from "../../../features/bank-directory/hooks/useBankDirectory";
import { useCreateBankDirectory } from "../../../features/bank-directory/hooks/useCreateBankDirectory";
import { useDeleteBankDirectory } from "../../../features/bank-directory/hooks/useDeleteBankDirectory";
import { useUpdateBankDirectory } from "../../../features/bank-directory/hooks/useUpdateBankDirectory";
import type {
  BankDirectoryCreateRequest,
  BankDirectoryItem,
  BankDirectoryUpdateRequest,
} from "../../../features/bank-directory/types/bank-directory.type";
import { emptyBankFormData } from "../data/constants";
import type { Bank } from "../types/types";

const DEFAULT_STATUS: BankDirectoryCreateRequest["status"] = "active";

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
    transferSupported: formData.transferSupported ?? currentItem.transferSupported,
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
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);

  const bankQuery = useBankDirectoryQuery({
    initialQuery: {
      keyword: search.trim() || undefined,
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
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

  return {
    data,
    loading,
    error,
    response,
    search,
    pageSize,
    currentIndex,
    formData,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    logoPreview,
    handleAdd,
    handleEdit,
    handleDelete,
    handleLogoUpload,
    handleRemoveLogo,
    handleSubmit,
    handleConfirmDelete,
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
