import { useState } from "react";
import { Badge, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search, MapPin, Eye, Layers } from "lucide-react";
import { FarmerZone } from "../constants";

interface FarmerZoneDataTableProps {
  zones: FarmerZone[];
  selectedZoneId: string;
  onSelectZone: (zoneId: string) => void;
}

export function FarmerZoneDataTable({
  zones,
  selectedZoneId,
  onSelectZone,
}: FarmerZoneDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredZones = zones.filter((zone) =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border-4 border-white overflow-hidden flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/70 border-b gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-xs uppercase tracking-widest text-slate-700">
            Danh sách vùng canh tác của Nông hộ
          </span>
          <Badge variant="outline" className="font-bold bg-white text-emerald-700 border-emerald-200">
            {filteredZones.length} vùng canh tác
          </Badge>
        </div>

        {/* Search input for table */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm vùng canh tác..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-white pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3 px-4">Tên Vùng Canh Tác</th>
              <th className="py-3 px-4">Phạm vi Địa lý</th>
              <th className="py-3 px-4">Tổng Diện Tích</th>
              <th className="py-3 px-4">Số Khu Vực</th>
              <th className="py-3 px-4">Trạng Thái</th>
              <th className="py-3 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredZones.map((zone) => {
              const isSelected = zone.id === selectedZoneId;
              return (
                <tr
                  key={zone.id}
                  className={`transition-colors hover:bg-slate-50 ${
                    isSelected ? "bg-emerald-50/60 font-semibold" : ""
                  }`}
                >
                  <td className="py-3 px-4 text-slate-900">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{zone.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{zone.description}</td>
                  <td className="py-3 px-4 text-slate-800 font-bold">
                    {zone.totalAreaHa} ha
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {zone.areas.length} khu vực
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      {zone.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      className={`h-7 px-3 text-xs font-semibold rounded-md ${
                        isSelected ? "bg-emerald-600 text-white" : ""
                      }`}
                      onClick={() => onSelectZone(zone.id)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      {isSelected ? "Đang chọn" : "Xem trên bản đồ"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
