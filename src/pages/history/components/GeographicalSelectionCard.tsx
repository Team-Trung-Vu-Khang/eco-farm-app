import React, { useState } from "react";
import { Badge, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronDown,
  ChevronRight,
  Layers,
  MapPin,
  Trash2,
} from "lucide-react";

interface GeographicalSelectionCardProps {
  codeName: string;
  onChangeLocation: () => void;
  onRemove: () => void;
}

export function GeographicalSelectionCard({
  codeName,
  onChangeLocation,
  onRemove,
}: GeographicalSelectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Parse path split by ' › ' or ' - '
  const parts = codeName
    .split(" › ")
    .map((s) => s.trim())
    .filter(Boolean);

  const regionName = parts[0] || codeName;
  const areaName = parts[1] || "";
  const plotName = parts[2] || "";

  const primaryType = plotName ? "Lô đất" : areaName ? "Khu vực" : "Vùng trồng";
  const mainTitle = plotName || areaName || regionName;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden animate-in fade-in duration-200">
      <div className="p-4">
        {/* Top Header */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-green-600 text-white shrink-0 shadow-xs">
            <MapPin className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold tracking-wider py-0 px-2 h-5 border-green-200 text-green-700 bg-green-50"
              >
                {primaryType}
              </Badge>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2.5 text-xs text-green-600 font-bold hover:bg-green-50 rounded-lg"
                  onClick={onChangeLocation}
                >
                  Thay đổi
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  onClick={onRemove}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="font-extrabold text-slate-900 text-sm truncate">
              {mainTitle}
            </div>
            {parts.length > 1 && (
              <div className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                {codeName}
              </div>
            )}
          </div>
        </div>

        {/* Tree hierarchy details with progressive indentation */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-green-600 transition-colors mb-2"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            <span>Phân cấp quản lý địa lý</span>
          </button>

          {isExpanded && (
            <div className="mt-4 relative space-y-4">
              {/* Level 1: Vùng trồng (Cấp 1 - Gốc) */}
              <div className="flex items-center gap-3 relative z-10 pl-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                    Vùng trồng
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {regionName}
                  </div>
                </div>
                {!areaName && !plotName && (
                  <Badge className="ml-auto bg-green-100 text-green-700 border-none text-[10px] font-bold">
                    Đã chọn vùng
                  </Badge>
                )}
              </div>

              {/* Level 2: Khu vực (Cấp 2 - Thụt vào 1 nấc) */}
              {areaName && (
                <div className="relative pl-6">
                  {/* Đường kết nối dọc & ngang từ Cấp 1 sang Cấp 2 */}
                  <div className="absolute left-6 w-4 h-px bg-slate-200 top-4" />
                  <div className="absolute left-6 -top-4 w-px h-8 bg-slate-200" />

                  <div className="flex items-center gap-3 relative z-10 pl-4 py-1">
                    <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center shrink-0 shadow-xs">
                      <Layers className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-green-600/70 font-bold uppercase tracking-wider leading-none mb-1">
                        Khu vực
                      </div>
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {areaName}
                      </div>
                    </div>
                    {!plotName && (
                      <Badge className="ml-auto bg-green-100 text-green-700 border-none text-[10px] font-bold">
                        Đã chọn khu
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Level 3: Lô đất (Cấp 3 - Thụt vào 2 nấc) */}
              {plotName && (
                <div className="relative pl-12">
                  {/* Đường kết nối dọc & ngang từ Cấp 2 sang Cấp 3 */}
                  <div className="absolute left-12 w-4 h-px bg-slate-200 top-4" />
                  <div className="absolute left-12 -top-4 w-px h-8 bg-slate-200" />

                  <div className="flex items-center gap-3 relative z-10 pl-4 py-1">
                    <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center shrink-0 shadow-xs">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-green-600/70 font-bold uppercase tracking-wider leading-none mb-1">
                        Lô đất
                      </div>
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {plotName}
                      </div>
                    </div>
                    <Badge className="ml-auto bg-green-100 text-green-700 border-none text-[10px] font-bold">
                      Đã chọn lô
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
