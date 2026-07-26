import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface AnimalGrowthCycleHierarchyPrimaryOption {
  id: string;
  name: string;
  group: string;
  image: string;
  description?: string;
  code?: string;
}

export interface AnimalGrowthCycleHierarchyChildOption {
  id: string;
  primaryId: string;
  name: string;
  group: string;
  image: string;
  description?: string;
  code?: string;
}

interface AnimalGrowthCycleHierarchyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  searchPlaceholder: string;
  selectedPrimaryId: string;
  selectedChildId: string;
  primaryOptions: AnimalGrowthCycleHierarchyPrimaryOption[];
  childOptions: AnimalGrowthCycleHierarchyChildOption[];
  primaryLabel: string;
  childLabel: string;
  showChildSection: boolean;
  onConfirm: (payload: {
    primary: AnimalGrowthCycleHierarchyPrimaryOption;
    child?: AnimalGrowthCycleHierarchyChildOption;
  }) => void;
}

function OptionCard({
  option,
  selected,
  onClick,
}: {
  option: AnimalGrowthCycleHierarchyPrimaryOption | AnimalGrowthCycleHierarchyChildOption;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md",
        selected ? "border-primary/40 bg-primary/5 shadow-sm" : "border-slate-200",
      )}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
        <img
          src={option.image}
          alt={option.name}
          className="h-full w-full rounded-xl object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {option.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
              {option.description}
            </p>
          </div>
          <div
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
              selected ? "border-primary bg-primary text-white" : "border-slate-300 bg-white",
            )}
          >
            {selected && <Check className="h-3 w-3" />}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {option.group && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              {option.group}
            </Badge>
          )}
          {option.code && (
            <Badge variant="outline" className="border-slate-200 text-slate-600">
              {option.code}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

export function AnimalGrowthCycleHierarchyDialog({
  open,
  onOpenChange,
  title,
  description,
  searchPlaceholder,
  selectedPrimaryId,
  selectedChildId,
  primaryOptions,
  childOptions,
  primaryLabel,
  childLabel,
  showChildSection,
  onConfirm,
}: AnimalGrowthCycleHierarchyDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempPrimaryId, setTempPrimaryId] = useState(selectedPrimaryId);
  const [tempChildId, setTempChildId] = useState(selectedChildId);
  const childSectionRef = useRef<HTMLDivElement | null>(null);

  const filteredPrimaryOptions = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return primaryOptions;

    return primaryOptions.filter((option) => {
      const searchable = [
        option.name,
        option.group,
        option.code,
        option.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(query);
    });
  }, [primaryOptions, searchTerm]);

  const filteredChildOptions = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return childOptions.filter((option) => {
      if (option.primaryId !== tempPrimaryId) return false;
      if (!query) return true;

      const searchable = [
        option.name,
        option.group,
        option.code,
        option.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(query);
    });
  }, [childOptions, searchTerm, tempPrimaryId]);

  const selectedPrimary = primaryOptions.find((item) => item.id === tempPrimaryId);

  useEffect(() => {
    if (!open) return;
    if (!showChildSection) return;
    if (!tempPrimaryId) return;

    const timer = window.setTimeout(() => {
      childSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [open, tempPrimaryId, showChildSection]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setTempPrimaryId(selectedPrimaryId);
          setTempChildId(selectedChildId);
          setSearchTerm("");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="flex h-[88vh] max-h-[88vh] max-w-4xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b bg-slate-50 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-4 w-4" />
            </div>
            {title}
          </DialogTitle>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              {filteredPrimaryOptions.length} mục cha, {filteredChildOptions.length} mục con
            </span>
            {selectedPrimary && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary">
                <Check className="h-3 w-3" />
                Đang chọn: {selectedPrimary.name}
              </span>
            )}
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-5 p-5">
            <div>
              <div className="mb-3 text-sm font-semibold text-slate-700">
                {primaryLabel}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredPrimaryOptions.map((option) => {
                  const isSelected = tempPrimaryId === option.id;
                  return (
                    <OptionCard
                      key={option.id}
                      option={option}
                      selected={isSelected}
                      onClick={() => {
                        setTempPrimaryId(option.id);
                        setTempChildId("");
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {showChildSection ? (
              <div>
                <div className="mb-3 text-sm font-semibold text-slate-700">
                  {childLabel}
                </div>
                <div ref={childSectionRef} />
                <div className="grid gap-3 sm:grid-cols-2">
                  {tempPrimaryId && filteredChildOptions.length > 0 ? (
                    filteredChildOptions.map((option) => {
                      const isSelected = tempChildId === option.id;
                      return (
                        <OptionCard
                          key={option.id}
                          option={option}
                          selected={isSelected}
                          onClick={() => setTempChildId(option.id)}
                        />
                      );
                    })
                  ) : (
                    <div className="col-span-full flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm text-muted-foreground">
                      Chọn {primaryLabel.toLowerCase()} để xem {childLabel.toLowerCase()} tương ứng
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 border-t bg-white px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              if (!selectedPrimary) return;
              const child = childOptions.find((item) => item.id === tempChildId);
              onConfirm({ primary: selectedPrimary, child });
              onOpenChange(false);
            }}
            disabled={!tempPrimaryId}
            className="bg-primary hover:bg-primary/90"
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
