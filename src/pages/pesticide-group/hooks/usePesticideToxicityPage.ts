import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMasterData, useMasterDataMutations } from "@/features/master-data";
import type {
  MasterDataStatus,
  PesticideToxicityClassRecord,
} from "@/features/master-data/types/master-data.type";
import type { PesticideToxicityFormValues } from "../data/pesticide-toxicity-form.schema";

const ALL_STATUS = "all" as const;
const DEFAULT_PAGE_SIZE = 10;

type PesticideToxicityStatusFilter = MasterDataStatus | typeof ALL_STATUS;

function buildPayload(values: PesticideToxicityFormValues) {
  return {
    code: values.code.trim().toUpperCase(),
    name: values.name.trim(),
    description: values.description.trim(),
    displayOrder: 1,
    status: values.status,
    metadataJson: {
      source: "manual",
    },
    whoGroup: values.whoGroup,
    bandColor: values.bandColor.trim(),
    ld50Threshold: values.ld50Threshold.trim(),
  };
}

export function usePesticideToxicityPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PesticideToxicityStatusFilter>(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PesticideToxicityClassRecord | null>(
    null,
  );
  const [deleteItem, setDeleteItem] =
    useState<PesticideToxicityClassRecord | null>(null);

  const query = useMasterData("pesticide-toxicity-classes", {
    params: {
      keyword: search.trim() || undefined,
      status: status === ALL_STATUS ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { createMasterData, updateMasterData, deleteMasterData } =
    useMasterDataMutations("pesticide-toxicity-classes");

  const data = useMemo(() => query.items, [query.items]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value === ALL_STATUS ? ALL_STATUS : (value as MasterDataStatus));
      setCurrentIndex(1);
    }
  };

  const handleAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: PesticideToxicityClassRecord) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: PesticideToxicityClassRecord) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async (values: PesticideToxicityFormValues) => {
    const payload = buildPayload(values);

    if (!payload.code || !payload.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập mã và tên phân loại.",
        variant: "destructive",
      });
      return;
    }

    if (!payload.whoGroup || !payload.bandColor || !payload.ld50Threshold) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đủ nhóm WHO, màu băng và ngưỡng LD50.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editItem) {
        await updateMasterData.mutateAsync({
          id: editItem.id,
          data: payload,
        });
      } else {
        await createMasterData.mutateAsync(payload);
      }

      toast({
        title: "Thành công",
        description: editItem
          ? "Đã cập nhật phân loại độ độc tính."
          : "Đã thêm phân loại độ độc tính mới.",
      });
      setFormOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";

      toast({
        title: editItem ? "Không thể cập nhật" : "Không thể thêm",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) {
      setDeleteOpen(false);
      return;
    }

    try {
      await deleteMasterData.mutateAsync(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa phân loại độ độc tính.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";

      toast({
        title: "Không thể xóa",
        description: message,
        variant: "destructive",
      });
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    data,
    loading: query.loading,
    error: query.error,
    response: query.response,
    search,
    status,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    deleteItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    handleSearch,
    handleFilterChange,
  };
}
