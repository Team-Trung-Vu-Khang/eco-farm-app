import useEnterpriseStore from "@/stores/useEnterpriseStore";
import {
  Badge,
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tankhang1/eco-shared-ui";
import { Briefcase, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

export const EnterpriseSelector = ({
  selectedId,
  onSelect,
  disabled,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [tempSelectedId, setTempSelectedId] = useState(selectedId);

  const { enterprises } = useEnterpriseStore();
  const selectedEnterprise = enterprises.find(
    (e) => e.id.toString() === selectedId,
  );

  const filteredEnterprises = useMemo(() => {
    return enterprises.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || e.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, typeFilter, enterprises]);

  const handleConfirm = () => {
    onSelect(tempSelectedId);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSelectedId(selectedId);
    setIsOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          "group border rounded-lg p-3 transition-all min-h-10 flex items-center",
          selectedEnterprise
            ? "bg-white border-slate-200"
            : "bg-slate-50 border-dashed border-slate-300",
          disabled
            ? "cursor-default opacity-80"
            : "hover:shadow-sm cursor-pointer",
        )}
        onClick={() => {
          if (disabled) return;
          setTempSelectedId(selectedId);
          setIsOpen(true);
        }}
      >
        {selectedEnterprise ? (
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden shadow-sm">
                {selectedEnterprise.image ? (
                  <img
                    src={selectedEnterprise.image}
                    alt={selectedEnterprise.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Briefcase className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] py-0 h-4 bg-primary/5 text-primary border-primary/20"
                  >
                    {selectedEnterprise.code}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-[10px] py-0 h-4 bg-slate-100 capitalize font-medium"
                  >
                    {selectedEnterprise.type}
                  </Badge>
                </div>
                <div className="font-bold text-slate-900 text-base leading-tight mb-1">
                  {selectedEnterprise.name}
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <span className="font-medium text-slate-500">MST:</span>
                  <span>{selectedEnterprise.taxCode}</span>
                </div>
              </div>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 text-slate-400 group-hover:text-primary p-0 rounded-full hover:bg-primary/10"
                >
                  <Search className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 pt-3 border-t border-slate-100">
              <div className="flex items-start gap-2.5 text-xs text-slate-600">
                <div className="bg-slate-100 p-1 rounded-md shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="leading-relaxed">
                  <span className="font-medium text-slate-800 mr-1">
                    Địa chỉ:
                  </span>
                  {selectedEnterprise.address}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full gap-3 text-muted-foreground group-hover:text-primary transition-all py-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Search className="w-6 h-6 opacity-40 group-hover:opacity-100" />
            </div>
            <div className="text-sm font-semibold">
              Bấm để chọn đơn vị sở hữu
            </div>
            <div className="text-[11px] opacity-60">
              Thông tin liên hệ và mã số thuế sẽ được tự động cập nhật
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) handleCancel();
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Đơn vị sở hữu
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Tìm theo tên, mã đơn vị..."
                  className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-max sm:w-45 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Loại hình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại hình</SelectItem>
                  <SelectItem value="enterprise">Doanh nghiệp</SelectItem>
                  <SelectItem value="farm">Trang trại</SelectItem>
                  <SelectItem value="cooperative">Hợp tác xã</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-100 border rounded-xl bg-slate-50/50">
              <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredEnterprises.map((e) => (
                  <div
                    key={e.id}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border shadow-xs hover:shadow-md ${
                      tempSelectedId === e.id.toString()
                        ? "bg-primary/5 border-primary ring-1 ring-primary/20"
                        : "bg-white border-slate-200 hover:border-primary/40"
                    }`}
                    onClick={() => setTempSelectedId(e.id.toString())}
                  >
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden shadow-sm">
                      {e.image ? (
                        <img
                          src={e.image}
                          alt={e.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Briefcase className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-slate-900 leading-tight mb-1 line-clamp-2 min-h-10">
                        {e.name}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        <Badge
                          variant="secondary"
                          className="text-[10px] py-0 px-1.5 font-mono h-4"
                        >
                          {e.code}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 px-1.5 h-4 bg-slate-50 capitalize"
                        >
                          {e.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-1">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          tempSelectedId === e.id.toString()
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {tempSelectedId === e.id.toString() && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredEnterprises.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <Search className="w-6 h-6 text-slate-300" />
                    </div>
                    <div className="text-sm">Không tìm thấy đơn vị phù hợp</div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="flex items-center justify-end gap-3 border-t pt-4">
            <Button variant="outline" onClick={handleCancel} className="px-6">
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              className="px-6"
              disabled={!tempSelectedId}
            >
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
