import { useEffect, useMemo, useState } from "react";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormDialog,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ScrollArea,
  Textarea,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Plus, Search, X } from "lucide-react";

import { CROP_HIERARCHY } from "../crop/data/mocks";

type MethodStatus = "active" | "inactive";

type RelatedCrop = {
  cropGroup: string;
  crop: string;
  varieties: string[];
};

type FarmingMethodCropRow = {
  id: number;
  code: string;
  name: string;
  description: string;
  relatedCrops: RelatedCrop[];
  status: MethodStatus;
  updatedAt: string;
};

type RelatedCropForm = {
  cropGroup: string;
  crop: string;
  varieties: string;
};

type CropOption = {
  cropGroup: string;
  crop: string;
  varieties: string[];
};

type FarmingMethodCropFormData = {
  code: string;
  name: string;
  description: string;
  status: MethodStatus;
  relatedCrops: RelatedCropForm[];
};

const CROP_GROUP_OPTIONS = Object.keys(CROP_HIERARCHY);
const METHOD_OPTIONS = [
  "Canh tác hữu cơ",
  "Canh tác tích hợp",
  "Canh tác công nghệ cao",
  "Luân canh phục hồi đất",
] as const;

const METHOD_LIBRARY: FarmingMethodCropRow[] = [
  {
    id: 1,
    code: "FM-ORG-001",
    name: "Canh tác hữu cơ",
    description:
      "Áp dụng cho các cây cần quản lý đất, hữu cơ và sinh học bền vững; ưu tiên vật tư đầu vào tự nhiên và quy trình kiểm soát chặt.",
    relatedCrops: [
      {
        cropGroup: "Cây ăn trái (Fruit Trees)",
        crop: "Sầu riêng",
        varieties: CROP_HIERARCHY["Cây ăn trái (Fruit Trees)"][
          "Sầu riêng"
        ].slice(0, 3),
      },
      {
        cropGroup: "Cây ăn trái (Fruit Trees)",
        crop: "Mắc ca",
        varieties: CROP_HIERARCHY["Cây ăn trái (Fruit Trees)"]["Mắc ca"].slice(
          0,
          3,
        ),
      },
      {
        cropGroup: "Cây công nghiệp (Industrial Crops)",
        crop: "Cà phê",
        varieties: CROP_HIERARCHY["Cây công nghiệp (Industrial Crops)"][
          "Cà phê"
        ].slice(0, 3),
      },
    ],
    status: "active",
    updatedAt: "2026-06-01",
  },
  {
    id: 2,
    code: "FM-INT-002",
    name: "Canh tác tích hợp",
    description:
      "Kết hợp dinh dưỡng, tưới tiêu và phòng trừ dịch hại theo ngưỡng, phù hợp cho mô hình sản xuất đa cây trong cùng khu vực.",
    relatedCrops: [
      {
        cropGroup: "Cây lương thực (Cereal & Grain)",
        crop: "Lúa",
        varieties: CROP_HIERARCHY["Cây lương thực (Cereal & Grain)"][
          "Lúa"
        ].slice(0, 4),
      },
      {
        cropGroup: "Cây lương thực (Cereal & Grain)",
        crop: "Đậu nành",
        varieties: CROP_HIERARCHY["Cây lương thực (Cereal & Grain)"][
          "Đậu nành"
        ].slice(0, 3),
      },
      {
        cropGroup: "Cây công nghiệp (Industrial Crops)",
        crop: "Hồ tiêu",
        varieties: CROP_HIERARCHY["Cây công nghiệp (Industrial Crops)"][
          "Hồ tiêu"
        ].slice(0, 3),
      },
    ],
    status: "active",
    updatedAt: "2026-05-28",
  },
  {
    id: 3,
    code: "FM-TECH-003",
    name: "Canh tác công nghệ cao",
    description:
      "Dành cho mô hình áp dụng tưới tự động, giám sát cảm biến, chuẩn hóa quy trình và cơ giới hóa các công đoạn chăm sóc.",
    relatedCrops: [
      {
        cropGroup: "Cây công nghiệp (Industrial Crops)",
        crop: "Cao su",
        varieties: CROP_HIERARCHY["Cây công nghiệp (Industrial Crops)"][
          "Cao su"
        ].slice(0, 3),
      },
      {
        cropGroup: "Cây công nghiệp (Industrial Crops)",
        crop: "Cà phê",
        varieties: CROP_HIERARCHY["Cây công nghiệp (Industrial Crops)"][
          "Cà phê"
        ].slice(2, 4),
      },
      {
        cropGroup: "Cây lương thực (Cereal & Grain)",
        crop: "Lúa",
        varieties: CROP_HIERARCHY["Cây lương thực (Cereal & Grain)"][
          "Lúa"
        ].slice(0, 3),
      },
    ],
    status: "active",
    updatedAt: "2026-05-20",
  },
  {
    id: 4,
    code: "FM-ROT-004",
    name: "Luân canh phục hồi đất",
    description:
      "Ưu tiên các cây giúp cải tạo đất, ngắt vòng đời sâu bệnh và ổn định dinh dưỡng giữa các vụ hoặc giữa các lô.",
    relatedCrops: [
      {
        cropGroup: "Cây lương thực (Cereal & Grain)",
        crop: "Khoai mì (Sắn)",
        varieties: CROP_HIERARCHY["Cây lương thực (Cereal & Grain)"][
          "Khoai mì (Sắn)"
        ].slice(0, 3),
      },
      {
        cropGroup: "Cây lương thực (Cereal & Grain)",
        crop: "Ngô (Bắp)",
        varieties: CROP_HIERARCHY["Cây lương thực (Cereal & Grain)"][
          "Ngô (Bắp)"
        ].slice(0, 3),
      },
      {
        cropGroup: "Cây công nghiệp (Industrial Crops)",
        crop: "Chè (Trà)",
        varieties: CROP_HIERARCHY["Cây công nghiệp (Industrial Crops)"][
          "Chè (Trà)"
        ].slice(0, 3),
      },
    ],
    status: "inactive",
    updatedAt: "2026-04-16",
  },
];

