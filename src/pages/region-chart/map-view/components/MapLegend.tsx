import React from "react";
import type { LayerVisibility } from "../types";

interface MapLegendProps {
  visibleLayers: LayerVisibility;
}

export const MapLegend: React.FC<MapLegendProps> = ({ visibleLayers }) => {
  return (
    <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow-lg z-1000 text-xs text-slate-700">
      <div className="font-semibold mb-2">Chú thích</div>
      <div
        className={`flex items-center gap-2 mb-1 ${visibleLayers.plant ? "opacity-100" : "opacity-40"}`}
      >
        <div className="w-3 h-3 rounded-full bg-green-500 border border-white shadow-sm"></div>{" "}
        Khỏe mạnh
      </div>
      <div
        className={`flex items-center gap-2 mb-1 ${visibleLayers.plant ? "opacity-100" : "opacity-40"}`}
      >
        <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white shadow-sm"></div>{" "}
        Thu hoạch
      </div>
      <div
        className={`flex items-center gap-2 mb-1 ${visibleLayers.plant ? "opacity-100" : "opacity-40"}`}
      >
        <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></div>{" "}
        Sâu bệnh
      </div>
      <div
        className={`flex items-center gap-2 mb-1 ${visibleLayers.zone ? "opacity-100" : "opacity-40"}`}
      >
        <div className="w-3 h-3 rounded-full bg-blue-500 border border-white shadow-sm"></div>
        Vùng
      </div>
      <div
        className={`flex items-center gap-2 mb-1 ${visibleLayers.area ? "opacity-100" : "opacity-40"}`}
      >
        <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></div>
        Khu vực
      </div>
      <div
        className={`flex items-center gap-2 ${visibleLayers.plot ? "opacity-100" : "opacity-40"}`}
      >
        <div className="w-3 h-3 rounded-full bg-green-500 border border-white shadow-sm"></div>
        Lô
      </div>
    </div>
  );
};
