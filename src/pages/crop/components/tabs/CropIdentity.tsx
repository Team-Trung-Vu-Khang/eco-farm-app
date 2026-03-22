import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Hash, Image as ImageIcon, Sprout } from "lucide-react";
import { harvestMethodOptions } from "../../data/mocks";
import type { Crop } from "../../types/types";

interface CropIdentityProps {
  crop: Crop;
}

export function CropIdentity({ crop }: CropIdentityProps) {
  return (
    <Card className="border-none shadow-lg shadow-slate-200/40 bg-white rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-[280px] shrink-0">
            <div className="w-full h-[180px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative group">
              {crop.illustration ? (
                <img
                  src={crop.illustration}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={crop.name}
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-slate-300">
                  <ImageIcon className="w-10 h-10 mb-2" />
                  <span className="text-xs font-medium">No Image</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col h-full justify-center space-y-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                  {crop.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 text-xs font-bold transition-colors">
                    {crop.cropGroup}
                  </Badge>
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 text-xs font-bold transition-colors">
                    {crop.cropType}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-16 gap-y-6 pt-2 border-t border-slate-50">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Mã cây trồng
                  </p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-slate-100/80 flex items-center justify-center text-slate-500">
                      <Hash className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-mono text-sm font-bold text-slate-700">
                      {crop.code}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Phương pháp thu hoạch
                  </p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Sprout className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {harvestMethodOptions.find(
                        (opt) => opt.value === crop.harvestMethod,
                      )?.label || crop.harvestMethod}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