const createEmptyForm = (): FarmingMethodCropFormData => ({
  code: "",
  name: "",
  description: "",
  status: "active",
  relatedCrops: [{ cropGroup: "", crop: "", varieties: "" }],
});

const toRelatedCropForm = (related: RelatedCrop): RelatedCropForm => ({
  cropGroup: related.cropGroup,
  crop: related.crop,
  varieties: related.varieties.join(", "),
});

const toRow = (
  item: FarmingMethodCropFormData,
  id: number,
): FarmingMethodCropRow => {
  const relatedCrops = item.relatedCrops
    .filter((crop) => crop.cropGroup && crop.crop)
    .map((crop) => ({
      cropGroup: crop.cropGroup,
      crop: crop.crop,
      varieties: crop.varieties
        .split(",")
        .map((variety) => variety.trim())
        .filter(Boolean),
    }))
    .filter((crop) => crop.varieties.length > 0);

  return {
    id,
    code: item.code.trim().toUpperCase(),
    name: item.name.trim(),
    description: item.description.trim(),
    relatedCrops,
    status: item.status,
    updatedAt: new Date().toISOString().split("T")[0],
  };
};

const emptyRelatedCropForm = (): RelatedCropForm => ({
  cropGroup: "",
  crop: "",
  varieties: "",
});

