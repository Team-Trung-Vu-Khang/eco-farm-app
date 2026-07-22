import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  Edit2,
  Grid3x3,
  Navigation,
  Plus,
  PawPrint,
  Rows,
  Trash2,
} from "lucide-react";
import {
  MOCK_SEEDS,
  type AnimalDistributionMethod,
  type AnimalEntry,
  type RowConfig,
} from "../constants";

type Props = {
  selectedSeedIds: string[];
  distributionMethod: AnimalDistributionMethod;
  animalEntries: AnimalEntry[];
  rowConfigs: RowConfig[];
  availableVarieties: string[];
  onToggleSeed: (id: string) => void;
  onChangeMethod: (method: AnimalDistributionMethod) => void;
  onAddAnimalEntry: () => void;
  onUpdateAnimalEntry: (
    id: string,
    field: keyof AnimalEntry,
    value: string | number,
  ) => void;
  onRemoveAnimalEntry: (id: string) => void;
  onAddRowConfig: () => void;
  onUpdateRowConfig: (
    id: string,
    field: keyof RowConfig,
    value: string | number,
  ) => void;
  onRemoveRowConfig: (id: string) => void;
};

export const AnimalDistributionConfigurationStep = ({
  selectedSeedIds,
  distributionMethod,
  animalEntries,
  rowConfigs,
  availableVarieties,
  onToggleSeed,
  onChangeMethod,
  onAddAnimalEntry,
  onUpdateAnimalEntry,
  onRemoveAnimalEntry,
  onAddRowConfig,
  onUpdateRowConfig,
  onRemoveRowConfig,
}: Props) => {
  const selectedSeeds = MOCK_SEEDS.filter((seed) =>
    selectedSeedIds.includes(seed.id),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-green-50 border border-green-200 rounded-lg p-5 flex items-start gap-4">
        <div className="bg-green-100 p-2 rounded-full text-green-600 shrink-0">
          <PawPrint className="w-6 h-6" />
        </div>
        <div className="text-green-900">
          <div className="font-bold text-lg mb-1">
            Bước 2: Cấu hình phân bổ vật nuôi
          </div>
          <div className="text-sm opacity-90 leading-relaxed max-w-2xl">
            Lựa chọn giống vật nuôi và thiết lập phương thức phân bổ. Bạn có thể
            chọn nhiều loại giống để phân bổ cho vùng chăn nuôi này.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-slate-800">
              Chọn giống vật nuôi
            </Label>
            <Badge variant="outline" className="text-xs">
              Đã chọn: {selectedSeedIds.length}
            </Badge>
          </div>

          <ScrollArea className="h-[500px] -mr-4 pr-4">
            <div className="grid grid-cols-1 gap-3">
              {MOCK_SEEDS.map((seed) => {
                const isSelected = selectedSeedIds.includes(seed.id);

                return (
                  <div
                    key={seed.id}
                    onClick={() => onToggleSeed(seed.id)}
                    className={`group relative flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-green-50/50 border-green-500 shadow-sm"
                        : "bg-white border-slate-100 hover:border-green-300 hover:shadow-md"
                    }`}
                  >
                    <div className="relative w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      {seed.imageUrl ? (
                        <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={seed.imageUrl}
                            alt={seed.name}
                            className={`w-full h-full object-cover transition-all ${isSelected ? "opacity-100" : "opacity-90 group-hover:opacity-100"}`}
                          />
                          {!isSelected && (
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors" />
                          )}
                        </div>
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center transition-colors ${isSelected ? "bg-green-100 text-green-600" : "text-slate-400 group-hover:text-green-500"}`}
                        >
                          <Sprout className="w-8 h-8" />
                        </div>
                      )}

                      {isSelected && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-[1px]">
                          <div className="bg-white rounded-full p-0.5 shadow-sm">
                            <CheckCircle2 className="w-5 h-5 text-green-600 fill-green-100" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 py-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className={`font-semibold truncate ${isSelected ? "text-green-900" : "text-slate-900"}`}
                        >
                          {seed.name}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                        {seed.variety}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 h-5 bg-slate-100 text-slate-500 border-slate-200"
                        >
                          {seed.code}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-6">
          {selectedSeedIds.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-slate-50/50 text-slate-400 gap-4 min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <Navigation className="w-8 h-8 opacity-20" />
              </div>
              <div className="text-center max-w-xs">
                <span className="font-medium text-slate-600 block mb-1">
                  Chưa chọn giống vật nuôi
                </span>
                <span className="text-sm">
                  Vui lòng chọn ít nhất một giống vật nuôi từ danh sách bên trái
                  để tiếp tục cấu hình.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="space-y-3">
                <Label className="text-base font-semibold text-slate-800">
                  Phương thức phân bổ
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: "zone",
                      label: "Phân bổ theo vùng",
                      desc: "Tự động phân bổ vật nuôi vào toàn bộ vùng đã chọn",
                      icon: Grid3x3,
                    },
                    {
                      id: "row",
                      label: "Phân bổ theo hàng",
                      desc: "Thiết lập chi tiết số lượng vật nuôi cho từng hàng",
                      icon: Rows,
                    },
                  ].map((method) => {
                    const isSelected = distributionMethod === method.id;

                    return (
                      <div
                        key={method.id}
                        onClick={() =>
                          onChangeMethod(method.id as AnimalDistributionMethod)
                        }
                        className={`cursor-pointer rounded-xl border-2 p-4 relative transition-all overflow-hidden ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-slate-200 bg-white hover:border-primary/30 hover:shadow-sm"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 -mr-8 -mt-8 rounded-full blur-xl" />
                        )}
                        <div className="flex items-start gap-3 relative z-10">
                          <div
                            className={`p-2 rounded-lg shrink-0 transition-colors ${isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}
                          >
                            <method.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div
                              className={`font-bold ${isSelected ? "text-primary" : "text-slate-700"}`}
                            >
                              {method.label}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 leading-snug">
                              {method.desc}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-0 right-0">
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Card className="border-none shadow-lg bg-white overflow-hidden ring-1 ring-slate-200/50">
                <div className="h-1 bg-linear-to-r from-primary/40 to-primary/10" />
                <CardHeader className="border-b bg-slate-50/50 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Edit2 className="w-4 h-4 text-primary" />
                        {distributionMethod === "zone"
                          ? "Cấu hình chi tiết vùng"
                          : "Cấu hình chi tiết hàng"}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {distributionMethod === "zone"
                          ? "Thêm các mục để xác định số lượng vật nuôi cho từng giống vật nuôi"
                          : "Xác định số lượng vật nuôi và giống cho từng hàng cụ thể"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={
                        distributionMethod === "zone"
                          ? onAddAnimalEntry
                          : onAddRowConfig
                      }
                      className="shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {distributionMethod === "zone"
                        ? "Thêm giống vật nuôi"
                        : "Thêm hàng mới"}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <ScrollArea className="h-[350px]">
                    <div className="p-4 space-y-3">
                      {(distributionMethod === "zone"
                        ? animalEntries
                        : rowConfigs
                      ).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <Plus className="w-6 h-6" />
                          </div>
                          <div className="text-slate-500 font-medium">
                            Chưa có cấu hình nào
                          </div>
                          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                            Nhấn nút "Thêm" ở góc trên để bắt đầu thiết lập số
                            lượng vật nuôi
                          </p>
                        </div>
                      ) : distributionMethod === "zone" ? (
                        animalEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className="group relative grid grid-cols-12 gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all hover:border-primary/20"
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 rounded-l-xl group-hover:bg-primary transition-colors" />

                            <div className="col-span-5 sm:col-span-4">
                              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5 block">
                                Vật nuôi
                              </Label>
                              <Select
                                value={entry.variety}
                                onValueChange={(value) =>
                                  onUpdateAnimalEntry(
                                    entry.id,
                                    "variety",
                                    value,
                                  )
                                }
                              >
                                <SelectTrigger className="h-9 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20">
                                  <SelectValue placeholder="Chọn vật nuôi..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableVarieties.map((variety) => (
                                    <SelectItem key={variety} value={variety}>
                                      {variety}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="col-span-4 sm:col-span-5">
                              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5 block">
                                Giống vật nuôi
                              </Label>
                              <Select
                                value={entry.seedId}
                                onValueChange={(value) =>
                                  onUpdateAnimalEntry(entry.id, "seedId", value)
                                }
                                disabled={!entry.variety}
                              >
                                <SelectTrigger className="h-9 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20">
                                  <SelectValue
                                    placeholder={
                                      entry.variety ? "Chọn giống..." : "---"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedSeeds
                                    .filter(
                                      (seed) => seed.variety === entry.variety,
                                    )
                                    .map((seed) => (
                                      <SelectItem key={seed.id} value={seed.id}>
                                        <div className="flex items-center gap-2">
                                          <span className="w-2 h-2 rounded-full bg-green-500" />
                                          {seed.name}
                                        </div>
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="col-span-3 sm:col-span-2">
                              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5 block">
                                Số lượng
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                value={entry.quantity}
                                onChange={(event) =>
                                  onUpdateAnimalEntry(
                                    entry.id,
                                    "quantity",
                                    parseInt(event.target.value, 10) || 0,
                                  )
                                }
                                className="h-9 bg-slate-50 border-slate-200 focus:bg-white text-center font-medium"
                              />
                            </div>

                            <div className="col-span-12 sm:col-span-1 flex items-end justify-end sm:justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemoveAnimalEntry(entry.id)}
                                className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        rowConfigs.map((row) => (
                          <div
                            key={row.id}
                            className="group relative grid grid-cols-12 gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all hover:border-primary/20"
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 rounded-l-xl group-hover:bg-primary transition-colors" />

                            <div className="col-span-3 sm:col-span-2">
                              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5 block">
                                Hàng #
                              </Label>
                              <div className="relative">
                                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                  <Rows className="w-3 h-3" />
                                </div>
                                <Input
                                  type="number"
                                  value={row.rowNumber}
                                  onChange={(event) =>
                                    onUpdateRowConfig(
                                      row.id,
                                      "rowNumber",
                                      parseInt(event.target.value, 10) || 1,
                                    )
                                  }
                                  className="h-9 pl-8 bg-slate-50 border-slate-200 focus:bg-white font-bold text-slate-700"
                                />
                              </div>
                            </div>

                            <div className="col-span-9 sm:col-span-4">
                              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5 block">
                                Vật nuôi
                              </Label>
                              <Select
                                value={row.variety}
                                onValueChange={(value) =>
                                  onUpdateRowConfig(row.id, "variety", value)
                                }
                              >
                                <SelectTrigger className="h-9 bg-slate-50 border-slate-200 focus:bg-white">
                                  <SelectValue placeholder="Chọn vật nuôi..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableVarieties.map((variety) => (
                                    <SelectItem key={variety} value={variety}>
                                      {variety}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="col-span-8 sm:col-span-4">
                              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5 block">
                                Giống vật nuôi
                              </Label>
                              <Select
                                value={row.seedId}
                                onValueChange={(value) =>
                                  onUpdateRowConfig(row.id, "seedId", value)
                                }
                                disabled={!row.variety}
                              >
                                <SelectTrigger className="h-9 bg-slate-50 border-slate-200 focus:bg-white">
                                  <SelectValue placeholder="Chọn giống..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedSeeds
                                    .filter(
                                      (seed) => seed.variety === row.variety,
                                    )
                                    .map((seed) => (
                                      <SelectItem key={seed.id} value={seed.id}>
                                        {seed.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="col-span-4 sm:col-span-2">
                              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5 block">
                                Số cây
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                value={row.quantity}
                                onChange={(event) =>
                                  onUpdateRowConfig(
                                    row.id,
                                    "quantity",
                                    parseInt(event.target.value, 10) || 0,
                                  )
                                }
                                className="h-9 bg-slate-50 border-slate-200 focus:bg-white text-center font-medium"
                              />
                            </div>

                            <div className="absolute right-2 top-2 sm:static sm:col-span-12 sm:flex sm:justify-end sm:mt-2 md:col-span-1 md:mt-0 md:justify-center md:items-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemoveRowConfig(row.id)}
                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
