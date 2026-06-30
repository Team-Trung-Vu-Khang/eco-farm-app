import {
  Badge,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

import {
  useDeleteOrganization,
  useOrganizations,
  type OrganizationRecord,
} from "@/features/organization";
import { useMasterData } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";

type EnterpriseRow = OrganizationRecord & {
  businessLine: string;
  businessLineText: string;
  primaryPhone: string;
  primaryEmail: string;
  image: string;
};

const DEFAULT_PAGE_SIZE = 10;

type OrganizationStatusFilter = OrganizationRecord["status"] | "all";

const formatContactTooltip = (enterprise: OrganizationRecord) => {
  const contacts = enterprise.contacts?.length ? enterprise.contacts : [];

  return contacts
    .map((contact, index) => {
      const parts = [
        `${index + 1}. ${contact.name || "Liên hệ"}`,
        contact.phone ? `SĐT: ${contact.phone}` : null,
        contact.email ? `Email: ${contact.email}` : null,
      ].filter(Boolean);

      return parts.join(" | ");
    })
    .join("\n");
};

const toEnterpriseRow = (
  enterprise: OrganizationRecord,
  selectedBusinessLine: string,
): EnterpriseRow => {
  const primaryContact =
    enterprise.contacts?.find((contact) => contact.isPrimary) ??
    enterprise.contacts?.[0] ??
    null;

  const firstBusinessLine =
    enterprise.businessLines?.find((line) => line.code || line.name) ?? null;
  const businessLineValue =
    selectedBusinessLine !== "all"
      ? selectedBusinessLine
      : firstBusinessLine?.code || firstBusinessLine?.name || "-";

  return {
    ...enterprise,
    businessLine: businessLineValue,
    businessLineText:
      enterprise.businessLines
        ?.map((line) => line.code || line.name)
        .filter(Boolean)
        .join(", ") || "-",
    primaryPhone: primaryContact?.phone || "-",
    primaryEmail: primaryContact?.email || "-",
    image: enterprise.imageUrl || "",
  };
};

export function useEnterprisePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const workspaceId = useSelectedWorkspaceId();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrganizationStatusFilter>("all");
  const [businessLine, setBusinessLine] = useState<string>("all");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<EnterpriseRow | null>(null);

  const organizationsQuery = useOrganizations(
    {
      type: "enterprise",
      keyword: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      businessLine: businessLine === "all" ? undefined : businessLine,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
    workspaceId ?? "missing",
    {
      enabled: workspaceId !== null,
    },
  );

  const businessLinesQuery = useMasterData("business-lines", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });

  const deleteOrganization = useDeleteOrganization();

  const enterprises = useMemo(
    () =>
      (organizationsQuery.items ?? []).map((enterprise) =>
        toEnterpriseRow(enterprise, businessLine),
      ),
    [organizationsQuery.items, businessLine],
  );

  const businessLineOptions = useMemo(
    () =>
      businessLinesQuery.items.map((line) => ({
        value: String(line.code || line.id),
        label: line.name || line.code || String(line.id),
      })),
    [businessLinesQuery.items],
  );

  const columns: Column<EnterpriseRow>[] = [
    {
      key: "code",
      label: "Mã",
      render: (value) => (
        <Badge
          variant="outline"
          className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-700"
        >
          {value as string}
        </Badge>
      ),
    },
    {
      key: "image",
      label: "Hình ảnh",
      render: (value) =>
        value ? (
          <img
            src={value as string}
            alt="enterprise"
            className="h-10 w-10 rounded-md border object-cover"
          />
        ) : null,
    },
    { key: "name", label: "Tên đơn vị" },
    {
      key: "businessLineText",
      label: "Ngành nghề",
      render: (value) => (
        <div className="max-w-[240px] truncate" title={String(value || "-")}>
          {String(value || "-")}
        </div>
      ),
    },
    {
      key: "primaryPhone",
      label: "Điện thoại",
      render: (_value, row) => (
        <div
          className="max-w-[240px] space-y-1"
          title={formatContactTooltip(row)}
        >
          <div className="truncate font-medium">{row.primaryPhone || "-"}</div>
          {(row.contacts?.length ?? 0) > 1 && (
            <div className="text-xs text-muted-foreground">
              +{(row.contacts?.length ?? 0) - 1} liên hệ khác
            </div>
          )}
        </div>
      ),
    },
    {
      key: "primaryEmail",
      label: "Email",
      render: (_value, row) => (
        <div
          className="max-w-[240px] space-y-1"
          title={formatContactTooltip(row)}
        >
          <div className="truncate font-medium">{row.primaryEmail || "-"}</div>
          {(row.contacts?.length ?? 0) > 1 && (
            <div className="text-xs text-muted-foreground">
              +{(row.contacts?.length ?? 0) - 1} liên hệ khác
            </div>
          )}
        </div>
      ),
    },
    { key: "address", label: "Địa chỉ" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge
          variant={value === "active" ? "default" : "outline"}
          className="rounded-full px-2.5 py-1"
        >
          {value === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
  ];

  const filters = [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Không hoạt động", value: "inactive" },
        { label: "Đã lưu trữ", value: "archived" },
      ],
    },
    {
      key: "businessLine",
      label: "Ngành nghề",
      options: [...businessLineOptions],
    },
  ];

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value as OrganizationStatusFilter);
      setCurrentIndex(1);
    }

    if (key === "businessLine") {
      setBusinessLine(value);
      setCurrentIndex(1);
    }
  };

  const handleDelete = (item: EnterpriseRow) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) {
      setDeleteOpen(false);
      return;
    }

    if (workspaceId === null) {
      toast({
        title: "Thiếu workspace",
        description: "Vui lòng chọn workspace trước khi xóa doanh nghiệp.",
        variant: "destructive",
      });
      setDeleteOpen(false);
      return;
    }

    try {
      await deleteOrganization.deleteOrganization({
        id: deleteItem.id,
        workspaceId,
      });
      toast({
        title: "Thành công",
        description: "Đã xóa doanh nghiệp khỏi hệ thống",
      });
      setDeleteItem(null);
      setDeleteOpen(false);
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể xóa doanh nghiệp",
        variant: "destructive",
      });
    }
  };

  return {
    filterEnterprises: enterprises,
    columns,
    filters,
    search,
    pageSize,
    currentIndex,
    deleteOpen,
    setDeleteOpen,
    handleSearch,
    handleFilterChange,
    setPageSize: (value: number) => {
      setPageSize(value);
      setCurrentIndex(1);
    },
    setCurrentIndex,
    handleDelete,
    handleConfirmDelete,
    setLocation,
    loading: organizationsQuery.loading,
    error:
      workspaceId === null
        ? "Vui lòng chọn workspace"
        : organizationsQuery.error,
    totalPages: organizationsQuery.response?.totalPages ?? 0,
    totalElements: organizationsQuery.response?.totalElements ?? 0,
  };
}