function CropVarietySelectorDialog({
  open,
  initialValue,
  onConfirm,
  onOpenChange,
}: {
  open: boolean;
  initialValue: RelatedCropForm;
  onConfirm: (value: RelatedCropForm) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(initialValue.cropGroup);
  const [selectedCrop, setSelectedCrop] = useState(initialValue.crop);
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>(
    initialValue.varieties
      ? initialValue.varieties
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      : [],
  );

  const allCropOptions = useMemo<CropOption[]>(() => {
    const items: CropOption[] = [];

    CROP_GROUP_OPTIONS.forEach((group) => {
      Object.entries(CROP_HIERARCHY[group] || {}).forEach(
        ([crop, varieties]) => {
          items.push({
            cropGroup: group,
            crop,
            varieties,
          });
        },
      );
    });

    const query = searchTerm.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) => {
      const searchableText = [item.cropGroup, item.crop, ...item.varieties]
        .join(" ")
        .toLowerCase();
      return searchableText.includes(query);
    });
  }, [searchTerm]);

  const filteredCropOptions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return allCropOptions;

    return allCropOptions.filter((item) => {
      const searchableText = [item.cropGroup, item.crop, ...item.varieties]
        .join(" ")
        .toLowerCase();
      return searchableText.includes(query);
    });
  }, [allCropOptions, searchTerm]);

  useEffect(() => {
    if (!open) return undefined;
    setSearchTerm("");
    setSelectedGroup(initialValue.cropGroup);
    setSelectedCrop(initialValue.crop);
    setSelectedVarieties(
      initialValue.varieties
        ? initialValue.varieties
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        : [],
    );
    return undefined;
  }, [initialValue, open]);

  const selectedOption =
    allCropOptions.find(
      (option) =>
        option.cropGroup === selectedGroup && option.crop === selectedCrop,
    ) ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-h-[90vh] max-w-5xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b bg-slate-50 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-4 w-4" />
            </div>
            Chọn cây trồng - giống áp dụng
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Tìm và chọn cây trồng, sau đó chọn các giống phù hợp cho phương thức
            canh tác.
          </p>
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo nhóm cây, cây trồng hoặc giống..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{filteredCropOptions.length} kết quả</span>
            {selectedOption && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary">
                <Check className="h-3 w-3" />
                Đang chọn: {selectedOption.crop}
              </span>
            )}
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollArea className="min-h-0 border-r bg-white">
            <div className="space-y-3 p-6">
              {filteredCropOptions.map((option) => {
                const isSelected =
                  option.cropGroup === selectedGroup &&
                  option.crop === selectedCrop;

                return (
                  <button
                    key={`${option.cropGroup}-${option.crop}`}
                    type="button"
                    onClick={() => {
                      setSelectedGroup(option.cropGroup);
                      setSelectedCrop(option.crop);
                      setSelectedVarieties(option.varieties);
                    }}
                    className={`group flex w-full items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md ${
                      isSelected
                        ? "border-primary/40 bg-primary/5 shadow-sm"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-slate-900">
                            {option.crop}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                            {option.cropGroup}
                          </p>
                        </div>
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            isSelected
                              ? "border-primary bg-primary text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700"
                        >
                          {option.varieties.length} giống
                        </Badge>
                        <Badge variant="outline" className="border-slate-200">
                          {option.varieties[0]}
                        </Badge>
                        {option.varieties.length > 1 && (
                          <Badge variant="outline" className="border-slate-200">
                            +{option.varieties.length - 1}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredCropOptions.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                  <X className="mb-2 h-5 w-5 text-slate-400" />
                  Không tìm thấy cây trồng phù hợp
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="min-h-0 bg-slate-50">
            <ScrollArea className="h-full">
              <div className="space-y-6 p-6">
                {selectedOption ? (
                  <>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Badge
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 text-emerald-700"
                          >
                            {selectedOption.cropGroup}
                          </Badge>
                          <h3 className="mt-3 text-xl font-semibold text-slate-900">
                            {selectedOption.crop}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            Chọn một hoặc nhiều giống áp dụng cho cây trồng này.
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700"
                        >
                          {selectedVarieties.length} giống đã chọn
                        </Badge>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-slate-900">
                          Danh sách giống
                        </h4>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setSelectedVarieties(selectedOption.varieties)
                          }
                        >
                          Chọn tất cả
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedOption.varieties.map((variety) => {
                          const isActive = selectedVarieties.includes(variety);

                          return (
                            <button
                              key={variety}
                              type="button"
                              onClick={() =>
                                setSelectedVarieties((current) =>
                                  current.includes(variety)
                                    ? current.filter((item) => item !== variety)
                                    : [...current, variety],
                                )
                              }
                              className={`rounded-full border px-3 py-2 text-sm transition-colors ${
                                isActive
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-primary/30"
                              }`}
                            >
                              {variety}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm text-muted-foreground">
                    Chọn một cây trồng ở danh sách bên trái để xem giống áp
                    dụng.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t bg-white px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              if (!selectedOption || selectedVarieties.length === 0) return;

              onConfirm({
                cropGroup: selectedOption.cropGroup,
                crop: selectedOption.crop,
                varieties: selectedVarieties.join(", "),
              });
              onOpenChange(false);
            }}
            disabled={!selectedOption || selectedVarieties.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const columns: Column<FarmingMethodCropRow>[] = [
  {
    key: "code",
    label: "Mã",
    render: (value) => (
      <span className="whitespace-nowrap font-mono text-xs font-semibold text-slate-500">
        {value}
      </span>
    ),
  },
  {
    key: "name",
    label: "Phương thức",
    render: (value, item) => (
      <div className="min-w-0 space-y-1">
        <div className="break-words font-medium text-slate-900">{value}</div>
        <div className="text-xs text-slate-500">
          {item.relatedCrops.length} nhóm cây liên kết
        </div>
      </div>
    ),
  },
  {
    key: "relatedCrops",
    label: "Cây trồng - Giống",
    render: (value: RelatedCrop[]) => (
      <div className="min-w-0 space-y-2">
        {value.map((group) => {
          const visibleVarieties = group.varieties.slice(0, 3);
          const hiddenCount = Math.max(group.varieties.length - 3, 0);

          return (
            <div
              key={`${group.cropGroup}-${group.crop}`}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  {group.crop}
                </Badge>
                <span className="whitespace-nowrap text-xs text-slate-500">
                  {group.varieties.length} giống
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {visibleVarieties.map((variety) => (
                  <Badge
                    key={`${group.crop}-${variety}`}
                    variant="secondary"
                    className="max-w-full bg-white text-slate-700 hover:bg-white"
                  >
                    <span className="max-w-[10rem] truncate">{variety}</span>
                  </Badge>
                ))}
                {hiddenCount > 0 && (
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-white text-slate-500"
                  >
                    +{hiddenCount}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    ),
  },
  {
    key: "description",
    label: "Mô tả",
    render: (value) => (
      <div className="max-w-[200px] text-wrap text-sm leading-6 text-slate-600">
        {value as string}
      </div>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge
        variant={value === "active" ? "secondary" : "outline"}
        className={`whitespace-nowrap ${
          value === "active"
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "text-slate-500"
        }`}
      >
        {value === "active" ? "Đang áp dụng" : "Ngưng"}
      </Badge>
    ),
  },
  {
    key: "updatedAt",
    label: "Cập nhật",
    render: (value) => (
      <span className="whitespace-nowrap text-sm text-slate-500">
        {value as string}
      </span>
    ),
  },
];

export default function FarmingMethodCropPage() {
  const [data, setData] = useState<FarmingMethodCropRow[]>(METHOD_LIBRARY);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [linkDraft, setLinkDraft] = useState<RelatedCropForm>(
    emptyRelatedCropForm(),
  );
  const [editingItem, setEditingItem] = useState<FarmingMethodCropRow | null>(
    null,
  );
  const [deleteItem, setDeleteItem] = useState<FarmingMethodCropRow | null>(
    null,
  );
  const [formData, setFormData] =
    useState<FarmingMethodCropFormData>(createEmptyForm());

  const cropStats = useMemo(
    () => [
      { label: "Phương thức", value: data.length },
      {
        label: "Nhóm cây",
        value: new Set(
          data.flatMap((item) =>
            item.relatedCrops.map((related) => related.cropGroup),
          ),
        ).size,
      },
    ],
    [data],
  );

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(createEmptyForm());
    setFormOpen(true);
  };

  const handleEdit = (item: FarmingMethodCropRow) => {
    setEditingItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
      relatedCrops:
        item.relatedCrops.length > 0
          ? item.relatedCrops.map(toRelatedCropForm)
          : [{ cropGroup: "", crop: "", varieties: "" }],
    });
    setFormOpen(true);
  };

  const handleDelete = (item: FarmingMethodCropRow) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const openAddLinkDialog = () => {
    setEditingLinkIndex(null);
    setLinkDraft(emptyRelatedCropForm());
    setLinkDialogOpen(true);
  };

  const openEditLinkDialog = (index: number) => {
    const current = formData.relatedCrops[index];
    setEditingLinkIndex(index);
    setLinkDraft(current || emptyRelatedCropForm());
    setLinkDialogOpen(true);
  };

  const handleConfirmLink = (value: RelatedCropForm) => {
    setFormData((current) => {
      const next = [...current.relatedCrops];

      if (editingLinkIndex === null) {
        next.push(value);
      } else {
        next[editingLinkIndex] = value;
      }

      return { ...current, relatedCrops: next };
    });

    setLinkDialogOpen(false);
    setEditingLinkIndex(null);
    setLinkDraft(emptyRelatedCropForm());
  };

  const handleSubmit = () => {
    const normalized = toRow(formData, editingItem?.id || Date.now());

    if (editingItem) {
      setData((current) =>
        current.map((item) =>
          item.id === editingItem.id ? { ...normalized, id: item.id } : item,
        ),
      );
    } else {
      setData((current) => [{ ...normalized, id: Date.now() }, ...current]);
    }

    setFormOpen(false);
    setEditingItem(null);
    setFormData(createEmptyForm());
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((current) => current.filter((item) => item.id !== deleteItem.id));
    }
    setDeleteItem(null);
    setDeleteOpen(false);
  };

  const activeCropCount = useMemo(() => {
    const cropSet = new Set<string>();
    data.forEach((item) => {
      item.relatedCrops.forEach((related) => cropSet.add(related.crop));
    });
    return cropSet.size;
  }, [data]);

  return (
    <AdminLayout
      isDev={true}
      title="Phương thức canh tác theo cây trồng"
      description="Bảng liên kết giữa phương thức canh tác với danh sách cây trồng và giống áp dụng, kèm mô tả ngắn cho từng phương thức."
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm phương thức
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm phương thức, cây trồng hoặc giống..."
        selectable={false}
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingItem ? "Cập nhật phương thức" : "Thêm phương thức mới"}
        onSubmit={handleSubmit}
        size="xl"
      >
        <div className="space-y-5">
          {/* Row 1: Mã */}
          <div className="space-y-1.5">
            <Label htmlFor="code" className="text-sm font-medium">
              Mã phương thức
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  code: e.target.value.toUpperCase(),
                }))
              }
              placeholder="VD: FM-ORG-001"
              className="bg-slate-50 font-mono"
            />
          </div>

          {/* Row 2: Phương thức canh tác */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Phương thức canh tác
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={formData.name}
              onValueChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  name: value,
                }))
              }
            >
              <SelectTrigger className="w-full bg-slate-50">
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                {METHOD_OPTIONS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 3: Trạng thái */}
          {/* <div className="space-y-1.5">
            <Label className="text-sm font-medium">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value: MethodStatus) =>
                setFormData((current) => ({
                  ...current,
                  status: value,
                }))
              }
            >
              <SelectTrigger className="w-full bg-slate-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Đang áp dụng</SelectItem>
                <SelectItem value="inactive">Ngưng áp dụng</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Row 4: Mô tả */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">
              Mô tả
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  description: e.target.value,
                }))
              }
              placeholder="Mô tả phạm vi áp dụng của phương thức..."
              rows={4}
              className="bg-slate-50 resize-none"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Row 5: Cây trồng - Giống */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Cây trồng - Giống áp dụng
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Liên kết phương thức với các cây trồng và giống cụ thể
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openAddLinkDialog}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Thêm cây trồng - giống
              </Button>
            </div>

            {formData.relatedCrops.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-8 text-center">
                <p className="text-sm font-medium text-slate-500">
                  Chưa có cây trồng nào được liên kết
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Bấm "Thêm cây trồng - giống" để chọn cây trồng và giống
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.relatedCrops.map((relatedCrop, index) => {
                  const varieties = relatedCrop.varieties
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);
                  const hiddenVarieties = Math.max(varieties.length - 3, 0);

                  return (
                    <div
                      key={`related-${index}`}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 text-emerald-700"
                          >
                            {relatedCrop.crop || "Chưa chọn cây"}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            Liên kết {index + 1}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {relatedCrop.cropGroup ? (
                            <Badge
                              variant="secondary"
                              className="bg-white text-slate-700"
                            >
                              {relatedCrop.cropGroup}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-dashed text-slate-500"
                            >
                              Chưa chọn nhóm
                            </Badge>
                          )}
                          {varieties.slice(0, 3).map((variety) => (
                            <Badge
                              key={`${relatedCrop.crop}-${variety}`}
                              variant="outline"
                              className="max-w-full border-slate-200 bg-white text-slate-700"
                            >
                              <span className="max-w-[12rem] truncate">
                                {variety}
                              </span>
                            </Badge>
                          ))}
                          {hiddenVarieties > 0 && (
                            <Badge
                              variant="outline"
                              className="border-slate-200 bg-white text-slate-500"
                            >
                              +{hiddenVarieties}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-slate-600">
                          {relatedCrop.varieties || "Chưa chọn giống"}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => openEditLinkDialog(index)}
                        >
                          Chọn giống
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            setFormData((current) => ({
                              ...current,
                              relatedCrops: current.relatedCrops.filter(
                                (_, itemIndex) => itemIndex !== index,
                              ),
                            }))
                          }
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </FormDialog>

      <CropVarietySelectorDialog
        open={linkDialogOpen}
        initialValue={linkDraft}
        onConfirm={handleConfirmLink}
        onOpenChange={(open) => {
          setLinkDialogOpen(open);
          if (!open) {
            setEditingLinkIndex(null);
            setLinkDraft(emptyRelatedCropForm());
          }
        }}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa phương thức"
        description={`Bạn có chắc chắn muốn xóa phương thức "${deleteItem?.name}"?`}
      />
    </AdminLayout>
  );
}
