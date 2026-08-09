import React, { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  DataTable,
  useToast
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Box, CheckCircle, Tags, ShieldAlert } from "lucide-react";
import useWarehouseStore from "../../stores/useWarehouseStore";
import useMaterialStore from "../../stores/useMaterialStore";
import usePesticideStore from "../../stores/usePesticideStore";

export default function LivestockMaterialInventoryPage() {
  const { toast } = useToast();
  const { areas, allocations, inventory, adjustStock } = useWarehouseStore();
  const { materials } = useMaterialStore();
  const { pesticides } = usePesticideStore();

  const [selectedAreaId, setSelectedAreaId] = useState<string>("");
  const [selectedAllocId, setSelectedAllocId] = useState<string>("");

  // Input states
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [unit, setUnit] = useState<string>("Bao");
  const [lotNumber, setLotNumber] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");

  const selectedArea = areas.find(a => a.id === selectedAreaId);
  const availableAllocations = allocations.filter(al => al.areaId === selectedAreaId);

  // Combine livestock-specific materials
  // In the real app, we filter by type/group. Let's filter materials whose group/type matches feeds/livestock, or show all with clear labels
  const livestockMeds = pesticides.map(p => ({ id: `med-${p.id}`, name: `[Thuốc/Vaccine] ${p.name}`, rawId: p.id, type: "medicine" as const, unit: "Lọ" }));
  const livestockMaterials = materials.map(m => ({ id: `oth-${m.id}`, name: `[Cám/Vật tư] ${m.name}`, rawId: m.id, type: "other" as const, unit: "Bao" }));
  const allLivestockMaterials = [...livestockMeds, ...livestockMaterials];

  const handleAddStock = () => {
    if (!selectedAreaId || !selectedAllocId || !selectedMaterialId || !quantity) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn vị trí kho, vật tư và số lượng",
        variant: "destructive"
      });
      return;
    }

    const qtyNum = parseFloat(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      toast({
        title: "Số lượng không hợp lệ",
        description: "Vui lòng nhập số lượng lớn hơn 0",
        variant: "destructive"
      });
      return;
    }

    const selectedMat = allLivestockMaterials.find(m => m.id === selectedMaterialId);
    if (!selectedMat) return;

    adjustStock(
      selectedAllocId,
      selectedMat.rawId,
      "livestock",
      qtyNum,
      unit,
      lotNumber || undefined,
      expiryDate || undefined
    );

    toast({
      title: "Thành công",
      description: `Đã khai báo tồn kho chăn nuôi cho: ${selectedMat.name} (${qtyNum} ${unit})`
    });

    setSelectedAreaId("");
    setSelectedAllocId("");
    setSelectedMaterialId("");
    setQuantity("");
    setLotNumber("");
    setExpiryDate("");
  };

  const currentLivestockInventory = inventory
    .filter(inv => inv.materialType === "livestock" && 
      (selectedAreaId ? allocations.find(al => al.id === inv.allocationId)?.areaId === selectedAreaId : true) &&
      (selectedAllocId ? inv.allocationId === selectedAllocId : true)
    )
    .map(inv => {
      let matName = "Vật tư không xác định";
      let matCode = "N/A";
      const medItem = pesticides.find(p => p.id == inv.materialId);
      const otherItem = materials.find(m => m.id == inv.materialId);

      if (medItem) {
        matName = `[Thuốc/Vaccine] ${medItem.name}`;
        matCode = medItem.code;
      } else if (otherItem) {
        matName = `[Cám/Vật tư] ${otherItem.name}`;
        matCode = otherItem.code;
      }

      const alloc = allocations.find(al => al.id === inv.allocationId);
      const area = areas.find(a => a.id === alloc?.areaId);

      const safeFormatDate = (dateStr?: string) => {
        if (!dateStr) return "N/A";
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString();
      };

      return {
        id: inv.id,
        code: matCode,
        name: matName,
        location: `${area?.name || ""} - ${alloc?.name || ""}`,
        quantity: `${inv.quantity} ${inv.unit}`,
        lotNumber: inv.lotNumber || "N/A",
        expiryDate: inv.expiryDate || "N/A",
        lastUpdated: safeFormatDate(inv.lastUpdated)
      };
    });

  const columns = [
    { key: "code", label: "Mã vật tư" },
    { key: "name", label: "Tên vật tư" },
    { key: "location", label: "Vị trí lưu trữ" },
    { key: "quantity", label: "Số lượng tồn" },
    { key: "lotNumber", label: "Số lô" },
    { key: "expiryDate", label: "Hạn sử dụng" },
    { key: "lastUpdated", label: "Cập nhật cuối" }
  ];

  return (
    <PageWrapper 
      title="Kho vật tư chăn nuôi" 
      description="Quản lý tồn kho chăn nuôi đầu kỳ, khai báo và theo dõi lưu trữ cám dinh dưỡng, thuốc thú y và chế phẩm sinh học"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form: Inventory Entry */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Box className="w-4 h-4 text-orange-600" /> Khai báo tồn kho đầu kỳ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Bước 1: Chọn vị trí kho</h4>
                <div className="space-y-2">
                  <Label>Khu vực kho <span className="text-red-500">*</span></Label>
                  <Select value={selectedAreaId} onValueChange={val => { setSelectedAreaId(val); setSelectedAllocId(""); }}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Chọn khu vực kho..." />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map(a => (
                        <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Phân bổ ô chứa / kệ chứa <span className="text-red-500">*</span></Label>
                  <Select value={selectedAllocId} onValueChange={setSelectedAllocId} disabled={!selectedAreaId}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Chọn vị trí kệ tủ..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAllocations.map(al => (
                        <SelectItem key={al.id} value={al.id}>{al.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Bước 2: Chọn vật tư chăn nuôi</h4>
                <div className="space-y-2">
                  <Label>Vật tư <span className="text-red-500">*</span></Label>
                  <Select value={selectedMaterialId} onValueChange={setSelectedMaterialId}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Chọn thức ăn, thuốc thú y, vaccine..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allLivestockMaterials.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Bước 3: Nhập số lượng & lô hàng</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Sản lượng <span className="text-red-500">*</span></Label>
                    <Input 
                      type="number" 
                      value={quantity} 
                      onChange={e => setQuantity(e.target.value)} 
                      placeholder="100" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Đơn vị</Label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Đơn vị" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bao">Bao (Feed)</SelectItem>
                        <SelectItem value="Lọ">Lọ (Vaccine)</SelectItem>
                        <SelectItem value="Hộp">Hộp (Medicine)</SelectItem>
                        <SelectItem value="Cái">Cái (Tool)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Số lô (Lot number)</Label>
                    <Input 
                      value={lotNumber} 
                      onChange={e => setLotNumber(e.target.value)} 
                      placeholder="L-CHANNUOI" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Hạn sử dụng</Label>
                    <Input 
                      type="date" 
                      value={expiryDate} 
                      onChange={e => setExpiryDate(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex-1 h-10" 
                  onClick={() => {
                    setSelectedAreaId("");
                    setSelectedAllocId("");
                    setSelectedMaterialId("");
                    setQuantity("");
                    setLotNumber("");
                    setExpiryDate("");
                  }}
                >
                  Hủy
                </Button>
                <Button 
                  type="button" 
                  className="flex-1 h-10 bg-orange-600 hover:bg-orange-700" 
                  onClick={handleAddStock}
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Xác nhận
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right Column: Inventory Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Tags className="w-4 h-4 text-slate-500" /> Danh mục vật tư chăn nuôi hiện trạng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <DataTable 
                columns={columns} 
                data={currentLivestockInventory} 
                searchPlaceholder="Lọc vật tư chăn nuôi..."
              />
            </CardContent>
          </Card>
        </div>

      </div>
    </PageWrapper>
  );
}
