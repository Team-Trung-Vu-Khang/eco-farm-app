import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, CheckCircle2, Search } from "lucide-react";

import {
  useOrganizations,
  type OrganizationRecord,
} from "@/features/organization";
import { useSelectedWorkspaceId } from "@/features/workspace";

type OrganizationTypeFilter = "all" | "enterprise" | "farm" | "cooperative";

interface OrganizationSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId?: string;
  onConfirm: (organization: OrganizationRecord) => void;
}

const ORGANIZATION_TYPE_LABELS: Record<
  Exclude<OrganizationTypeFilter, "all">,
  string
> = {
  enterprise: "Doanh nghiệp",
  farm: "Trang trại",
  cooperative: "Hợp tác xã",
};

export function OrganizationSelectDialog({
  open,
  onOpenChange,
  selectedId,
  onConfirm,
}: OrganizationSelectDialogProps) {
  const workspaceId = useSelectedWorkspaceId();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] =
    useState<OrganizationTypeFilter>("all");
  const [tempSelectedId, setTempSelectedId] = useState("");

  useEffect(() => {
    if (open) {
      setSearchTerm("");
      setSelectedType("all");
      setTempSelectedId(selectedId ?? "");
    }
  }, [open, selectedId]);

  const organizationsQuery = useOrganizations(
    {
      keyword: searchTerm.trim() || undefined,
      type: selectedType === "all" ? undefined : selectedType,
      status: "active",
      page: 0,
      size: 100,
    },
    workspaceId ?? "missing",
    {
      enabled: open && workspaceId !== null,
    },
  );

  const organizations = organizationsQuery.items;

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((organization) => {
      const keyword = searchTerm.trim().toLowerCase();
      if (!keyword) return true;

      return [
        organization.name,
        organization.code,
        organization.taxCode,
        organization.brandName,
        organization.representative,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword));
    });
  }, [organizations, searchTerm]);

  const handleConfirm = () => {
    const selectedOrganization = organizations.find(
      (organization) => String(organization.id) === tempSelectedId,
    );
    if (selectedOrganization) {
      onConfirm(selectedOrganization);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b bg-slate-50/50 p-6">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p>Chọn chủ tài khoản</p>
              <p className="mt-1 text-sm font-normal text-muted-foreground">
                Tìm kiếm đơn vị và chọn loại tổ chức phù hợp.
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="border-b bg-white p-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, mã, MST, đại diện..."
                className="h-11 pl-10"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="w-56">
              <Select
                value={selectedType}
                onValueChange={(value) =>
                  setSelectedType(value as OrganizationTypeFilter)
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Chọn loại đơn vị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="enterprise">Doanh nghiệp</SelectItem>
                  <SelectItem value="farm">Trang trại</SelectItem>
                  <SelectItem value="cooperative">Hợp tác xã</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="max-h-[440px] overflow-y-auto bg-slate-50/30 p-4">
          {organizationsQuery.loading ? (
            <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-sm text-muted-foreground">
              Đang tải danh sách đơn vị...
            </div>
          ) : filteredOrganizations.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredOrganizations.map((organization) => {
                const isSelected = tempSelectedId === String(organization.id);

                return (
                  <button
                    key={organization.id}
                    type="button"
                    onClick={() => setTempSelectedId(String(organization.id))}
                    className={cn(
                      "flex items-start gap-4 rounded-2xl border-2 bg-white p-4 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-transparent hover:border-slate-200",
                    )}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold text-slate-900">
                          {organization.name}
                        </p>
                        <Badge
                          variant="outline"
                          className="border-slate-200 bg-slate-50 text-[10px] font-normal"
                        >
                          {ORGANIZATION_TYPE_LABELS[
                            organization.type as Exclude<
                              OrganizationTypeFilter,
                              "all"
                            >
                          ] || organization.type}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Mã: {organization.code}</span>
                        {organization.taxCode ? (
                          <span>MST: {organization.taxCode}</span>
                        ) : null}
                        {organization.brandName ? (
                          <span>Brand: {organization.brandName}</span>
                        ) : null}
                      </div>
                      {organization.representative ? (
                        <p className="mt-1 truncate text-xs text-slate-500">
                          Đại diện: {organization.representative}
                        </p>
                      ) : null}
                    </div>

                    {isSelected ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-sm text-muted-foreground">
              Không tìm thấy đơn vị phù hợp.
            </div>
          )}
        </div>

        <DialogFooter className="border-t bg-white p-6">
          <div className="flex w-full items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {tempSelectedId ? (
                <span className="font-semibold text-foreground">
                  Đã chọn:{" "}
                  {
                    organizations.find(
                      (organization) =>
                        String(organization.id) === tempSelectedId,
                    )?.name
                  }
                </span>
              ) : (
                "Chưa chọn đơn vị nào"
              )}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button onClick={handleConfirm} disabled={!tempSelectedId}>
                Xác nhận
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
