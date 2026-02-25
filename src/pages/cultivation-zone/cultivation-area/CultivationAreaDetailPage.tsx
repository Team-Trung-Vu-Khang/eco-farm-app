import { useLocation, useParams } from "wouter";
import {
  AdminLayout,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from "@tankhang1/eco-shared-ui";
import {
  ChevronLeft,
  Edit,
  Award,
  User,
  Sprout,
  Droplets,
  Leaf,
  FileText,
  Layers,
  Target,
  CheckCircle,
  MapPin,
} from "lucide-react";
import useCultivationAreaStore from "../../../stores/useCultivationAreaStore";
import useRegionStore from "../../../stores/useRegionStore";
import { useMemo } from "react";
import useEnterpriseCertificateStore from "../../../stores/useEnterpriseCertificateStore";
import usePersonnelStore from "../../../stores/usePersonnelStore";
import useFarmingMethodStore from "../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../stores/useIrrigationSystemStore";
import useVarietyStore from "../../../stores/useVarietyStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import useSeedStore from "../../../stores/useSeedStore";

const CultivationAreaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { getAreaById } = useCultivationAreaStore();
  const { getRegionById, regions } = useRegionStore();
  const { standards } = useEnterpriseCertificateStore();
  const { personnel } = usePersonnelStore();
  const { farmingMethods } = useFarmingMethodStore();

  const { irrigationSystems } = useIrrigationSystemStore();
  const { varieties } = useVarietyStore();
  const { enterprises } = useEnterpriseStore();

  const area = useMemo(() => {
    if (!id) return null;
    return getAreaById(id);
  }, [id, getAreaById]);

  const { seeds } = useSeedStore();

  const details = useMemo(() => {
    if (!area) return null;

    let manager = personnel.find((m) => m.id.toString() === area.managerId);
    let certificate = standards.find((c) => c.code === area.certificateId);

    // Flexible entity resolution
    const selectedEntities = area.targetIds
      .map((id) => {
        // Find Region
        const reg = regions.find((r) => r.id.toString() === id);
        if (reg)
          return {
            ...reg,
            type: "Vùng trồng",
            typeCode: "region",
            regionId: reg.id,
          };

        // Find Area
        for (const r of regions) {
          const sa = r.subAreas?.find((a: any) => a.id.toString() === id);
          if (sa)
            return {
              ...sa,
              type: "Khu vực",
              typeCode: "area",
              regionId: r.id,
              areaId: sa.id,
            };
        }

        // Find Plot
        for (const r of regions) {
          for (const sa of r.subAreas || []) {
            const p = sa.plots?.find((p: any) => p.id.toString() === id);
            if (p)
              return {
                ...p,
                type: "Lô đất",
                typeCode: "plot",
                regionId: r.id,
                areaId: sa.id,
                plotId: p.id,
              };
          }
        }
        return null;
      })
      .filter((e): e is any => e !== null);

    const firstEntity = selectedEntities[0];
    const region = firstEntity
      ? regions.find((r) => r.id.toString() === firstEntity.regionId)
      : null;

    const totalAreaValue = selectedEntities.reduce(
      (sum, e) => sum + (e.area || 0),
      0,
    );

    const groupedSelections = selectedEntities.reduce((acc: any, entity) => {
      const rId = entity.regionId.toString();
      const aId = entity.areaId?.toString() || "none";

      if (!acc[rId]) {
        acc[rId] = {
          region: regions.find((r) => r.id.toString() === rId),
          areas: {},
        };
      }

      if (!acc[rId].areas[aId]) {
        const reg = acc[rId].region;
        acc[rId].areas[aId] = {
          area:
            aId === "none"
              ? null
              : reg?.subAreas?.find((sa: any) => sa.id.toString() === aId),
          entities: [],
        };
      }

      acc[rId].areas[aId].entities.push(entity);
      return acc;
    }, {});

    // Map configurations for each entity
    const entityConfigs = selectedEntities.map((entity) => {
      const config =
        area.configs[entity.id] ||
        area.configs[entity.plotId] ||
        area.configs[entity.areaId] ||
        area.configs[entity.regionId] ||
        area.configs["region-main"]; // Fallback

      const farmingMethod = farmingMethods.find(
        (m) => m.id === config?.farmingMethodId,
      );
      const irrigationMethod = irrigationSystems.find(
        (m) => m.id === config?.irrigationMethodId,
      );
      const selectedCrops = varieties.filter((v) =>
        config?.selectedCrops?.includes(v.id),
      );

      return {
        entity,
        farmingMethod,
        irrigationMethod,
        crops: selectedCrops.map((crop) => ({
          ...crop,
          selectedSeeds: (config?.seedSelections?.[crop.id] || [])
            .map((sid) => seeds.find((s) => s.id === sid))
            .filter(Boolean),
        })),
      };
    });

    let enterprise = enterprises.find(
      (e) => e.id.toString() === area.enterpriseId,
    );

    return {
      manager,
      certificate,
      region,
      selectedEntities,
      groupedSelections,
      totalArea: totalAreaValue,
      entityConfigs,
      enterprise,
    };
  }, [
    area,
    getRegionById,
    regions,
    personnel,
    standards,
    farmingMethods,
    irrigationSystems,
    varieties,
    enterprises,
    seeds,
  ]);

  if (!area || !details) {
    return (
      <AdminLayout
        title="Không tìm thấy"
        description="Vùng canh tác không tồn tại"
      >
        <div className="flex flex-col items-center justify-center py-20">
          <Target className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-900">
            Không tìm thấy vùng canh tác
          </h2>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => setLocation("/cultivation-area")}
          >
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={area.name}
      description={`Mã: ${area.id} • Tạo: ${new Date(area.createdAt).toLocaleDateString("vi-VN")}`}
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/cultivation-area")}
          className="gap-2 text-muted-foreground hover:text-primary pl-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>

        <div className="flex gap-2">
          <Badge
            variant={area.status === "active" ? "default" : "secondary"}
            className="px-3 py-1"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            {area.status === "active" ? "Đang hoạt động" : "Tạm ngưng"}
          </Badge>
          <Button
            onClick={() => setLocation(`/cultivation-area/${area.id}/edit`)}
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 overflow-x-auto">
          <TabsTrigger value="overview">Thông tin</TabsTrigger>
          <TabsTrigger value="crops">Cây trồng</TabsTrigger>
          <TabsTrigger value="staff">Nhân viên</TabsTrigger>
          <TabsTrigger value="certificates">Chứng nhận</TabsTrigger>
          <TabsTrigger value="plans">Kế hoạch</TabsTrigger>
          <TabsTrigger value="statistics">Thống kê</TabsTrigger>
        </TabsList>

        {/* Overview Tab (Info) */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-lg">Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Tên vùng</div>
                  <div className="font-medium mt-1 text-slate-900">
                    {area.name}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Mã số</div>
                  <div className="font-mono mt-1 text-slate-900">{area.id}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Địa chỉ</div>
                  <div className="font-medium mt-1 text-slate-900">
                    {details.region?.address ||
                      details.enterprise?.address ||
                      "Đang cập nhật"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Phạm vi vùng canh tác
                  </div>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {area.scope === "region"
                      ? "Vùng trồng"
                      : area.scope === "area"
                        ? "Khu vực"
                        : "Lô đất"}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Tổng diện tích
                  </div>
                  <div className="font-medium mt-1 text-lg text-blue-600">
                    {details.totalArea} ha
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    DT canh tác
                  </div>
                  <div className="font-medium mt-1 text-lg text-green-600">
                    {/* Mock calculation or same as total if not specified */}
                    {(details.totalArea * 0.9).toFixed(1)} ha
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Cây trồng chính
                  </div>
                  <div className="font-medium mt-1 text-slate-900">
                    {Array.from(
                      new Set(
                        details.entityConfigs.flatMap((ec) =>
                          ec.crops.map((c) => c.crop),
                        ),
                      ),
                    ).join(", ") || "Chưa xác định"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Loại đất</div>
                  <div className="font-medium mt-1 text-slate-900">
                    {/* Mock data as it's not in store yet */}
                    Đất đỏ Bazan
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Hệ thống tưới
                  </div>
                  <div className="font-medium mt-1 text-slate-900">
                    {Array.from(
                      new Set(
                        details.entityConfigs
                          .map((ec) => ec.irrigationMethod?.name)
                          .filter(Boolean),
                      ),
                    ).join(", ") || "Chưa thiết lập"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Người quản lý
                  </div>
                  <div className="font-medium mt-1 text-slate-900">
                    {details.manager?.fullName || "Chưa phân công"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Ngày tạo</div>
                  <div className="font-medium mt-1 text-slate-900">
                    {new Date(area.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Trạng thái
                  </div>
                  <div className="mt-1">
                    <Badge
                      variant={
                        area.status === "active" ? "default" : "secondary"
                      }
                    >
                      {area.status === "active"
                        ? "Đang hoạt động"
                        : "Tạm ngưng"}
                    </Badge>
                  </div>
                </div>
              </div>

              {area.note && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">Ghi chú</div>
                  <p className="mt-1 text-slate-700">{area.note}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Context Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {details.enterprise && (
              <Card>
                <CardHeader className="border-b bg-slate-50 py-3">
                  <CardTitle className="text-base">Doanh nghiệp</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="font-semibold text-slate-900">
                    {details.enterprise.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {details.enterprise.code}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {details.enterprise.address}
                  </div>
                </CardContent>
              </Card>
            )}

            {details.selectedEntities.length > 0 && (
              <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="border-b bg-slate-50/50 py-3 px-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Phạm vi vùng canh tác ({
                      details.selectedEntities.length
                    }{" "}
                    mục)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="space-y-8">
                      {Object.values(details.groupedSelections).map(
                        (group: any) => (
                          <div key={group.region.id} className="relative">
                            {/* Region Level */}
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                                <MapPin className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-[10px] text-primary font-bold uppercase tracking-wider leading-none mb-1">
                                  Vùng trồng
                                </div>
                                <div className="text-sm font-bold text-slate-900">
                                  {group.region.name}
                                </div>
                              </div>
                            </div>

                            {/* Area & Plot Level Tree */}
                            <div className="ml-5 border-l-2 border-slate-100 pl-6 space-y-8">
                              {Object.values(group.areas).map(
                                (areaGroup: any) => (
                                  <div
                                    key={areaGroup.area?.id || "none"}
                                    className="relative"
                                  >
                                    {/* Horizontal branch from main stem to Area/Entity */}
                                    <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-5" />

                                    {areaGroup.area ? (
                                      <>
                                        <div className="flex items-center gap-3 mb-4 relative z-10">
                                          <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-sm">
                                            <Layers className="w-4.5 h-4.5" />
                                          </div>
                                          <div>
                                            <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider leading-none mb-1">
                                              Khu vực
                                            </div>
                                            <div className="text-sm font-bold text-slate-900">
                                              {areaGroup.area.name}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Plots under this Area */}
                                        <div className="ml-4.5 border-l-2 border-slate-100 pl-6 space-y-4">
                                          {areaGroup.entities
                                            .filter(
                                              (e: any) => e.typeCode === "plot",
                                            )
                                            .map((plot: any) => (
                                              <div
                                                key={plot.id}
                                                className="relative flex items-center gap-3 py-1"
                                              >
                                                <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                                <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center shadow-xs">
                                                  <Target className="w-4 h-4" />
                                                </div>
                                                <div>
                                                  <div className="text-[10px] text-green-600 font-bold uppercase tracking-wider leading-none mb-1">
                                                    Lô đất
                                                  </div>
                                                  <div className="text-xs font-bold text-slate-800">
                                                    {plot.name}
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          {areaGroup.entities.some(
                                            (e: any) => e.typeCode === "area",
                                          ) && (
                                            <div className="flex items-center gap-3 py-1 relative">
                                              <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                              <Badge
                                                variant="outline"
                                                className="text-[9px] uppercase font-bold border-blue-200 text-blue-600 bg-blue-50/50"
                                              >
                                                Đã chọn toàn bộ khu vực
                                              </Badge>
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    ) : (
                                      /* No Area (Region or direct Plot) */
                                      <div className="space-y-4">
                                        {areaGroup.entities.map(
                                          (entity: any) => (
                                            <div
                                              key={entity.id}
                                              className="relative flex items-center gap-3"
                                            >
                                              <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                              <div
                                                className={cn(
                                                  "w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs",
                                                  entity.typeCode === "region"
                                                    ? "bg-primary"
                                                    : "bg-green-500",
                                                )}
                                              >
                                                {entity.typeCode ===
                                                "region" ? (
                                                  <MapPin className="w-4 h-4" />
                                                ) : (
                                                  <Target className="w-4 h-4" />
                                                )}
                                              </div>
                                              <div>
                                                <div
                                                  className={cn(
                                                    "text-[10px] font-bold uppercase tracking-wider leading-none mb-1",
                                                    entity.typeCode === "region"
                                                      ? "text-primary"
                                                      : "text-green-600",
                                                  )}
                                                >
                                                  {entity.type}
                                                </div>
                                                <div className="text-xs font-bold text-slate-800">
                                                  {entity.name}
                                                </div>
                                              </div>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Crops & Configurations Tab */}
        <TabsContent value="crops" className="space-y-6">
          {details.entityConfigs.map((cfg) => (
            <Card key={cfg.entity.id} className="overflow-hidden">
              <CardHeader className="bg-slate-50 border-b py-3 px-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm",
                        cfg.entity.typeCode === "region"
                          ? "bg-primary"
                          : cfg.entity.typeCode === "area"
                            ? "bg-blue-500"
                            : "bg-green-500",
                      )}
                    >
                      {cfg.entity.typeCode === "region" ? (
                        <MapPin className="w-4 h-4" />
                      ) : cfg.entity.typeCode === "area" ? (
                        <Layers className="w-4 h-4" />
                      ) : (
                        <Target className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">
                        {cfg.entity.type}
                      </div>
                      <span className="font-bold">{cfg.entity.name}</span>
                    </div>
                  </CardTitle>
                  <div className="text-sm font-medium text-slate-600">
                    Diện tích: {cfg.entity.area || 0} ha
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Technical Configs */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      Cấu hình kỹ thuật
                    </div>
                    <div className="p-4 rounded-xl border bg-blue-50/20 border-blue-100/50 shadow-xs">
                      <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-3">
                        Hệ thống tưới tiêu
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <Droplets className="w-5 h-5" />
                        </div>
                        <div className="font-semibold text-slate-900">
                          {cfg.irrigationMethod?.name || "Chưa thiết lập"}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border bg-orange-50/20 border-orange-100/50 shadow-xs">
                      <div className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-3">
                        Phương pháp canh tác
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                          <Sprout className="w-5 h-5" />
                        </div>
                        <div className="font-semibold text-slate-900">
                          {cfg.farmingMethod?.name || "Chưa thiết lập"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Selected Crops */}
                  <div className="lg:col-span-8">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      Danh sách giống cây trồng ({cfg.crops.length})
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {cfg.crops.map((crop) => (
                        <div
                          key={crop.id}
                          className="flex items-center gap-3 p-3 border rounded-xl bg-white hover:border-primary/30 transition-all shadow-xs"
                        >
                          <div className="w-12 h-12 rounded-lg bg-slate-50 overflow-hidden shrink-0 border">
                            {crop.illustration ? (
                              <img
                                src={crop.illustration as string}
                                alt={crop.varietyName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Leaf className="w-5 h-5 text-slate-400 m-auto mt-3" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm truncate">
                              {crop.varietyName}
                            </div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                              {crop.crop}
                              {crop.seedType && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span>{crop.seedType}</span>
                                </>
                              )}
                            </div>
                            {crop.selectedSeeds &&
                              crop.selectedSeeds.length > 0 && (
                                <div className="mt-1.5 flex flex-wrap gap-1">
                                  {crop.selectedSeeds.map((seed: any) => (
                                    <Badge
                                      key={seed.id}
                                      variant="secondary"
                                      className="text-[9px] px-1.5 py-0 h-4 bg-primary/5 text-primary border-primary/10 font-normal whitespace-nowrap"
                                    >
                                      Hạt: {seed.varietyName}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {cfg.crops.length === 0 && (
                      <div className="py-8 text-center text-muted-foreground italic border border-dashed rounded-xl bg-slate-50/50">
                        Chưa chọn giống cây trồng
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Nhân sự quản lý
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {details.manager ? (
                <div className="flex items-start gap-4 p-4 border rounded-lg bg-primary/5 border-primary/20">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden text-2xl">
                    {details.manager.avatar ? (
                      <img
                        src={details.manager.avatar}
                        alt={details.manager.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      details.manager.fullName.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-slate-900">
                      {details.manager.fullName}
                    </div>
                    <div className="text-primary font-medium">
                      {details.manager.position}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {details.manager.department}
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-slate-600">
                      <span>Phone: {details.manager.phone || "N/A"}</span>
                      <span>Email: {details.manager.email || "N/A"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa phân công người quản lý
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-base">
                Danh sách nhân viên (Mẫu)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y">
                {/* Mock list since we don't have direct relation yet */}
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="py-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">
                          Nhân viên kỹ thuật {i + 1}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Bộ phận Kỹ thuật
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      0987 654 32{i}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600" />
                Chứng nhận tiêu chuẩn
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {details.certificate ? (
                <div className="border rounded-xl overflow-hidden">
                  <div className="bg-orange-50 p-4 border-b border-orange-100 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-orange-900">
                        {details.certificate.name}
                      </h3>
                      <p className="text-orange-700 text-sm">
                        {details.certificate.code}
                      </p>
                    </div>
                    <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-300">
                      Hoạt động
                    </Badge>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Tổ chức cấp
                      </div>
                      <div className="font-medium">
                        {details.certificate.organizations.join(", ")}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Ngày cấp
                      </div>
                      <div className="font-medium">01/01/2024</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Ngày hết hạn
                      </div>
                      <div className="font-medium">01/01/2025</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Trạng thái
                      </div>
                      <div className="font-medium text-green-600">
                        Còn hiệu lực
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Chưa có thông tin chứng nhận
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Kế hoạch canh tác
                </CardTitle>
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Mock plans */}
                {[
                  {
                    name: "Kế hoạch vụ Xuân 2025",
                    status: "active",
                    start: "15/01/2025",
                    end: "30/06/2025",
                    crop: "Sầu riêng",
                  },
                  {
                    name: "Kế hoạch cải tạo đất",
                    status: "completed",
                    start: "01/10/2024",
                    end: "31/12/2024",
                    crop: "N/A",
                  },
                ].map((plan, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition-shadow"
                  >
                    <div>
                      <div className="font-bold text-lg text-slate-900">
                        {plan.name}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Thời gian: {plan.start} - {plan.end}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{plan.crop}</Badge>
                      </div>
                    </div>
                    <Badge
                      variant={
                        plan.status === "active" ? "default" : "secondary"
                      }
                    >
                      {plan.status === "active"
                        ? "Đang thực hiện"
                        : "Hoàn thành"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Tổng diện tích",
                value: `${details.totalArea} ha`,
                icon: Layers,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                label: "Số lượng thực thể",
                value: details.selectedEntities.length || 1,
                icon: Target,
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                label: "Giống cây trồng",
                value: Array.from(
                  new Set(
                    details.entityConfigs.flatMap((ec) =>
                      ec.crops.map((c) => c.id),
                    ),
                  ),
                ).length,
                icon: Sprout,
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                label: "Cấu hình riêng",
                value: Object.keys(area.configs || {}).length,
                icon: FileText,
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {stat.label}
                      </div>
                      <div className="text-2xl font-bold text-slate-900">
                        {stat.value}
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters & Chart placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <Card>
                <CardHeader className="pb-3 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle>
                      Biểu đồ năng suất thu hoạch (Dữ liệu mẫu)
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" className="h-8">
                        Last 30 days
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-87.5 flex items-end justify-between gap-2 px-2">
                    {[45, 60, 30, 75, 50, 80, 65, 90, 70, 55, 60, 40].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center gap-2 group"
                        >
                          <div
                            className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded-t relative group-hover:bg-primary/60"
                            style={{ height: `${h}%` }}
                          ></div>
                          <span className="text-xs text-muted-foreground">
                            T{i + 1}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    Dữ liệu thống kê đang được cập nhật cho {area.name}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default CultivationAreaDetailPage;
