import {
  Button,
  Card,
  CardContent,
  Input,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Bug, Check, Search, Sprout } from "lucide-react";

import { seedData } from "../../data/mocks";
import type { CreateCropForm } from "../../types/types";

interface SeedSelectionStepProps {
  formData: CreateCropForm;
  seedSearch: string;
  setSeedSearch: (v: string) => void;
  handleUpdateField: (field: keyof CreateCropForm, value: any) => void;
}

export function SeedSelectionStep({
  formData,
  seedSearch,
  setSeedSearch,
  handleUpdateField,
}: SeedSelectionStepProps) {
  const filteredSeeds = seedData.filter(
    (seed) =>
      seed.varietyName.toLowerCase().includes(seedSearch.toLowerCase()) ||
      seed.varietyCode.toLowerCase().includes(seedSearch.toLowerCase()) ||
      seed.supplier.toLowerCase().includes(seedSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-linear-to-r from-amber-50 via-white to-amber-50 p-6">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Bug className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Danh sách hạt giống</h3>
            <p className="text-sm text-slate-500">
              Lựa chọn các loại hạt giống phù hợp để liên kết với cây trồng này
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
      </div>

      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Tìm tên giống, mã hoặc nhà cung cấp..."
            value={seedSearch}
            onChange={(e) => setSeedSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSeeds.length > 0 ? (
            filteredSeeds.map((seed) => (
              <Card
                key={seed.id}
                className={cn(
                  "group relative overflow-hidden transition-all hover:shadow-md cursor-pointer border-2",
                  formData.selectedSeedIds.includes(seed.id)
                    ? "border-green-600 ring-2 ring-green-600/10"
                    : "border-transparent"
                )}
                onClick={() => {
                  const current = formData.selectedSeedIds;
                  handleUpdateField(
                    "selectedSeedIds",
                    current.includes(seed.id)
                      ? current.filter((i) => i !== seed.id)
                      : [...current, seed.id]
                  );
                }}
              >
                <div className="aspect-4/3 overflow-hidden">
                  <img
                    src={seed.illustration}
                    alt={seed.varietyName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-green-700">{seed.varietyName}</h4>
                      <p className="text-[10px] text-muted-foreground font-mono uppercase">
                        MÃ: {seed.varietyCode}
                      </p>
                    </div>
                    {formData.selectedSeedIds.includes(seed.id) && (
                      <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Sprout className="w-3 h-3" />
                      <span>Nhà cung cấp: {seed.supplier}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 font-medium">
                      <span>
                        Tỷ lệ nảy mầm: <span className="text-green-600">{seed.germinationRate}</span>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-muted/20 border-2 border-dashed rounded-2xl border-muted-foreground/10">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <h4 className="text-lg font-bold text-foreground">Không tìm thấy hạt giống</h4>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
                Thử thay đổi từ khóa tìm kiếm hoặc kiểm tra lại tên giống, mã hạt giống.
              </p>
              <Button
                variant="ghost"
                className="mt-4 text-green-600 font-bold"
                onClick={() => setSeedSearch("")}
              >
                Xóa tìm kiếm
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
