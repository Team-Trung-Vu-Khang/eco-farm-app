import React, { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DataTable,
  useToast
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, MapPin, Box, Calendar, Tags, CheckCircle } from "lucide-react";
import useWarehouseStore from "../../stores/useWarehouseStore";
import useMaterialStore from "../../stores/useMaterialStore";
import usePesticideStore from "../../stores/usePesticideStore";
import useFertilizerStore from "../../stores/useFertilizerStore";

export default function CropMaterialInventoryPage() {
  const { toast } = useToast();
  const { areas, allocations, inventory, adjustStock } = useWarehouseStore();
  const { materials } = useMaterialStore();
  const { pesticides } = usePesticideStore();
  const { fertilizers } = useFertilizerStore();

  const [selectedAreaId, setSelectedAreaId] = useState<string>("");
  const [selectedAllocId, setSelectedAllocId] = useState<string>("");

  // Input states for adding crop material
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [materialCategory, setMaterialCategory] = useState<"pesticide" | "fertilizer" | "other">("other");
  const [quantity, setQuantity] = useState<string>("");
  const [unit, setUnit] = useState<string>("Chai");
  const [lotNumber, setLotNumber] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");

  const selectedArea = areas.find(a => a.id === selectedAreaId);
  const availableAllocations = allocations.filter(al => al.areaId === selectedAreaId);

  // Combine crop materials to let users choose
  const cropPesticides = pesticides.map(p => ({ id: `pes-${p.id}`, name: `[Thuốc] ${p.name}`, rawId: p.id, type: "pesticide" as const, unit: "Chai" }));
  const cropFertilizers = fertilizers.map(f => ({ id: `fer-${f.id}`, name: `[Phân bón] ${f.name}`, rawId: f.id, type: "fertilizer" as const, unit: "Bao" }));
  const cropOther = materials.map(m => ({ id: `oth-${m.id}`, name: `[Vật tư] ${m.name}`, rawId: m.id, type: "other" as const, unit: "Cái" }));
  const allCropMaterials = [...cropPesticides, ...cropFertilizers, ...cropOther];

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

    const selectedMat = allCropMaterials.find(m => m.id === selectedMaterialId);
    if (!selectedMat) return;

    adjustStock(
      selectedAllocId,
      selectedMat.rawId,
      "crop",
      qtyNum,
      unit,
      lotNumber || undefined,
      expiryDate || undefined
    );

    toast({
      title: "Thành công",
      description: `Đã khai báo tồn kho cho: ${selectedMat.name} (${qtyNum} ${unit})`
    });

    // Reset inputs
    setSelectedAreaId("");
    setSelectedAllocId("");
    setSelectedMaterialId("");
    setQuantity("");
    setLotNumber("");
    setExpiryDate("");
  };

  // Filter inventory list belonging to the selected area/allocation of type 'crop'
  const currentCropInventory = inventory
    .filter(inv => inv.materialType === "crop" && 
      (selectedAreaId ? allocations.find(al => al.id === inv.allocationId)?.areaId === selectedAreaId : true) &&
      (selectedAllocId ? inv.allocationId === selectedAllocId : true)
    )
    .map(inv => {
      // Find material detail
      let matName = "Vật tư không xác định";
      let matCode = "N/A";
      const pesticideItem = pesticides.find(p => p.id == inv.materialId);
      const fertilizerItem = fertilizers.find(f => f.id == inv.materialId);
      const otherItem = materials.find(m => m.id == inv.materialId);

      if (pesticideItem) {
        matName = `[Thuốc] ${pesticideItem.name}`;
        matCode = pesticideItem.code;
      } else if (fertilizerItem) {
        matName = `[Phân bón] ${fertilizerItem.name}`;
        matCode = fertilizerItem.code;
      } else if (otherItem) {
        matName = `[Vật tư] ${otherItem.name}`;
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
      title="Kho vật tư trồng trọt" 
      description="Quản lý tồn kho đầu kỳ, khai báo vị trí và khối lượng lưu trữ vật tư trồng trọt (Hạt giống, phân bón, thuốc BVTV)"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form: Initial Inventory Entry */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Box className="w-4 h-4 text-primary" /> Khai báo tồn kho đầu kỳ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              
              {/* Step 1: Warehouse Location */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Bước 1: Chọn vị trí kho</h4>
                <div className="space-y-2">
                  <Label>Khu vực kho <span className="text-red-500">*</span></Label>
                  <Select value={selectedAreaId} onValueChange={val => { setSelectedAreaId(val); setSelectedAllocId(""); }}>
                    <SelectTrigger className="h-10 text-slate-800">
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

              {/* Step 2: Crop Material Selection */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Bước 2: Chọn vật tư trồng trọt</h4>
                <div className="space-y-2">
                  <Label>Vật tư <span className="text-red-500">*</span></Label>
                  <Select value={selectedMaterialId} onValueChange={setSelectedMaterialId}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Chọn hạt giống, phân bón, thuốc..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allCropMaterials.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Step 3: Quantity & Conversions */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Bước 3: Nhập số lượng & quy cách</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Sản lượng <span className="text-red-500">*</span></Label>
                    <Input 
                      type="number" 
                      value={quantity} 
                      onChange={e => setQuantity(e.target.value)} 
                      placeholder="50" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Đơn vị</Label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Đơn vị" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bao">Bao</SelectItem>
                        <SelectItem value="Chai">Chai</SelectItem>
                        <SelectItem value="Gói">Gói</SelectItem>
                        <SelectItem value="Cái">Cái</SelectItem>
                        <SelectItem value="Tấn">Tấn</SelectItem>
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
                      placeholder="L-2026" 
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
                  className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700" 
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
                <Tags className="w-4 h-4 text-slate-500" /> Danh mục vật tư trồng trọt hiện trạng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <DataTable 
                columns={columns} 
                data={currentCropInventory} 
                searchPlaceholder="Lọc vật tư trồng trọt..."
              />
            </CardContent>
          </Card>
        </div>

      </div>
    </PageWrapper>
  );
}
