import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMasterData, useMasterDataMutations } from "@/features/master-data";
import { INITIAL_ORGANIZATION_DATA } from "../data/constants";
import {
  enterpriseFormSchema,
  type EnterpriseFormInput,
  type EnterpriseFormValues,
} from "../data/enterprise-form.schema";
import type { CategoryType, EnterpriseType } from "../types";
import type {
  BusinessLineCreateRequest,
  BusinessLineRecord,
  BusinessLineUpdateRequest,
} from "@/features/master-data/types/master-data.type";
import { useForm } from "react-hook-form";

type EnterpriseRow = EnterpriseType | BusinessLineRecord;

export function useEnterpriseForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CategoryType>("organization");
  const [businessSearchQuery, setBusinessSearchQuery] = useState("");
  const businessParams = useMemo(
    () => ({
      keyword: businessSearchQuery.trim() || undefined,
    }),
    [businessSearchQuery],
  );
  const businessQuery = useMasterData("business-lines", {
    enabled: activeTab === "business",
    params: businessParams,
  });
  const {
    createMasterData: createBusinessLine,
    updateMasterData: updateBusinessLine,
    deleteMasterData: deleteBusinessLine,
  } = useMasterDataMutations("business-lines");

  // State for data
  const [organizationData, setOrganizationData] = useState<EnterpriseType[]>(
    INITIAL_ORGANIZATION_DATA,
  );

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<EnterpriseRow | null>(null);
  const [deleteItem, setDeleteItem] = useState<EnterpriseRow | null>(null);

  const defaultFormValues = useMemo<EnterpriseFormInput>(
    () => ({
      code: "",
      name: "",
      description: "",
      status: "active",
      metadataJson: null,
    }),
    [],
  );

  const form = useForm<EnterpriseFormInput, unknown, EnterpriseFormValues>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(enterpriseFormSchema),
  });

  const {
    register,
    reset,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = form;

  const businessData = businessQuery.items;

  const handleAdd = () => {
    setEditItem(null);
    reset(defaultFormValues);
    setFormOpen(true);
  };

  const handleEdit = (item: EnterpriseRow) => {
    setEditItem(item);
    reset({
      code: item.code,
      name: item.name,
      description: item.description ?? "",
      status:
        item.status === "active" ||
        item.status === "inactive" ||
        item.status === "archived"
          ? item.status
          : "active",
      metadataJson: "metadataJson" in item ? (item.metadataJson ?? null) : null,
    } as EnterpriseFormInput);
    setFormOpen(true);
  };

  const handleDelete = (item: EnterpriseRow) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const submitForm = handleFormSubmit(async (values) => {
    const categoryName =
      activeTab === "organization" ? "loại hình tổ chức" : "lĩnh vực hoạt động";

    if (activeTab === "organization") {
      if (editItem) {
        setOrganizationData((prev) =>
          prev.map((item) =>
            item.id === editItem.id
              ? {
                  ...item,
                  code: values.code,
                  name: values.name,
                  description: values.description,
                  status: values.status,
                }
              : item,
          ),
        );
        toast({
          title: "Thành công",
          description: `Đã cập nhật ${categoryName}`,
        });
      } else {
        const newItem: EnterpriseType = {
          id: Date.now(),
          code: values.code,
          name: values.name,
          description: values.description,
          status: values.status === "archived" ? "inactive" : values.status,
          createdAt: new Date().toISOString().split("T")[0],
        };
        setOrganizationData((prev) => [...prev, newItem]);
        toast({
          title: "Thành công",
          description: `Đã thêm ${categoryName} mới`,
        });
      }
    } else if (editItem) {
      const businessPayload = {
        ...values,
        displayOrder: 1,
      };
      await updateBusinessLine.mutateAsync({
        id: editItem.id,
        data: businessPayload as BusinessLineUpdateRequest,
      });
      toast({
        title: "Thành công",
        description: `Đã cập nhật ${categoryName}`,
      });
    } else {
      const businessPayload = {
        ...values,
        displayOrder: 1,
      };
      await createBusinessLine.mutateAsync(
        businessPayload as BusinessLineCreateRequest,
      );
      toast({
        title: "Thành công",
        description: `Đã thêm ${categoryName} mới`,
      });
    }

    setFormOpen(false);
  });

  const handleConfirmDelete = async () => {
    const categoryName =
      activeTab === "organization" ? "loại hình tổ chức" : "lĩnh vực hoạt động";

    if (deleteItem) {
      if (activeTab === "organization") {
        setOrganizationData((prev) =>
          prev.filter((item) => item.id !== deleteItem.id),
        );
        toast({
          title: "Thành công",
          description: `Đã xóa ${categoryName}`,
        });
      } else {
        await deleteBusinessLine.mutateAsync(deleteItem.id);
        toast({
          title: "Thành công",
          description: `Đã xóa ${categoryName}`,
        });
      }
    }
    setDeleteOpen(false);
  };

  const getDialogTitles = () => {
    if (activeTab === "organization") {
      return {
        add: "Thêm loại hình tổ chức",
        edit: "Chỉnh sửa loại hình tổ chức",
        deleteConfirm: "Bạn có chắc chắn muốn xóa loại hình tổ chức này?",
      };
    }
    return {
      add: "Thêm lĩnh vực hoạt động",
      edit: "Chỉnh sửa lĩnh vực hoạt động",
      deleteConfirm: "Bạn có chắc chắn muốn xóa lĩnh vực hoạt động này?",
    };
  };

  return {
    activeTab,
    setActiveTab,
    organizationData,
    businessData,
    businessLoading: businessQuery.loading,
    businessSearchQuery,
    setBusinessSearchQuery,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    register,
    errors,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit: submitForm,
    handleConfirmDelete,
    getDialogTitles,
  };
}
