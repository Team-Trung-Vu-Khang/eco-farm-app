import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronLeft,
  CheckCircle2,
  Fish,
  Layers,
  MapPin,
  Plus,
  Target,
  Trash2,
  Waves,
  Gauge,
} from "lucide-react";
import { useAquacultureDistributionCreatePage } from "./hooks/useAquacultureDistributionCreatePage";

const AquacultureDistributionCreatePage = () => {
  const {
    scope,
    selectedRegionId,
    selectedAreaIds,
    selectedPlotIds,
    method,
    unitEntries,
    totalStock,
    plannedUnitCount,
    averageWeight,
    varieties,
    selectedMethodLabel,
    scopeLabel,
    selectedRegion,
    selectedAreas,
    selectedPlots,
    speciesOptions,
    methodOptions,
    setScope,
    setSelectedRegionId,
    toggleArea,
    togglePlot,
    setMethod,
    addUnitEntry,
    updateUnitEntry,
    removeUnitEntry,
    handleComplete,
    handleCancel,
    goToList,
  } = useAquacultureDistributionCreatePage();

  const steps: Step[] = [
    {
      id: "scope",
      title: "Chọn phạm vi",
      description: "Xác định vùng, khu vực hoặc ao nuôi",
      content: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 flex items-start gap-3">
            <div className="text-cyan-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-sm text-cyan-800">
              <div className="font-semibold mb-1">Bước 1: Chọn phạm vi</div>
              <div>
                Xác định phạm vi phân bổ nuôi trồng thủy sản theo vùng, khu vực
                hoặc ao nuôi cụ thể.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: "region",
                label: "Theo vùng nuôi",
                icon: MapPin,
                desc: "Thiết lập cho toàn bộ vùng",
              },
              {
                id: "area",
                label: "Theo khu vực",
                icon: Layers,
                desc: "Thiết lập cho các khu vực",
              },
              {
                id: "plot",
                label: "Theo ao nuôi",
                icon: Target,
                desc: "Thiết lập cho từng ao",
              },
            ].map((item) => {
              const isSelected = scope === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setScope(item.id as typeof scope)}
                  className={`relative text-left border-2 rounded-xl p-4 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-slate-100 bg-white hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 text-primary">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                      isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-slate-800">{item.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border">
            <div className="text-sm font-medium text-slate-700">
              Chọn vị trí địa lý
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-muted-foreground">
                Vùng nuôi <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedRegionId} onValueChange={setSelectedRegionId}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Chọn vùng..." />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { id: "1", name: "Vùng Bình Phước Alpha" },
                    { id: "2", name: "Vùng nuôi tôm Cần Giờ" },
                  ].map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(scope === "area" || scope === "plot") && selectedRegionId && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <Label className="text-xs text-muted-foreground">
                  Khu vực
                  {selectedAreaIds.length > 0 && (
                    <span className="ml-1 text-primary font-medium">
                      ({selectedAreaIds.length})
                    </span>
                  )}
                </Label>
                <ScrollArea className="max-h-[200px] border rounded-lg p-2 bg-white">
                  <div className="space-y-1">
                    {(selectedRegion?.subAreas || []).map((area) => (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => toggleArea(area.id.toString())}
                        className={`w-full flex items-center justify-between p-2 rounded transition-all text-left ${
                          selectedAreaIds.includes(area.id.toString())
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-sm">{area.name}</span>
                        {selectedAreaIds.includes(area.id.toString()) && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {scope === "plot" && selectedAreaIds.length > 0 && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <Label className="text-xs text-muted-foreground">
                  Ao nuôi
                  {selectedPlotIds.length > 0 && (
                    <span className="ml-1 text-primary font-medium">
                      ({selectedPlotIds.length})
                    </span>
                  )}
                </Label>
                <ScrollArea className="max-h-[200px] border rounded-lg p-2 bg-white">
                  <div className="space-y-1">
                    {selectedAreas.flatMap((area) => area.plots).map((plot) => (
                      <button
                        key={plot.id}
                        type="button"
                        onClick={() => togglePlot(plot.id)}
                        className={`w-full flex items-center justify-between p-2 rounded transition-all text-left ${
                          selectedPlotIds.includes(plot.id)
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-sm">{plot.name}</span>
                        {selectedPlotIds.includes(plot.id) && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "config",
      title: "Cấu hình phân bổ",
      description: "Thiết lập loài nuôi và số lượng",
      content: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 flex items-start gap-4">
            <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 shrink-0">
              <Fish className="w-6 h-6" />
            </div>
            <div className="text-emerald-900">
              <div className="font-bold text-lg mb-1">
                Bước 2: Cấu hình phân bổ thủy sản
              </div>
              <div className="text-sm opacity-90 leading-relaxed max-w-2xl">
                Chọn phương thức nuôi, thêm các nhóm giống và số lượng dự kiến
                cho từng ô nuôi.
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold text-slate-800">
              Phương thức nuôi
            </Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="h-11 bg-white border-slate-200">
                <SelectValue placeholder="Chọn phương thức nuôi" />
              </SelectTrigger>
              <SelectContent>
                {methodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <Label className="text-base font-semibold text-slate-800">
                  Nhóm giống
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Mỗi thẻ là một nhóm nuôi, có thể chỉnh tên ao, loài, số lượng và
                  trọng lượng trung bình.
                </p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                Đã thêm: {unitEntries.length}
              </Badge>
            </div>

            <div className="space-y-4">
              {unitEntries.map((entry) => (
                <Card
                  key={entry.id}
                  className="overflow-hidden border-slate-200 shadow-sm bg-white"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400 font-bold">
                          Nhóm giống {String(unitEntries.findIndex((item) => item.id === entry.id) + 1).padStart(2, "0")}
                        </div>
                        <div className="text-sm font-semibold text-slate-800 mt-1">
                          {entry.name || "Chưa đặt tên"}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-600 border-none"
                      >
                        {entry.species || "Chưa chọn loài"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="space-y-1.5 md:col-span-5">
                        <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          Tên ô nuôi
                        </Label>
                        <Input
                          className="h-11 bg-slate-50 border-slate-200 focus-visible:bg-white"
                          value={entry.name}
                          onChange={(e) =>
                            updateUnitEntry(entry.id, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-3">
                        <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          Loài nuôi
                        </Label>
                        <Select
                          value={entry.species}
                          onValueChange={(value) =>
                            updateUnitEntry(entry.id, "species", value)
                          }
                        >
                          <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {speciesOptions.map((species) => (
                              <SelectItem key={species} value={species}>
                                {species}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          Số lượng
                        </Label>
                        <Input
                          className="h-11 bg-slate-50 border-slate-200 focus-visible:bg-white"
                          type="number"
                          value={entry.quantity}
                          onChange={(e) =>
                            updateUnitEntry(
                              entry.id,
                              "quantity",
                              Number(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          Trọng lượng TB
                        </Label>
                        <Input
                          className="h-11 bg-slate-50 border-slate-200 focus-visible:bg-white"
                          type="number"
                          value={entry.averageWeight}
                          onChange={(e) =>
                            updateUnitEntry(
                              entry.id,
                              "averageWeight",
                              Number(e.target.value),
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeUnitEntry(entry.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa nhóm này
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addUnitEntry}
                className="h-11 border-dashed border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 justify-start"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm ô nuôi
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra toàn bộ thông tin",
      content: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-none shadow-sm bg-linear-to-br from-indigo-50 to-white ring-1 ring-indigo-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                  <Fish className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Tổng con giống
                  </div>
                  <div className="text-2xl font-bold text-indigo-700">
                    {totalStock.toLocaleString("vi-VN")}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-linear-to-br from-emerald-50 to-white ring-1 ring-emerald-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                  <Waves className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Nhóm giống
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {varieties.length}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-linear-to-br from-amber-50 to-white ring-1 ring-amber-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Phương thức
                  </div>
                  <div className="text-base font-bold text-amber-700">
                    {selectedMethodLabel}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-linear-to-br from-cyan-50 to-white ring-1 ring-cyan-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-cyan-600 shadow-sm border border-cyan-100">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Số ô/bè dự kiến
                  </div>
                  <div className="text-2xl font-bold text-cyan-700">
                    {plannedUnitCount}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-md ring-1 ring-slate-900/5">
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phạm vi</span>
                <Badge variant="outline">{scopeLabel}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vùng nuôi</span>
                <span className="font-medium">{selectedRegion?.name || "Chưa xác định"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Khu vực đã chọn</span>
                <span className="font-medium">
                  {selectedAreas.length > 0
                    ? `${selectedAreas.length} khu`
                    : "Chưa chọn"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ao nuôi đã chọn</span>
                <span className="font-medium">
                  {selectedPlots.length > 0
                    ? `${selectedPlots.length} ao`
                    : "Chưa chọn"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Số nhóm giống</span>
                <span className="font-medium">{unitEntries.length} nhóm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Trọng lượng TB</span>
                <span className="font-medium">
                  {averageWeight ? `${averageWeight.toFixed(1)} g` : "Chưa xác định"}
                </span>
              </div>
            </CardContent>
          </Card>

        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title="Tạo phân bổ thủy sản"
      description="Thiết lập phân bổ nuôi trồng thủy sản mới"
      actions={
        <Button variant="outline" onClick={goToList}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      }
    >
      <StepperForm
        steps={steps}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
};

export default AquacultureDistributionCreatePage;
