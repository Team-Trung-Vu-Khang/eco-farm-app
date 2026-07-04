import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

import { useMasterData } from "@/features/master-data";
import {
  useDeleteOrganization,
  useOrganizations,
  type OrganizationRecord,
} from "@/features/organization";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type { Enterprise } from "@/pages/enterprise/data/constants";
import { COOPERATIVE_COLUMNS } from "../data/constants";

export type CooperativeRow = Omit<Enterprise, "classification"> & {
  classification: Enterprise["classification"];
  businessLine: string;
  businessLineText: string;
  primaryPhone: string;
  primaryEmail: string;
  image: string;
};

const DEFAULT_PAGE_SIZE = 10;

type OrganizationStatusFilter = OrganizationRecord["status"] | "all";

const toCooperativeRow = (
  cooperative: OrganizationRecord,
  selectedBusinessLine: string,
): CooperativeRow => {
  const primaryContact =
    cooperative.contacts?.find((contact) => contact.isPrimary) ??
    cooperative.contacts?.[0] ??
    null;

  const firstBusinessLine =
    cooperative.businessLines?.find((line) => line.code || line.name) ?? null;
  const businessLineValue =
    selectedBusinessLine !== "all"
      ? selectedBusinessLine
      : firstBusinessLine?.code || firstBusinessLine?.name || "-";

  return {
    id: Number(cooperative.id),
    code: cooperative.code,
    name: cooperative.name,
    image: cooperative.imageUrl || "",
    type: "cooperative",
    classification:
      (cooperative.businessLines
        ?.map((line) => line.code || line.name)
        .filter(Boolean) as Enterprise["classification"]) ?? [],
    taxCode: cooperative.taxCode,
    address: cooperative.address,
    phone: primaryContact?.phone || "",
    email: primaryContact?.email || "",
    status: cooperative.status === "inactive" ? "inactive" : "active",
    createdAt: cooperative.createdAt,
    brandName: cooperative.brandName,
    representative: cooperative.representative,
    foundedDate: cooperative.foundedDate,
    website: cooperative.website,
    province: cooperative.province,
    district: cooperative.district || cooperative.ward || "",
    ward: cooperative.ward,
    latitude: cooperative.latitude,
    longitude: cooperative.longitude,
    taxAddress: cooperative.taxAddress,
    taxAuthority: cooperative.taxAuthority,
    issueDate: cooperative.issueDate,
    description: cooperative.description,
    contacts:
      cooperative.contacts?.map((contact) => ({
        id: contact.id,
        name: contact.name || contact.fullName || "",
        phone: contact.phone || "",
        email: contact.email || "",
      })) ?? [],
    branches:
      cooperative.branches?.map((branch) => ({
        name: branch.name || "",
        taxCode: branch.taxCode || "",
        phone: branch.contacts?.[0]?.phone || "",
        taxAddress: branch.taxAddress || "",
        email: branch.contacts?.[0]?.email || "",
        address: branch.address || "",
        note: branch.metadataJson?.note ? String(branch.metadataJson.note) : "",
      })) ?? [],
    bankAccounts:
      cooperative.bankAccounts?.map((account) => ({
        bankName: account.bank?.name || "",
        accountHolder: account.accountHolder || "",
        accountNumber: account.accountNumber || "",
        branch: account.branch || "",
        note: account.note || "",
        bin: account.bank?.bin || "",
        logo: account.bank?.logoUrl || "",
      })) ?? [],
    documents:
      cooperative.documents?.map((doc) => ({
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
    businessLine: businessLineValue,
    businessLineText:
      cooperative.businessLines
        ?.map((line) => line.code || line.name)
        .filter(Boolean)
        .join(", ") || "-",
    primaryPhone: primaryContact?.phone || "-",
    primaryEmail: primaryContact?.email || "-",
  };
};

export function useCooperative() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const workspaceId = useSelectedWorkspaceId();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrganizationStatusFilter>("all");
  const [businessLine, setBusinessLine] = useState<string>("all");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<CooperativeRow | null>(null);

  const organizationsQuery = useOrganizations(
    {
      type: "cooperative",
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

  const data = useMemo(
    () =>
      (organizationsQuery.items ?? []).map((cooperative) =>
        toCooperativeRow(cooperative, businessLine),
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

  const handleDelete = (item: CooperativeRow) => {
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
        description: "Vui lòng chọn workspace trước khi xóa hợp tác xã.",
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
        description: "Đã xóa hợp tác xã khỏi hệ thống",
      });
      setDeleteItem(null);
      setDeleteOpen(false);
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể xóa hợp tác xã",
        variant: "destructive",
      });
    }
  };

  return {
    data,
    columns: COOPERATIVE_COLUMNS,
    filters,
    search,
    pageSize,
    currentIndex,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    setLocation,
    handleSearch,
    handleFilterChange,
    setPageSize: (value: number) => {
      setPageSize(value);
      setCurrentIndex(1);
    },
    setCurrentIndex,
    loading: organizationsQuery.loading,
    error:
      workspaceId === null
        ? "Vui lòng chọn workspace"
        : organizationsQuery.error,
    totalPages: organizationsQuery.response?.totalPages ?? 0,
    totalElements: organizationsQuery.response?.totalElements ?? 0,
  };
}
