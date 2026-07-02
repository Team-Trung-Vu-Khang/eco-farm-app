import { Badge, useToast, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

import {
  useDeleteOrganization,
  useOrganizations,
  type OrganizationRecord,
} from "@/features/organization";
import { useMasterData } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type { FarmerFormData } from "../types";

type FarmerRow = FarmerFormData & {
  id: number;
  status: OrganizationRecord["status"];
  createdAt: string;
  primaryPhone: string;
  primaryEmail: string;
  businessLine: string;
  businessLineText: string;
  image: string;
};

const DEFAULT_PAGE_SIZE = 10;

type OrganizationStatusFilter = OrganizationRecord["status"] | "all";

const formatContactTooltip = (farmer: FarmerRow) => {
  const contacts = farmer.contacts?.length ? farmer.contacts : [];

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

const toFarmerRow = (
  farmer: OrganizationRecord,
  selectedBusinessLine: string,
): FarmerRow => {
  const primaryContact =
    farmer.contacts?.find((contact) => contact.isPrimary) ??
    farmer.contacts?.[0] ??
    null;

  const firstBusinessLine = farmer.businessLines?.[0] ?? null;
  const businessLineValue =
    selectedBusinessLine !== "all"
      ? selectedBusinessLine
      : firstBusinessLine?.code || firstBusinessLine?.name || "-";
  const classification =
    farmer.businessLines
      ?.map((line) => line.code || line.name)
      .filter((item): item is string => Boolean(item)) ?? [];

  return {
    id: Number(farmer.id),
    code: farmer.code,
    name: farmer.name,
    image: farmer.imageUrl || "",
    type:
      farmer.type === "enterprise" ||
      farmer.type === "cooperative" ||
      farmer.type === "farm"
        ? farmer.type
        : "farm",
    classification,
    taxCode: farmer.taxCode,
    address: farmer.address,
    phone: primaryContact?.phone || "",
    email: primaryContact?.email || "",
    status:
      farmer.status === "inactive" ||
      farmer.status === "archived" ||
      farmer.status === "active"
        ? farmer.status
        : "active",
    createdAt: farmer.createdAt,
    brandName: farmer.brandName,
    representative: farmer.representative,
    foundedDate: farmer.foundedDate,
    website: farmer.website,
    province: farmer.province,
    district: farmer.district,
    ward: farmer.ward,
    latitude: farmer.latitude,
    longitude: farmer.longitude,
    taxAddress: farmer.taxAddress,
    taxAuthority: farmer.taxAuthority,
    issueDate: farmer.issueDate,
    description: farmer.description,
    contacts:
      farmer.contacts?.map((contact) => ({
        name: contact.name || contact.fullName || "",
        phone: contact.phone || "",
        email: contact.email || "",
      })) ?? [],
    branches:
      farmer.branches?.map((branch) => ({
        name: branch.name || "",
        taxCode: branch.taxCode || "",
        phone: branch.contacts?.[0]?.phone || "",
        taxAddress: branch.taxAddress || "",
        email: branch.contacts?.[0]?.email || "",
        address: branch.address || "",
        note: branch.metadataJson?.note ? String(branch.metadataJson.note) : "",
      })) ?? [],
    bankAccounts:
      farmer.bankAccounts?.map((account) => ({
        bankName: account.bank?.name || "",
        accountHolder: account.accountHolder || "",
        accountNumber: account.accountNumber || "",
        branch: account.branch || "",
        note: account.note || "",
        bin: account.bank?.bin || "",
        logo: account.bank?.logoUrl || "",
      })) ?? [],
    documents:
      farmer.documents?.map((doc) => ({
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
    businessLineText:
      farmer.businessLines
        ?.map((line) => line.code || line.name)
        .filter(Boolean)
        .join(", ") || "-",
    primaryPhone: primaryContact?.phone || "-",
    primaryEmail: primaryContact?.email || "-",
    businessLine: businessLineValue,
  };
};

export function useFarmerPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const workspaceId = useSelectedWorkspaceId();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrganizationStatusFilter>("all");
  const [businessLine, setBusinessLine] = useState<string>("all");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<FarmerRow | null>(null);

  const organizationsQuery = useOrganizations(
    {
      type: "farm",
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

  const deleteOrganization = useDeleteOrganization({
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const farmers = useMemo(
    () => (organizationsQuery.items ?? []).map((farmer) => toFarmerRow(farmer, businessLine)),
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

  const columns: Column<FarmerRow>[] = [
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
            alt="farmer"
            className="h-10 w-10 rounded-md border object-cover"
          />
        ) : null,
    },
    { key: "name", label: "Tên nông hộ" },
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
        <div className="max-w-[240px] space-y-1" title={formatContactTooltip(row)}>
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
        <div className="max-w-[240px] space-y-1" title={formatContactTooltip(row)}>
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

  const handleDelete = (item: FarmerRow) => {
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
        description: "Vui lòng chọn workspace trước khi xóa nông hộ.",
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
        description: "Đã xóa nông hộ khỏi hệ thống",
      });
    } catch {
      // Error toast handled by mutation callback.
    } finally {
      setDeleteOpen(false);
      setDeleteItem(null);
    }
  };

  const handleView = (item: FarmerRow) => setLocation(`/farmer/${item.id}`);
  const handleEdit = (item: FarmerRow) =>
    setLocation(`/farmer/${item.id}/edit`);

  return {
    farmerData: farmers,
    columns,
    filters,
    pageSize,
    currentIndex,
    setCurrentIndex,
    totalPages: organizationsQuery.response?.totalPages ?? 0,
    totalElements: organizationsQuery.response?.totalElements ?? 0,
    loading: organizationsQuery.loading,
    error: organizationsQuery.error,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleView,
    handleEdit,
    setPageSize,
    handleSearch,
    handleFilterChange,
    setLocation,
  };
}
