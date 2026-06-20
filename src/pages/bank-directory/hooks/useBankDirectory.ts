import { useState, useEffect } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { emptyBankFormData } from "../data/constants";
import type { Bank } from "../types/types";

const VIETQR_API = "https://api.vietqr.io/v2/banks";

interface VietQRBank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
  swift_code: string | null;
}

function mapVietQRToBank(b: VietQRBank): Bank {
  return {
    id: b.code,
    name: b.shortName,
    fullName: b.name,
    shortName: b.shortName,
    logo: b.logo,
    bin: b.bin,
    address: "",
    swiftCode: b.swift_code ?? "",
    bicCode: b.swift_code ?? "",
    routingCode: "",
  };
}

export function useBankDirectory() {
  const { toast } = useToast();
  const [data, setData] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Bank | null>(null);
  const [deleteItem, setDeleteItem] = useState<Bank | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [formData, setFormData] = useState<Bank>(emptyBankFormData);

  useEffect(() => {
    setLoading(true);
    fetch(VIETQR_API)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách ngân hàng.");
        return res.json() as Promise<{ code: string; data: VietQRBank[] }>;
      })
      .then(({ data: banks }) => {
        setData(banks.map(mapVietQRToBank));
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyBankFormData);
    setLogoPreview("");
    setFormOpen(true);
  };

  const handleEdit = (item: Bank) => {
    setEditItem(item);
    setFormData({ ...item });
    setLogoPreview(item.logo);
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
        setFormData((prev) => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview("");
    setFormData((prev) => ({ ...prev, logo: "" }));
  };

  const handleSubmit = () => {
    if (editItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, ...formData } : item,
        ),
      );
      toast({ title: "Thành công", description: "Đã cập nhật thông tin ngân hàng" });
    } else {
      const newItem: Bank = {
        ...formData,
        id: formData.id || String(Date.now()),
      };
      setData((prev) => [...prev, newItem]);
      toast({ title: "Thành công", description: "Đã thêm ngân hàng mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa ngân hàng" });
    }
    setDeleteOpen(false);
  };

  return {
    data,
    loading,
    error,
    formData,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    logoPreview,
    updateFormData: (updates: Partial<Bank>) =>
      setFormData((prev) => ({ ...prev, ...updates })),
    handleAdd,
    handleEdit,
    handleDelete,
    handleLogoUpload,
    handleRemoveLogo,
    handleSubmit,
    handleConfirmDelete,
  };
}
