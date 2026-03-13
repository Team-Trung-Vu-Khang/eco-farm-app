import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from "@tankhang1/eco-shared-ui";
import {
  Award,
  CheckCircle,
  ChevronLeft,
  Droplets,
  Edit,
  FileText,
  Layers,
  Leaf,
  MapPin,
  Sprout,
  Target,
  User,
} from "lucide-react";
import type { CultivationRegion } from "../../../stores/useCultivationRegionStore";
import type { CultivationRegionDetails } from "./useCultivationRegionDetail";

type Props = {
  area: CultivationRegion;
  details: CultivationRegionDetails;
  onBack: () => void;
  onEdit: () => void;
};

const CultivationRegionDetailBody = ({ area, details, onBack, onEdit }: Props) => {
  return (
    <>
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
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
          <Button onClick={onEdit} className="gap-2">
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
                      new Set(details.technicalConfig.crops.map((c: any) => c.crop)),
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
                    {details.technicalConfig.irrigationMethod?.name ||
                      "Chưa thiết lập"}
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
                      variant={area.status === "active" ? "default" : "secondary"}
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
                  <CardTitle className="text-base">Đơn vị sở hữu</CardTitle>
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
                    Phạm vi vùng canh tác ({details.selectedEntities.length}{" "}
                    mục)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="space-y-8">
                      {Object.values(details.groupedSelections).map((group: any) => (
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
                          {area.scope !== "region" && (
                            <div className="ml-5 border-l-2 border-slate-100 pl-6 space-y-8">
                              {Object.values(group.areas).map((areaGroup: any) => (
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
                                          .filter((e: any) => e.typeCode === "plot")
                                          .map((plot: any) => (
                                            <div
                                              key={plot.id}
                                              className="relative flex items-center gap-3 py-1"
                                            >
                                              <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                              <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center shadow-xs">
                                                <Target className="w-4 h-4" />
                                              </div>
                                              <div className="flex-1">
                                                <div className="text-[10px] text-green-600 font-bold uppercase tracking-wider leading-none mb-1">
                                                  Lô đất
                                                </div>
                                                <div className="text-sm font-bold text-slate-900">
                                                  {plot.name}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex items-center gap-3 relative z-10 py-1">
                                      <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shadow-xs">
                                        <MapPin className="w-4.5 h-4.5" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">
                                          Vùng trồng
                                        </div>
                                        <div className="text-sm font-bold text-slate-900">
                                          {group.region.name}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Crops Tab */}
        <TabsContent value="crops" className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                Cấu hình cây trồng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {details.technicalConfig.crops.length === 0 ? (
                <div className="text-sm text-muted-foreground italic">
                  Chưa cấu hình cây trồng.
                </div>
              ) : (
                <div className="space-y-4">
                  {details.technicalConfig.crops.map((crop: any) => (
                    <div
                      key={crop.id}
                      className="border rounded-lg p-4 bg-white space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">
                            {crop.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {crop.crop}
                          </div>
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {crop.id}
                        </Badge>
                      </div>

                      {crop.selectedSeeds?.length > 0 && (
                        <div className="pt-2 border-t">
                          <div className="text-xs text-muted-foreground mb-2">
                            Hạt giống/Cây giống
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {crop.selectedSeeds.map((s: any) => (
                              <Badge
                                key={s?.id}
                                variant="secondary"
                                className="gap-1"
                              >
                                <Leaf className="w-3 h-3" />
                                {s?.name || s?.id}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Cấu hình theo đơn vị
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {details.entityConfigs.map((cfg: any) => (
                  <div key={cfg.entity.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          {cfg.entity.type}
                        </div>
                        <div className="font-bold text-slate-900">
                          {cfg.entity.name}
                        </div>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        {cfg.entity.id}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="rounded-lg bg-slate-50 p-3 border">
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <Leaf className="w-3.5 h-3.5 text-primary" />
                          Cây trồng
                        </div>
                        <div className="mt-2 text-sm">
                          {cfg.crops?.length
                            ? cfg.crops.map((c: any) => c.name).join(", ")
                            : "Chưa thiết lập"}
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3 border">
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <Droplets className="w-3.5 h-3.5 text-primary" />
                          Tưới tiêu
                        </div>
                        <div className="mt-2 text-sm">
                          {cfg.irrigationMethod?.name || "Chưa thiết lập"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Nhân sự phụ trách
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg border p-4">
                  <div className="text-xs text-muted-foreground mb-2">
                    Người quản lý
                  </div>
                  <div className="font-bold text-slate-900">
                    {details.manager?.fullName || "Chưa phân công"}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {details.manager?.phone || ""}
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-xs text-muted-foreground mb-2">
                    Đơn vị sở hữu
                  </div>
                  <div className="font-bold text-slate-900">
                    {details.enterprise?.name || "Đang cập nhật"}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {details.enterprise?.code || ""}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Chứng nhận đạt được
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {details.selectedCerts.length === 0 ? (
                <div className="text-sm text-muted-foreground italic">
                  Chưa có chứng nhận.
                </div>
              ) : (
                <div className="space-y-3">
                  {details.selectedCerts.map((c: any) => (
                    <div
                      key={c.code}
                      className="border rounded-lg p-4 bg-white"
                    >
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {c.code}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Kế hoạch canh tác
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground italic">
                Chưa có kế hoạch.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Thống kê
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground italic">
                Đang cập nhật.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CultivationRegionDetailBody;
