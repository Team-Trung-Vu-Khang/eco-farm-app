import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search, X } from "lucide-react";

type EnterpriseOption = {
  id: string | number;
  name: string;
};

type ProvinceOption = {
  code: string;
  name: string;
};

type DistrictOption = {
  code: string;
  name: string;
};

type CultivationZoneDialogFilterPanelProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  entFilter: string;
  onEntFilterChange: (value: string) => void;
  provFilter: string;
  onProvFilterChange: (value: string) => void;
  distFilter: string;
  onDistFilterChange: (value: string) => void;
  enterprises: EnterpriseOption[];
  provinceOptions: ProvinceOption[];
  districtOptions: DistrictOption[];
  onResetFilters: () => void;
};

export function CultivationZoneDialogFilterPanel({
  searchTerm,
  onSearchTermChange,
  entFilter,
  onEntFilterChange,
  provFilter,
  onProvFilterChange,
  distFilter,
  onDistFilterChange,
  enterprises,
  provinceOptions,
  districtOptions,
  onResetFilters,
}: CultivationZoneDialogFilterPanelProps) {
  return (
    <div className="space-y-4 border-b bg-white px-8 py-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Tìm tên vùng hoặc mã số..."
            className="h-12 rounded-2xl border-slate-100 bg-slate-50 pl-12 text-base transition-all focus:bg-white"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
          />
        </div>
        <Button
          variant="ghost"
          className="h-12 gap-2 rounded-2xl text-slate-500 transition-colors hover:text-primary"
          onClick={onResetFilters}
        >
          <X size={18} />
          Đặt lại lọc
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <label className="ml-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Đơn vị sở hữu
          </label>
          <Select value={entFilter} onValueChange={onEntFilterChange}>
            <SelectTrigger className="h-11 rounded-xl border-slate-100 bg-slate-50">
              <SelectValue placeholder="Tất cả doanh nghiệp" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="all">Tất cả doanh nghiệp</SelectItem>
              {enterprises.map((enterprise) => (
                <SelectItem key={enterprise.id} value={enterprise.id.toString()}>
                  {enterprise.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="ml-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Tỉnh thành
          </label>
          <Select value={provFilter} onValueChange={onProvFilterChange}>
            <SelectTrigger className="h-11 rounded-xl border-slate-100 bg-slate-50">
              <SelectValue placeholder="Tất cả tỉnh thành" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="all">Tất cả tỉnh thành</SelectItem>
              {provinceOptions.map((province) => (
                <SelectItem key={province.code} value={province.code}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="ml-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Quận huyện
          </label>
          <Select value={distFilter} onValueChange={onDistFilterChange}>
            <SelectTrigger className="h-11 rounded-xl border-slate-100 bg-slate-50">
              <SelectValue placeholder="Tất cả quận huyện" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="all">Tất cả quận huyện</SelectItem>
              {districtOptions.map((district) => (
                <SelectItem key={district.code} value={district.code}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
