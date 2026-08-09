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
  useToast,
  DataTable,
  Badge
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Upload, CheckCircle, Package, History, AlertTriangle, FileText, Printer, X } from "lucide-react";
import useWarehouseStore, { WarehouseTransaction } from "../../stores/useWarehouseStore";
import useMaterialStore from "../../stores/useMaterialStore";
import usePesticideStore from "../../stores/usePesticideStore";
import useFertilizerStore from "../../stores/useFertilizerStore";

export default function InventoryOutPage() {
  const { toast } = useToast();
  const { areas, allocations, inventory, adjustStock, transactions, recordTransaction } = useWarehouseStore();
  const { materials } = useMaterialStore();
  const { pesticides } = usePesticideStore();
  const { fertilizers } = useFertilizerStore();

  // Location Selector
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");
  const [selectedAllocId, setSelectedAllocId] = useState<string>("");
  
  // Material Selection (Filtered by what is actually in the selected allocation)
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>("");
  
  const [quantity, setQuantity] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("Cultivation");
  const [prescriptionCode, setPrescriptionCode] = useState<string>("");
  
  // Print Modal States
  const [printTransaction, setPrintTransaction] = useState<WarehouseTransaction | null>(null);

  const availableAllocations = allocations.filter(al => al.areaId === selectedAreaId);

  // Get items physically stored in the selected allocation
  const storedItems = inventory
    .filter(inv => inv.allocationId === selectedAllocId)
    .map(inv => {
      let name = "Vật tư không xác định";
      let isSpecialControl = false;

      const pItem = pesticides.find(p => p.id === inv.materialId);
      const fItem = fertilizers.find(f => f.id === inv.materialId);
      const mItem = materials.find(m => m.id === inv.materialId);

      if (pItem) {
        name = `[Thuốc] ${pItem.name}`;
        if (pItem.group.includes("Rất độc") || pItem.name.includes("Ketamine") || pItem.name.includes("độc")) {
          isSpecialControl = true;
        }
      } else if (fItem) {
        name = `[Phân bón] ${fItem.name}`;
      } else if (mItem) {
        name = `[Vật tư] ${mItem.name}`;
      }

      return {
        ...inv,
        name,
        isSpecialControl
      };
    });

  const selectedInventoryItem = storedItems.find(item => item.id === selectedInventoryId);

  const handleOutSubmit = () => {
    if (!selectedAreaId || !selectedAllocId || !selectedInventoryId || !quantity) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ các trường bắt buộc",
        variant: "destructive"
      });
      return;
    }

    const qtyNum = parseFloat(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      toast({
        title: "Lỗi nhập liệu",
        description: "Số lượng xuất kho phải lớn hơn 0",
        variant: "destructive"
      });
      return;
    }

    if (!selectedInventoryItem) return;

    if (qtyNum > selectedInventoryItem.quantity) {
      toast({
        title: "Không đủ tồn kho",
        description: `Vị trí này chỉ còn tồn ${selectedInventoryItem.quantity} ${selectedInventoryItem.unit}`,
        variant: "destructive"
      });
      return;
    }

    // Regulatory validation
    if (selectedInventoryItem.isSpecialControl && !prescriptionCode.trim()) {
      toast({
        title: "Ràng buộc pháp lý",
        description: "Vật tư thuộc nhóm kiểm soát đặc biệt bắt buộc phải nhập mã đơn thuốc thú y!",
        variant: "destructive"
      });
      return;
    }

    // Deduct stock (negative quantity)
    adjustStock(
      selectedAllocId,
      selectedInventoryItem.materialId,
      selectedInventoryItem.materialType,
      -qtyNum,
      selectedInventoryItem.unit,
      selectedInventoryItem.lotNumber,
      selectedInventoryItem.expiryDate
    );

    const alloc = allocations.find(a => a.id === selectedAllocId);
    const area = areas.find(a => a.id === selectedAreaId);

    // Record persisted transaction
    const txId = recordTransaction({
      type: "OUT",
      materialId: selectedInventoryItem.materialId,
      materialType: selectedInventoryItem.materialType,
      materialName: selectedInventoryItem.name,
      allocationId: selectedAllocId,
      locationName: `${area?.name || ""} - ${alloc?.name || ""}`,
      quantity: qtyNum,
      unit: selectedInventoryItem.unit,
      lotNumber: selectedInventoryItem.lotNumber || "N/A",
      expiryDate: selectedInventoryItem.expiryDate || "N/A",
      purpose,
      prescriptionCode: selectedInventoryItem.isSpecialControl ? prescriptionCode : undefined
    });

    toast({
      title: "Xuất kho thành công",
      description: `Đã ghi nhận phiếu ${txId} và trừ tồn kho`
    });

    setQuantity("");
    setPrescriptionCode("");
    setSelectedInventoryId("");
  };

  // Filter persisted transactions to show only OUT transactions
  const outTransactions = transactions.filter(tx => tx.type === "OUT");

  const logColumns = [
    { key: "id", label: "Mã Đơn" },
    { key: "createdAt", label: "Thời gian" },
    { key: "materialName", label: "Tên mặt hàng" },
    { key: "locationName", label: "Kho / Vị trí" },
    { key: "quantity", label: "Số lượng", render: (val: any, row: any) => `${val} ${row.unit}` },
    { 
      key: "purpose", 
      label: "Mục đích", 
      render: (val: any) => val === "Cultivation" ? "Sử dụng nội bộ" : val === "Transfer" ? "Chuyển kho" : "Bán/Xuất ngoài" 
    },
    {
      key: "actions",
      label: "Hành động",
      render: (val: any, row: any) => (
        <Button 
          size="sm" 
          variant="outline" 
          className="h-7 text-xs flex items-center gap-1"
          onClick={() => setPrintTransaction(row)}
        >
          <Printer className="w-3.5 h-3.5" /> In phiếu
        </Button>
      )
    }
  ];

  return (
    <PageWrapper 
      title="Xuất kho nhanh" 
      description="Thực hiện cấp phát, giảm số lượng tồn kho vật tư nông nghiệp phục vụ sản xuất trực tiếp không qua phiếu"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-600" /> Form Xuất kho trực tiếp
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              
              {/* Location Select */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Khu vực kho</Label>
                  <Select value={selectedAreaId} onValueChange={val => { setSelectedAreaId(val); setSelectedAllocId(""); setSelectedInventoryId(""); }}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Chọn kho" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map(a => (
                        <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Kệ / Tủ chứa</Label>
                  <Select value={selectedAllocId} onValueChange={val => { setSelectedAllocId(val); setSelectedInventoryId(""); }} disabled={!selectedAreaId}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Chọn vị trí" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAllocations.map(al => (
                        <SelectItem key={al.id} value={al.id}>{al.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Stored Items Selector */}
              <div className="space-y-2">
                <Label>Vật tư xuất kho (đang có trong kệ)</Label>
                <Select value={selectedInventoryId} onValueChange={setSelectedInventoryId} disabled={!selectedAllocId}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={storedItems.length > 0 ? "Chọn vật tư để xuất..." : "Kệ này trống..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {storedItems.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} (Lô: {item.lotNumber} - Tồn: {item.quantity} {item.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Show warning if item is special controlled */}
              {selectedInventoryItem?.isSpecialControl && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl space-y-2 shadow-2xs">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Hàng kiểm soát đặc biệt!</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Mặt hàng này chứa hoạt chất cần kiểm soát đặc biệt theo thông tư 12/2020/TT-BNNPTNT. Bắt buộc cung cấp mã số Đơn thuốc để thực hiện cấp phát.
                  </p>
                  <div className="space-y-1 pt-1">
                    <Label className="text-[10px] text-red-800 font-semibold flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Mã Đơn thuốc thú y <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      className="bg-white border-red-200 text-xs h-8 text-red-900"
                      value={prescriptionCode}
                      onChange={e => setPrescriptionCode(e.target.value)}
                      placeholder="VD: DT-TY-99201"
                    />
                  </div>
                </div>
              )}

              {/* Quantity and conversions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Số lượng xuất <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number" 
                    value={quantity} 
                    onChange={e => setQuantity(e.target.value)} 
                    placeholder="VD: 10" 
                    disabled={!selectedInventoryId}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Đơn vị</Label>
                  <Input 
                    disabled
                    value={selectedInventoryItem?.unit || "N/A"} 
                  />
                </div>
              </div>

              {/* Purpose Selection */}
              <div className="space-y-2">
                <Label>Mục đích xuất kho</Label>
                <Select value={purpose} onValueChange={setPurpose}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Mục đích sử dụng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cultivation">Canh tác - Sử dụng nội bộ</SelectItem>
                    <SelectItem value="Transfer">Chuyển kho nội bộ</SelectItem>
                    <SelectItem value="External">Xuất bán / Tặng đối tác bên ngoài</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="button" 
                className="w-full h-10 mt-2 bg-amber-600 hover:bg-amber-700" 
                onClick={handleOutSubmit}
                disabled={!selectedInventoryId}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Xác nhận xuất kho
              </Button>

            </CardContent>
          </Card>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-500" /> Nhật ký lịch sử xuất kho nông trường
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <DataTable 
                columns={logColumns} 
                data={outTransactions} 
                searchPlaceholder="Lọc lịch sử xuất kho..."
              />
              {outTransactions.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <Package className="w-8 h-8 text-slate-300" />
                  <span>Chưa có giao dịch xuất kho nào trong lịch sử hệ thống.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Print Delivery Bill Modal */}
      {printTransaction && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-slate-500" /> Xuất phiếu Xuất kho
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setPrintTransaction(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Print Area Content */}
            <div className="p-8 space-y-6 text-slate-800" id="print-bill-receipt">
              <div className="text-center space-y-1">
                <h2 className="font-bold text-lg uppercase tracking-wide">HỆ THỐNG ECO-FARM VIỆT NAM</h2>
                <p className="text-xs text-slate-500">Khu Nông Nghiệp Công Nghệ Cao - Quản lý Kho vật tư</p>
                <div className="border-b border-dashed pt-2 w-3/4 mx-auto"></div>
              </div>

              <div className="text-center space-y-1.5 pt-2">
                <h3 className="font-bold text-base uppercase">PHIẾU XUẤT KHO VẬT TƯ</h3>
                <p className="text-xs font-mono">Số đơn: {printTransaction.id}</p>
                <p className="text-xs italic text-slate-500">Thời gian tạo: {printTransaction.createdAt}</p>
              </div>

              {/* Receipt Details Table */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-slate-500 block">Vị trí xuất:</span>
                    <span className="font-semibold text-slate-800">{printTransaction.locationName}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 block">Mục đích xuất:</span>
                    <span className="font-semibold text-slate-800">
                      {printTransaction.purpose === "Cultivation" ? "Sử dụng nội bộ" : printTransaction.purpose === "Transfer" ? "Chuyển kho nội bộ" : "Bán/Xuất ngoài"}
                    </span>
                  </div>
                </div>

                <table className="w-full text-xs border border-collapse border-slate-200">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border p-2 text-left">Tên vật tư cấp phát</th>
                      <th className="border p-2 text-center">Số lô</th>
                      <th className="border p-2 text-center">Đơn thuốc thú y</th>
                      <th className="border p-2 text-right">Số lượng xuất</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 font-semibold">{printTransaction.materialName}</td>
                      <td className="border p-2 text-center font-mono">{printTransaction.lotNumber || "N/A"}</td>
                      <td className="border p-2 text-center text-red-700 font-semibold">{printTransaction.prescriptionCode || "Không cần đơn"}</td>
                      <td className="border p-2 text-right font-bold text-amber-700">{printTransaction.quantity} {printTransaction.unit}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures Area */}
              <div className="grid grid-cols-3 gap-4 pt-12 text-center text-xs">
                <div className="space-y-12">
                  <span className="font-semibold block">Người lập phiếu</span>
                  <span className="text-slate-400 italic">(Ký & ghi rõ họ tên)</span>
                </div>
                <div className="space-y-12">
                  <span className="font-semibold block">Người nhận cấp phát</span>
                  <span className="text-slate-400 italic">(Ký & ghi rõ họ tên)</span>
                </div>
                <div className="space-y-12">
                  <span className="font-semibold block">Thủ kho ký duyệt</span>
                  <span className="text-slate-400 italic">(Ký & ghi rõ họ tên)</span>
                </div>
              </div>
            </div>

            {/* Actions for Modal */}
            <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setPrintTransaction(null)}>Hủy</Button>
              <Button 
                size="sm" 
                className="bg-amber-600 hover:bg-amber-700"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer className="w-4 h-4 mr-2" /> Thực hiện in phiếu (Print)
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
