import { Award, MapPin, ScrollText, Sprout } from "lucide-react";
import {
  Badge,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CertificateSelector,
  EnterpriseSelector,
  GeographicalSelector,
  ManagerSelector,
  SelectionCard,
} from "./index";
import type { GeographicalSelection } from "./types";

type Props = {
  name: string;
  note: string;
  selectedEnterpriseId: string;
  selections: GeographicalSelection[];
  selectedCertIds: string[];
  selectedManagerIds: string[];
  selectedRegion?: {
    cropVarieties?: Array<{
      id: string;
      name: string;
      variety: string;
      seedType?: string;
    }>;
  } | null;
  regions: Array<{
    id: string | number;
    name: string;
    subAreas?: Array<{
      id: string | number;
      name: string;
      plots?: Array<{ id: string; name: string }>;
    }>;
  }>;
  setName: (value: string) => void;
  setNote: (value: string) => void;
  onSelectEnterprise: (value: string) => void;
  onConfirmSelections: (value: GeographicalSelection[]) => void;
  onToggleCertificate: (id: string) => void;
  onSelectManagers: (ids: string[]) => void;
  enterpriseDisabled?: boolean;
  showEnterprise?: boolean;
};

export const CultivationRegionCreateGeneralInfoStep = ({
  name,
  note,
  selectedEnterpriseId,
  selections,
  selectedCertIds,
  selectedManagerIds,
  selectedRegion,
  regions,
  setName,
  setNote,
  onSelectEnterprise,
  onConfirmSelections,
  onToggleCertificate,
  onSelectManagers,
  enterpriseDisabled = false,
  showEnterprise = false,
}: Props) => {
  const groupedSelections = selections.reduce<
    Record<string, GeographicalSelection[]>
  >((acc, selection) => {
    const key = selection.areaId || selection.regionId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(selection);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <ScrollText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-800">Thông tin cơ bản</h3>
          </div>

          <div className="space-y-4">
            <Label htmlFor="name" className="text-sm font-medium">
              Tên vùng chăn nuôi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Vùng chăn nuôi heo công nghệ cao"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-10 border-slate-300 focus:border-primary focus:ring-primary/20"
            />

            {showEnterprise && (
              <>
                <Label className="text-sm font-medium">
                  Đơn vị sở hữu <span className="text-red-500">*</span>
                </Label>
                <EnterpriseSelector
                  disabled={enterpriseDisabled}
                  selectedId={selectedEnterpriseId}
                  onSelect={onSelectEnterprise}
                />
              </>
            )}

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700">
                  Phạm vi địa lý <span className="text-red-500">*</span>
                </Label>
                {selections.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-none"
                  >
                    {selections.length} lựa chọn
                  </Badge>
                )}
              </div>

              <GeographicalSelector
                regions={regions}
                showEnterprise={showEnterprise}
                enterpriseId={selectedEnterpriseId}
                existingSelections={selections}
                onConfirm={onConfirmSelections}
              />

              <div className="grid grid-cols-1 gap-4 mt-2">
                {Object.entries(groupedSelections).map(([key, items]) => {
                  const first = items[0];

                  return (
                    <SelectionCard
                      key={key}
                      regionId={first.regionId}
                      areaId={first.areaId}
                      items={items}
                      regions={regions}
                      onRemove={(ids) => {
                        onConfirmSelections(
                          selections.filter((selection) => !ids.includes(selection.id)),
                        );
                      }}
                    />
                  );
                })}

                {selections.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50 text-center gap-2 animate-in fade-in duration-500">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-300">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-600">
                        Chưa có lựa chọn nào
                      </div>
                      <div className="text-[11px] text-slate-400 max-w-50 mx-auto mt-1">
                        Vui lòng thêm vị trí để tiếp tục
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2 pt-2">
              <Label className="text-sm font-medium">Ghi chú</Label>
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Nhập thông tin ghi chú thêm..."
                className="min-h-20 border-slate-300 resize-none hover:border-slate-400 focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-800">
              Nhân sự phụ trách
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Nhân viên chịu trách nhiệm
              </Label>
              <ManagerSelector
                selectedIds={selectedManagerIds}
                onSelect={onSelectManagers}
              />
            </div>

            {selectedRegion?.cropVarieties &&
              selectedRegion.cropVarieties.length > 0 && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex gap-3 text-sm text-green-800 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-green-100 p-1.5 rounded-full h-fit">
                    <Sprout className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">
                      Vật nuôi chủ lực của vùng
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedRegion.cropVarieties.map((crop) => (
                        <Badge
                          key={crop.id}
                          variant="outline"
                          className="bg-white text-green-700 border-green-200"
                        >
                          {crop.name} - {crop.variety}
                          {crop.seedType && (
                            <span className="ml-1 text-[10px] text-green-600/70 font-normal">
                              ({crop.seedType})
                            </span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
