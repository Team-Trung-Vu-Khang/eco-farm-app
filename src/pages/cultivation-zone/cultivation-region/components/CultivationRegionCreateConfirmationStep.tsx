import {
  CheckCircle2,
  Droplets,
  Layers,
  Leaf,
  MapPin,
  ScrollText,
  Sprout,
} from "lucide-react";
import { Badge, Card } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { CultivationRegionTargetEntity } from "../hooks/useCultivationRegionCreatePage";

type VarietySummary = {
  id: number;
  name: string;
  code: string;
  seeds?: Array<{ id: number; name: string }>;
};

type CropSummaryItem = {
  cropId: number;
  cropName: string;
  cropCode: string;
  checkedVarieties: VarietySummary[];
};

type Props = {
  name: string;
  note: string;
  entities: CultivationRegionTargetEntity[];
  selectedManagers: Array<{
    id: string | number;
    fullName: string;
    avatar?: string;
  }>;
  selectedCerts: Array<{
    code: string;
    name: string;
  }>;
  farmingMethodId: string;
  irrigationMethodId: string;
  farmingMethods: Array<{ id: string; name: string }>;
  irrigationSystems: Array<{ id: string; name: string }>;
  cropSummary: CropSummaryItem[];
  title?: string;
  description?: string;
};

export const CultivationRegionCreateConfirmationStep = ({
  name,
  note,
  entities,
  selectedManagers,
  selectedCerts,
  farmingMethodId,
  irrigationMethodId,
  farmingMethods,
  irrigationSystems,
  cropSummary,
  title = "Xác nhận thông tin",
  description = "Vui lòng kiểm tra kỹ các thông tin dưới đây. Sau khi xác nhận, hệ thống sẽ tiến hành khởi tạo vùng canh tác mới.",
}: Props) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm relative z-10">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 z-10 relative">
          {title}
        </h3>
        <p className="text-green-700/80 mt-2 z-10 relative max-w-lg mx-auto">
          {description}
        </p>

        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-600 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-slate-500" />
            <h4 className="font-semibold text-slate-800">Thông tin chung</h4>
          </div>
          <div className="p-0">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-4 text-muted-foreground w-1/3">
                    Tên hiển thị
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {name || "Chưa đặt tên"}
                  </td>
                </tr>
                {selectedManagers.length > 0 && (
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-muted-foreground">
                      Nhân sự chịu trách nhiệm
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-3">
                        {selectedManagers.map((manager) => (
                          <div
                            key={manager.id}
                            className="flex items-center gap-2 bg-slate-50/50 pr-3 rounded-full border border-slate-100 h-8"
                          >
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden shrink-0">
                              {manager.avatar ? (
                                <img
                                  src={manager.avatar}
                                  alt={manager.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                manager.fullName.charAt(0)
                              )}
                            </div>
                            <span className="font-medium text-xs">
                              {manager.fullName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
                {selectedCerts.length > 0 && (
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-muted-foreground">
                      Tiêu chuẩn chứng nhận
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedCerts.map((cert) => (
                          <Badge
                            key={cert.code}
                            variant="outline"
                            className="text-xs border-green-200 text-green-700 bg-green-50"
                          >
                            {cert.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-500" />
            <h4 className="font-semibold text-slate-800">
              Phạm vi địa lý ({entities.length} mục)
            </h4>
          </div>
          <div className="p-4 flex flex-wrap gap-2 text-sm">
            {entities.map((entity) => (
              <div
                key={entity.id}
                className="px-3 py-2 rounded-lg border bg-white shadow-sm flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase leading-none">
                    {entity.type}
                  </span>
                  <span className="font-medium text-slate-900">
                    {entity.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-slate-500" />
            <h4 className="font-semibold text-slate-800">
              Cấu hình canh tác áp dụng
            </h4>
          </div>
          <div className="p-6 space-y-6">
            {/* Farming method + Irrigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <ScrollText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                    Phương pháp canh tác
                  </div>
                  <div className="font-bold text-slate-900">
                    {farmingMethods.find((m) => m.id === farmingMethodId)
                      ?.name || (
                      <span className="text-red-500 italic">Chưa chọn</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                    Hệ thống tưới tiêu
                  </div>
                  <div className="font-bold text-slate-900">
                    {irrigationSystems.find((s) => s.id === irrigationMethodId)
                      ?.name || (
                      <span className="text-slate-400 italic text-sm">
                        Chưa chọn
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3-level crop summary */}
            <div className="pt-4 border-t border-slate-100">
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-600" />
                Cây trồng &amp; Giống ({cropSummary.length} cây trồng)
              </div>

              {cropSummary.length === 0 ? (
                <span className="text-red-500 italic text-sm">
                  Chưa chọn cây trồng
                </span>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cropSummary.map((crop) => (
                    <div
                      key={crop.cropId}
                      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                    >
                      {/* Crop header */}
                      <div className="flex items-center gap-2 px-4 py-3 bg-green-50/60 border-b border-slate-100">
                        <div className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center shrink-0">
                          <Leaf className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        <span className="font-semibold text-sm text-slate-800">
                          {crop.cropName}
                        </span>
                        {crop.cropCode && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({crop.cropCode})
                          </span>
                        )}
                        <Badge
                          variant="secondary"
                          className="ml-auto text-[10px]"
                        >
                          {crop.checkedVarieties.length} giống đã chọn
                        </Badge>
                      </div>

                      {/* Varieties */}
                      {crop.checkedVarieties.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-muted-foreground italic">
                          Chưa chọn giống cây trồng nào
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {crop.checkedVarieties.map((variety) => (
                            <div
                              key={variety.id}
                              className="px-4 py-2.5 flex flex-col gap-1.5"
                            >
                              <div className="flex items-center gap-2 min-w-40">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                                <span className="text-sm font-semibold text-slate-700">
                                  {variety.name}
                                </span>
                                {variety.code && (
                                  <span className="text-xs text-muted-foreground font-normal">
                                    ({variety.code})
                                  </span>
                                )}
                              </div>
                              {variety.seeds && variety.seeds.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pl-3.5 mt-0.5">
                                  {variety.seeds.map((seed: any) => (
                                    <Badge
                                      key={seed.id}
                                      variant="outline"
                                      className="bg-slate-50 border-slate-200 text-slate-500 text-[10px] py-0.5 px-2 rounded font-normal shadow-2xs"
                                    >
                                      Hạt giống: {seed.name}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {note && (
        <div className="mt-6 bg-yellow-50/50 border border-yellow-200/60 p-4 rounded-lg text-sm text-yellow-800">
          <span className="font-semibold mr-1">Ghi chú:</span> {note}
        </div>
      )}
    </div>
  );
};
