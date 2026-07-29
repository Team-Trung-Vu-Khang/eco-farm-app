/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers } from "lucide-react";
import { CultivationRegionSelector } from "./CultivationRegionSelector";
import { CultivationRegionInfoCard } from "./CultivationRegionInfoCard";
import { GeographicalScopeCard } from "./GeographicalScopeCard";

interface Step1GeographicalSelectionProps {
  cultivationRegionId: string;
  setCultivationRegionId: (id: string) => void;
  filteredCultivationRegions: any[];
  selectedCultivationRegion: any;
  geographicalUnits: any[];
  selectedScopeIds: string[];
  onScopeChange: (ids: string[]) => void;
  manager?: any[];
  farmingMethod?: any;
  irrigationMethod?: any;
  selectedCropsData?: any[];
  areasByRegion?: Record<string, any[]>;
  plotsByArea?: Record<string, any[]>;
}

export const Step1GeographicalSelection: React.FC<
  Step1GeographicalSelectionProps
> = ({
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
  areasByRegion,
  plotsByArea,
}) => {
  const handleCultivationRegionSelect = (val: string) => {
    setCultivationRegionId(val);
    onScopeChange([]);
  };

  const handleScopeChange = (ids: string[]) => {
    onScopeChange(ids);
  };

  return (
    <div className="space-y-6 mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-xl border border-green-200 bg-linear-to-r from-green-50 via-white to-green-50 p-5 shadow-sm">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-green-100 flex items-center justify-center text-green-600 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-green-900">
              Định vị vùng nuôi trồng
            </h3>
            <p className="text-sm text-green-700/80">
              Chọn vùng nuôi trồng trước. Vị trí cụ thể của từng đối tượng nuôi
              sẽ được chọn ở bước tiếp theo.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
      </div>

      {/* Main content: left (selector + geo scope) | right (info) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Selector card */}
          <Card className="border-none shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Vùng nuôi trồng <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <CultivationRegionSelector
                areas={filteredCultivationRegions}
                selectedId={cultivationRegionId}
                onSelect={handleCultivationRegionSelect}
              />
            </CardContent>
          </Card>

          {/* Geographical scope card — shown only when a region is selected */}
          <GeographicalScopeCard
            selectedCultivationRegion={selectedCultivationRegion}
            geographicalUnits={geographicalUnits}
            selectedScopeIds={selectedScopeIds}
            onScopeChange={handleScopeChange}
            areasByRegion={areasByRegion}
            plotsByArea={plotsByArea}
          />
        </div>

        {/* Right column — info card */}
        <div className="min-w-0">
          <CultivationRegionInfoCard
            selectedCultivationRegion={selectedCultivationRegion}
            manager={manager}
            farmingMethod={farmingMethod}
            irrigationMethod={irrigationMethod}
            selectedCropsData={selectedCropsData}
          />
        </div>
      </div>
    </div>
  );
};
