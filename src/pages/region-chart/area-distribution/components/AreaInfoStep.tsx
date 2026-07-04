import { useRegions } from "@/features/farm/hooks/useRegions";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { OrganizationSelector } from "@/pages/cultivation-zone/cultivation-region/components";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { AreaFormValues } from "../data/area-form.schema";
import { AreaRegionSelector, SelectedRegionCard } from "./AreaRegionSelector";
import React from "react";

export function AreaInfoStep() {
  const { control, watch, setValue } = useFormContext<AreaFormValues>();
  const enterpriseId = watch("enterpriseId");

  const { data: regionsData } = useRegions({
    params: { size: 100 }, // ideally we filter by workspaceId: enterpriseId
  });

  const regions = React.useMemo(() => {
    return (regionsData?.content || []).filter(
      (r) => String(r.metadataJson?.enterpriseId) === String(enterpriseId),
    );
  }, [regionsData, enterpriseId]);

  const { data: soilTypesData } = useCatalog("soil-types");
  const soilTypes = soilTypesData?.content || [];

  const { data: terrainFeaturesData } = useCatalog("terrain-features");
  const terrainFeatures = terrainFeaturesData?.content || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin khu vực</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <FormField
            control={control}
            name="enterpriseId"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-medium">
                  Đơn vị sở hữu <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <OrganizationSelector
                    selectedId={field.value}
                    onSelect={(value) => {
                      field.onChange(value);
                      setValue("regionId", undefined as any);
                      setValue("soilType", "");
                      setValue("terrainFeature", "");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="regionId"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Vùng trồng <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div>
                    <AreaRegionSelector
                      regions={regions as any}
                      enterpriseId={enterpriseId ? Number(enterpriseId) : null}
                      selectedId={field.value?.toString()}
                      onSelect={(id) => {
                        const region = regions.find(
                          (item) => item.id === Number(id),
                        );
                        field.onChange(Number(id));
                        if (region) {
                          setValue(
                            "soilType",
                            region.soilType?.id?.toString() || "",
                          );
                          setValue(
                            "terrainFeature",
                            region.terrainFeature?.id?.toString() || "",
                          );
                        }
                      }}
                    />

                    <div className="mt-1">
                      {field.value ? (
                        <SelectedRegionCard
                          regionId={field.value.toString()}
                          regions={regions as any}
                          onRemove={() => {
                            field.onChange(undefined);
                            setValue("soilType", "");
                            setValue("terrainFeature", "");
                          }}
                        />
                      ) : (
                        <div className="animate-in fade-in flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/50 px-4 py-6 text-center duration-500">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div className="text-[11px] font-bold text-slate-500">
                            Chưa chọn vùng trồng
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="code"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>
                  Mã khu vực <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="VD: KHU-A" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>
                  Tên khu vực <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Tên khu vực" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={control}
            name="acreage"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Diện tích (ha)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? undefined : parseFloat(val));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="soilType"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Loại đất</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại đất" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {soilTypes.map((land) => (
                      <SelectItem key={land.id} value={land.id.toString()}>
                        {land.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="terrainFeature"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Địa hình</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn địa hình" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {terrainFeatures.map((terrain) => (
                      <SelectItem
                        key={terrain.id}
                        value={terrain.id.toString()}
                      >
                        {terrain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
