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
  ScrollArea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Building2,
  Check,
  Search,
  X,
  Users,
  Sprout,
  Briefcase,
} from "lucide-react";
import { useOrganizations } from "@/features/organization/hooks/useOrganizations";
import { useSelectedWorkspaceId } from "@/features/workspace";

type OrganizationTypeFilter = "all" | "enterprise" | "farm" | "cooperative";

interface PartnerSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  isMulti?: boolean;
  selectedNames: string[];
  onConfirm: (selectedNames: string[]) => void;
}

const ORGANIZATION_TYPE_LABELS: Record<
  Exclude<OrganizationTypeFilter, "all">,
  string
> = {
  enterprise: "Doanh nghiệp",
  farm: "Nông hộ / Trang trại",
  cooperative: "Hợp tác xã",
};

export function PartnerSelectorDialog({
  open,
  onOpenChange,
  title,
  isMulti = false,
  selectedNames,
  onConfirm,
}: PartnerSelectorDialogProps) {
  const workspaceId = useSelectedWorkspaceId();
  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] =
    useState<OrganizationTypeFilter>("all");
  const [tempSelectedNames, setTempSelectedNames] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setSearchTerm("");
      setSelectedType("all");
      setTempSelectedNames([...selectedNames]);
    }
  }, [open, selectedNames]);

  const { items: organizations, loading } = useOrganizations(
    {
      keyword: searchTerm.trim() || undefined,
      type: selectedType === "all" ? undefined : selectedType,
      status: "active",
    },
    parsedWorkspaceId ?? "missing",
    {
      enabled: open && parsedWorkspaceId !== undefined,
    },
  );

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const keyword = searchTerm.trim().toLowerCase();
      if (!keyword) return true;
      return [org.name, org.code, org.taxCode, org.brandName]
        .filter(Boolean)
        .some((val) => val.toLowerCase().includes(keyword));
    });
  }, [organizations, searchTerm]);

  const handleSelectToggle = (name: string) => {
    if (isMulti) {
      if (tempSelectedNames.includes(name)) {
        setTempSelectedNames(tempSelectedNames.filter((n) => n !== name));
      } else {
        setTempSelectedNames([...tempSelectedNames, name]);
      }
    } else {
      setTempSelectedNames([name]);
    }
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedNames);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0 rounded-2xl border-none shadow-2xl">
        <DialogHeader className="border-b bg-slate-50/50 p-5">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p>{title}</p>
              <p className="mt-1 text-xs font-normal text-muted-foreground">
                Tìm kiếm và chọn tổ chức, nông hộ, hợp tác xã từ hệ thống.
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="border-b bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, mã đơn vị..."
                className="h-11 pl-10 w-full"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="sm:w-48">
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
                  <SelectItem value="all">Tất cả loại hình</SelectItem>
                  <SelectItem value="enterprise">Doanh nghiệp</SelectItem>
                  <SelectItem value="farm">Nông hộ / Trang trại</SelectItem>
                  <SelectItem value="cooperative">Hợp tác xã</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {tempSelectedNames.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-muted-foreground mr-1">
                Đang chọn:
              </span>
              {tempSelectedNames.map((name) => (
                <Badge
                  key={name}
                  variant="secondary"
                  className="flex items-center gap-1 text-[11px] py-0.5 px-2 bg-primary/5 text-primary border border-primary/20"
                >
                  {name}
                  <X
                    className="h-3 w-3 cursor-pointer text-primary hover:text-red-500"
                    onClick={() => handleSelectToggle(name)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <ScrollArea className="h-[260px] bg-slate-50/30 p-5 border-b">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20 text-sm text-muted-foreground">
              Đang tải danh sách đơn vị...
            </div>
          ) : filteredOrganizations.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredOrganizations.map((org) => {
                const isSelected = tempSelectedNames.includes(org.name);

                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => handleSelectToggle(org.name)}
                    className={cn(
                      "flex items-start gap-3.5 rounded-xl border p-4 text-left transition-all hover:shadow-xs",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-350",
                    )}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary overflow-hidden border border-primary/20">
                      {org.imageUrl ? (
                        <img
                          src={org.imageUrl}
                          alt={org.name}
                          className="w-full h-full object-cover"
                        />
                      ) : org.type === "enterprise" ? (
                        <Briefcase className="h-5 w-5" />
                      ) : org.type === "cooperative" ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        <Sprout className="h-5 w-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
                        {org.name}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-[10px] py-0 h-4 bg-slate-100 font-medium capitalize"
                        >
                          {ORGANIZATION_TYPE_LABELS[
                            org.type as Exclude<OrganizationTypeFilter, "all">
                          ] || org.type}
                        </Badge>
                        {org.code && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            Mã: {org.code}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-0.5">
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center py-20 text-sm text-muted-foreground">
              Không tìm thấy đơn vị phù hợp.
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="bg-white p-5">
          <div className="flex w-full items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="button" onClick={handleConfirm}>
              Xác nhận
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
