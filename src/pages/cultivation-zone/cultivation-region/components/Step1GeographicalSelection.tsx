import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers, User } from "lucide-react";
import { EnterpriseSelector } from "./EnterpriseSelector";
import { CultivationRegionSelector } from "./CultivationRegionSelector";
import { CultivationRegionInfoCard } from "./CultivationRegionInfoCard";
import useRegionStore from "../../../../stores/useRegionStore";

interface Step1GeographicalSelectionProps {
  enterpriseId: string;
  setEnterpriseId: (id: string) => void;
  cultivationRegionId: string;
  setCultivationRegionId: (id: string) => void;
  filteredCultivationRegions: any[];
  selectedCultivationRegion: any;
  geographicalUnits: any[];
  selectedScopeIds: string[];
  onScopeChange: (ids: string[]) => void;
  manager: any[];
  farmingMethod: any;
  irrigationMethod: any;
  selectedCropsData: any[];
  setPlants: React.Dispatch<React.SetStateAction<any[]>>;
}

export const Step1GeographicalSelection: React.FC<
  Step1GeographicalSelectionProps
> = ({
  enterpriseId,
  setEnterpriseId,
  cultivationRegionId,
  setCultivationRegionId,
  filteredCultivationRegions,
  selectedCultivationRegion,
  geographicalUnits,
  selectedScopeIds,
  onScopeChange,
  manager,
  farmingMethod,
  irrigationMethod,
  selectedCropsData,
  setPlants,
}) => {
  return (
    <div className="space-y-6 mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative overflow-hidden rounded-xl border border-green-200 bg-linear-to-r from-green-50 via-white to-green-50 p-5 shadow-sm">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-green-100 flex items-center justify-center text-green-600 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-green-900">
              Định vị vùng canh tác
            </h3>
            <p className="text-sm text-green-700/80">
              Chọn đơn vị sở hữu và vùng canh tác trước. Vị trí cụ thể của từng
              cây sẽ được chọn ở bước tiếp theo.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="grid md:grid-cols-2 gap-6 grid-col-1">
          <Card className="border-none shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Đơn vị sở hữu <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <EnterpriseSelector
                selectedId={enterpriseId}
                onSelect={(id) => {
                  setEnterpriseId(id);
                  setCultivationRegionId("");
                  setPlants((prev) =>
                    prev.map((p) => ({
                      ...p,
                      plotId: "",
                      coordinate: { lat: 11.548, lng: 106.896 },
                    })),
                  );
                }}
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Vùng canh tác <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <CultivationRegionSelector
                areas={filteredCultivationRegions}
                selectedId={cultivationRegionId}
                onSelect={(val) => {
                  setCultivationRegionId(val);
                  onScopeChange([]);
                  setPlants((prev) =>
                    prev.map((p) => ({
                      ...p,
                      plotId: "",
                      coordinate: { lat: 11.548, lng: 106.896 },
                    })),
                  );
                }}
                disabled={!enterpriseId}
              />
              {!enterpriseId && (
                <p className="text-xs text-muted-foreground italic">
                  Chọn đơn vị sở hữu trước để hiển thị các vùng canh tác.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <CultivationRegionInfoCard
          selectedCultivationRegion={selectedCultivationRegion}
          geographicalUnits={geographicalUnits}
          selectedScopeIds={selectedScopeIds}
          onScopeChange={(ids) => {
            onScopeChange(ids);
            setPlants((prev) =>
              prev.map((p) => ({
                ...p,
                plotId: "",
                coordinate: { lat: 11.548, lng: 106.896 },
              })),
            );
          }}
          manager={manager}
          farmingMethod={farmingMethod}
          irrigationMethod={irrigationMethod}
          selectedCropsData={selectedCropsData}
          regionStore={useRegionStore.getState()}
        />
      </div>
    </div>
  );
};
