import React, { useState } from "react";
import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search, Building2, Globe } from "lucide-react";

export interface CorporateEntity {
  id: "ecofarm" | "hoabinh" | "mekong";
  name: string;
  fullName: string;
  description: string;
}

export const corporateEntities: CorporateEntity[] = [
  {
    id: "ecofarm",
    name: "EcoFarm",
    fullName: "Công ty Cổ phần Nông nghiệp EcoFarm",
    description: "Chuyên doanh trồng trọt quy mô cao & VietGAP",
  },
  {
    id: "hoabinh",
    name: "HTX Hòa Bình",
    fullName: "Hợp tác xã Nông nghiệp Hòa Bình",
    description: "Liên kết nông hộ cây lâu năm xuất khẩu",
  },
  {
    id: "mekong",
    name: "Thủy sản Mekong",
    fullName: "Công ty TNHH MTV Thủy sản Mekong",
    description: "Nuôi trồng thủy hải sản công nghệ cao",
  },
];

interface EntitySidebarProps {
  selectedEntity: CorporateEntity | null;
  onSelectEntity: (entity: CorporateEntity | null) => void;
}

export const EntitySidebar: React.FC<EntitySidebarProps> = ({
  selectedEntity,
  onSelectEntity,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntities = corporateEntities.filter(
    (entity) =>
      entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border border-slate-100 shadow-xs bg-white rounded-xl h-full flex flex-col justify-between p-4 space-y-4">
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
          Hệ thống đơn vị thành viên
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm đơn vị..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold pl-8 pr-4 py-2 border border-slate-205 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 h-9"
          />
        </div>

        {/* Reset / All entities button */}
        <button
          onClick={() => onSelectEntity(null)}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-xs font-bold transition-all cursor-pointer ${
            selectedEntity === null
              ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs"
              : "text-slate-650 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Tất cả đơn vị</span>
        </button>

        {/* Entities list */}
        <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
          {filteredEntities.map((entity) => (
            <button
              key={entity.id}
              onClick={() => onSelectEntity(entity)}
              className={`w-full flex flex-col p-2.5 rounded-lg text-left transition-all border border-transparent cursor-pointer ${
                selectedEntity?.id === entity.id
                  ? "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-xs"
                  : "hover:bg-slate-50 text-slate-600 hover:text-slate-800"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                <Building2 className={`w-3.5 h-3.5 ${selectedEntity?.id === entity.id ? "text-indigo-600" : "text-slate-400"}`} />
                <span>{entity.name}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-1 leading-relaxed">
                {entity.description}
              </p>
            </button>
          ))}
          {filteredEntities.length === 0 && (
            <p className="text-center text-[11px] text-slate-400 py-6">
              Không tìm thấy đơn vị nào
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
