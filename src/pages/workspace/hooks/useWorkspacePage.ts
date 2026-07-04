import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCurrentUser } from "@/features/auth";
import { useMasterData } from "@/features/master-data";
import {
  useAdminWorkspaces,
  useCreateAdminWorkspace,
  useDeleteAdminWorkspace,
  useUpdateAdminWorkspace,
  type WorkspaceCreateRequest,
  type WorkspaceRecord,
} from "@/features/workspace";

const DEFAULT_PAGE_SIZE = 10;
const WORKSPACE_STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Không hoạt động" },
  { value: "archived", label: "Đã lưu trữ" },
] as const;

export function useWorkspacePage() {
  const { toast } = useToast();
  const { currentUser, loadingCurrentUser, error: currentUserError } =
    useCurrentUser();

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [status, setStatus] =
    useState<(typeof WORKSPACE_STATUS_OPTIONS)[number]["value"]>("all");
  const [organizationTypeId, setOrganizationTypeId] =
    useState<string>("all");
  const [businessLine, setBusinessLine] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<WorkspaceRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<WorkspaceRecord | null>(null);

  const organizationTypesQuery = useMasterData("organization-types", {
    params: { page: 0, size: 100 },
  });
  const businessLinesQuery = useMasterData("business-lines", {
    params: { page: 0, size: 100, status: "active" },
  });

  const queryParams = useMemo(
    () => ({
      keyword: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      organizationTypeId:
        organizationTypeId === "all" ? undefined : organizationTypeId,
      businessLine: businessLine === "all" ? undefined : businessLine,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    }),
    [search, status, organizationTypeId, businessLine, currentIndex, pageSize],
  );

  const workspacesQuery = useAdminWorkspaces({ params: queryParams });

  const createMutation = useCreateAdminWorkspace({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã tạo workspace mới.",
      });
      setFormOpen(false);
      setEditItem(null);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useUpdateAdminWorkspace({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã cập nhật workspace.",
      });
      setFormOpen(false);
      setEditItem(null);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useDeleteAdminWorkspace({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã xóa workspace.",
      });
      setDeleteOpen(false);
      setDeleteItem(null);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: WorkspaceRecord) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: WorkspaceRecord) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleFilterChange = (key: string, value: string) => {
    setCurrentIndex(1);

    if (key === "status") {
      setStatus(value as (typeof WORKSPACE_STATUS_OPTIONS)[number]["value"]);
      return;
    }

    if (key === "organizationTypeId") {
      setOrganizationTypeId(value);
      return;
    }

    if (key === "businessLine") {
      setBusinessLine(value);
    }
  };

  const handleSubmit = async (payload: WorkspaceCreateRequest) => {
    if (editItem) {
      await updateMutation.updateWorkspace({
        id: editItem.id,
        payload,
      });
      return;
    }

    await createMutation.createWorkspace(payload);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) {
      setDeleteOpen(false);
      return;
    }

    await deleteMutation.deleteWorkspace(deleteItem.id);
  };

  return {
    currentUser,
    loadingCurrentUser,
    currentUserError,
    workspaceItems: workspacesQuery.items,
    workspaceResponse: workspacesQuery.response,
    workspaceLoading: workspacesQuery.loading,
    workspaceError: workspacesQuery.error,
    filters: [
      {
        key: "status",
        label: "Trạng thái",
        options: [...WORKSPACE_STATUS_OPTIONS],
      },
      {
        key: "organizationTypeId",
        label: "Loại đơn vị",
        options: [
          { value: "all", label: "Tất cả loại đơn vị" },
          ...organizationTypesQuery.items.map((item) => ({
            value: String(item.id),
            label:
              [item.code, item.name].filter(Boolean).join(" - ") ||
              String(item.id),
          })),
        ],
      },
      {
        key: "businessLine",
        label: "Ngành nghề",
        options: [
          { value: "all", label: "Tất cả ngành nghề" },
          ...businessLinesQuery.items.map((item) => ({
            value: String(item.code || item.id),
            label:
              [item.code, item.name].filter(Boolean).join(" - ") ||
              String(item.id),
          })),
        ],
      },
    ],
    pageSize,
    currentIndex,
    setPageSize: (value: number) => {
      setPageSize(value);
      setCurrentIndex(1);
    },
    setCurrentIndex,
    search,
    setSearch: (value: string) => {
      setSearch(value);
      setCurrentIndex(1);
    },
    handleFilterChange,
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
    savingWorkspace:
      createMutation.isPending || updateMutation.isPending,
    deletingWorkspace: deleteMutation.isPending,
    totalPages: workspacesQuery.response?.totalPages ?? 0,
    totalElements: workspacesQuery.response?.totalElements ?? 0,
  };
}
