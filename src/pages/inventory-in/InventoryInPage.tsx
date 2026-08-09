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
  DataTable
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Download, CheckCircle, Package, History, Printer, X } from "lucide-react";
import useWarehouseStore, { WarehouseTransaction } from "../../stores/useWarehouseStore";
import useMaterialStore from "../../stores/useMaterialStore";
import usePesticideStore from "../../stores/usePesticideStore";
import useFertilizerStore from "../../stores/useFertilizerStore";

export default function InventoryInPage() {
  const { toast } = useToast();
  const { areas, allocations, adjustStock, transactions, recordTransaction } = useWarehouseStore();
  const { materials } = useMaterialStore();
  const { pesticides } = usePesticideStore();
  const { fertilizers } = useFertilizerStore();

  // Selected states
  const [sector, setSector] = useState<"crop" | "livestock" | "aquaculture">("crop");
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");
  const [selectedAllocId, setSelectedAllocId] = useState<string>("");
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  
  const [quantity, setQuantity] = useState<string>("");
  const [unit, setUnit] = useState<string>("Bao");
  const [lotNumber, setLotNumber] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");

  // Print Modal States
  const [printTransaction, setPrintTransaction] = useState<WarehouseTransaction | null>(null);

  const availableAllocations = allocations.filter(al => al.areaId === selectedAreaId);

  // Dynamic materials listing based on sector
  const getFilteredMaterials = () => {
    if (sector === "crop") {
      return [
        ...pesticides.map(p => ({ id: p.id, name: `[Thuốc] ${p.name}`, unit: "Chai", code: p.code })),
        ...fertilizers.map(f => ({ id: f.id, name: `[Phân bón] ${f.name}`, unit: "Bao", code: f.code })),
        ...materials.filter(m => m.type.includes("Trồng trọt") || m.type.includes("crop")).map(m => ({ id: m.id, name: `[Vật tư] ${m.name}`, unit: "Cái", code: m.code }))
      ];
    } else if (sector === "livestock") {
      return [
        ...pesticides.filter(p => p.group.includes("thú y") || p.group.includes("Vaccine")).map(p => ({ id: p.id, name: `[Thuốc/Vaccine] ${p.name}`, unit: "Lọ", code: p.code })),
        ...materials.filter(m => m.type.includes("Chăn nuôi") || m.type.includes("livestock") || m.description?.includes("cám") || m.name.includes("Cám")).map(m => ({ id: m.id, name: `[Thức ăn/Vật tư] ${m.name}`, unit: "Bao", code: m.code }))
      ];
    } else {
      return [
        ...pesticides.filter(p => p.group.includes("Thủy sản")).map(p => ({ id: p.id, name: `[Hóa chất] ${p.name}`, unit: "Thùng", code: p.code })),
        ...materials.filter(m => m.type.includes("Thủy sản") || m.type.includes("aquaculture")).map(m => ({ id: m.id, name: `[Thức ăn/Dụng cụ] ${m.name}`, unit: "Bao", code: m.code }))
      ];
    }
  };

  const filteredMaterials = getFilteredMaterials();

  const handleInSubmit = () => {
    if (!selectedAreaId || !selectedAllocId || !selectedMaterialId || !quantity) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive"
      });
      return;
    }

    const qtyNum = parseFloat(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      toast({
        title: "Lỗi nhập liệu",
        description: "Số lượng nhập kho phải lớn hơn 0",
        variant: "destructive"
      });
      return;
    }

    const materialItem = filteredMaterials.find(m => String(m.id) === selectedMaterialId);
    if (!materialItem) return;

    adjustStock(
      selectedAllocId,
      materialItem.id,
      sector,
      qtyNum,
      unit,
      lotNumber || undefined,
      expiryDate || undefined
    );

    const alloc = allocations.find(a => a.id === selectedAllocId);
    const area = areas.find(a => a.id === selectedAreaId);

    // Record persisted transaction
    const txId = recordTransaction({
      type: "IN",
      materialId: materialItem.id,
      materialType: sector,
      materialName: materialItem.name,
      allocationId: selectedAllocId,
      locationName: `${area?.name || ""} - ${alloc?.name || ""}`,
      quantity: qtyNum,
      unit,
      lotNumber: lotNumber || "N/A",
      expiryDate: expiryDate || "N/A"
    });

    toast({
      title: "Nhập kho thành công",
      description: `Đã ghi nhận phiếu ${txId} và cộng tồn kho`
    });

    setQuantity("");
    setLotNumber("");
    setExpiryDate("");
  };

  // Filter persisted transactions to show only IN transactions
  const inTransactions = transactions.filter(tx => tx.type === "IN");

  const logColumns = [
    { key: "id", label: "Mã Đơn" },
    { key: "createdAt", label: "Thời gian" },
    { key: "materialName", label: "Tên mặt hàng" },
    { key: "locationName", label: "Kho / Vị trí" },
    { key: "quantity", label: "Số lượng", render: (val: any, row: any) => `${val} ${row.unit}` },
    { key: "lotNumber", label: "Số lô" },
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
      title="Nhập kho nhanh" 
      description="Thực hiện bổ sung, gia tăng hàng tồn kho của vật tư nông nghiệp trực tiếp vào hệ thống vị trí kệ chứa"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-600" /> Form Nhập kho trực tiếp
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              
              {/* Sector Selection */}
              <div className="space-y-2">
                <Label>Ngành hàng vật tư</Label>
                <Select value={sector} onValueChange={val => { setSector(val as any); setSelectedMaterialId(""); }}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Chọn ngành hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crop">Trồng trọt</SelectItem>
                    <SelectItem value="livestock">Chăn nuôi</SelectItem>
                    <SelectItem value="aquaculture">Nuôi trồng thủy sản</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Select */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Khu vực kho</Label>
                  <Select value={selectedAreaId} onValueChange={val => { setSelectedAreaId(val); setSelectedAllocId(""); }}>
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
                  <Select value={selectedAllocId} onValueChange={setSelectedAllocId} disabled={!selectedAreaId}>
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

              {/* Material Selector */}
              <div className="space-y-2">
                <Label>Vật tư nhập kho</Label>
                <Select value={selectedMaterialId} onValueChange={setSelectedMaterialId}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Chọn vật tư..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMaterials.map(m => (
                      <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity and conversions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Số lượng nhập <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number" 
                    value={quantity} 
                    onChange={e => setQuantity(e.target.value)} 
                    placeholder="VD: 50" 
                  />
                </div>
                <div className="space-y-1">
                  <Label>Đơn vị</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Chọn đơn vị" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bao">Bao</SelectItem>
                      <SelectItem value="Chai">Chai</SelectItem>
                      <SelectItem value="Gói">Gói</SelectItem>
                      <SelectItem value="Lọ">Lọ</SelectItem>
                      <SelectItem value="Thùng">Thùng</SelectItem>
                      <SelectItem value="Cái">Cái</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Số lô (Lot Number)</Label>
                  <Input 
                    value={lotNumber} 
                    onChange={e => setLotNumber(e.target.value)} 
                    placeholder="LOT-2026" 
                  />
                </div>
                <div className="space-y-1">
                  <Label>Hạn sử dụng (Expiry Date)</Label>
                  <Input 
                    type="date" 
                    value={expiryDate} 
                    onChange={e => setExpiryDate(e.target.value)} 
                  />
                </div>
              </div>

              <Button 
                type="button" 
                className="w-full h-10 mt-2 bg-emerald-600 hover:bg-emerald-700" 
                onClick={handleInSubmit}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Xác nhận nhập kho
              </Button>

            </CardContent>
          </Card>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-500" /> Nhật ký lịch sử nhập kho nông trường
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <DataTable 
                columns={logColumns} 
                data={inTransactions} 
                searchPlaceholder="Lọc lịch sử nhập kho..."
              />
              {inTransactions.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <Package className="w-8 h-8 text-slate-300" />
                  <span>Chưa có giao dịch nhập kho nào trong lịch sử hệ thống.</span>
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
                <Printer className="w-4 h-4 text-slate-500" /> Xuất phiếu Nhập kho
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
                <h3 className="font-bold text-base uppercase">PHIẾU NHẬP KHO VẬT TƯ</h3>
                <p className="text-xs font-mono">Số đơn: {printTransaction.id}</p>
                <p className="text-xs italic text-slate-500">Thời gian tạo: {printTransaction.createdAt}</p>
              </div>

              {/* Receipt Details Table */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-slate-500 block">Vị trí kho bãi:</span>
                    <span className="font-semibold text-slate-800">{printTransaction.locationName}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 block">Ngành hàng vật tư:</span>
                    <span className="font-semibold text-slate-800">
                      {printTransaction.materialType === "crop" ? "Trồng trọt" : printTransaction.materialType === "livestock" ? "Chăn nuôi" : "Nuôi trồng thủy sản"}
                    </span>
                  </div>
                </div>

                <table className="w-full text-xs border border-collapse border-slate-200">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border p-2 text-left">Tên vật tư nông nghiệp</th>
                      <th className="border p-2 text-center">Số lô</th>
                      <th className="border p-2 text-center">Hạn sử dụng</th>
                      <th className="border p-2 text-right">Số lượng nhập</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 font-semibold">{printTransaction.materialName}</td>
                      <td className="border p-2 text-center font-mono">{printTransaction.lotNumber || "N/A"}</td>
                      <td className="border p-2 text-center">{printTransaction.expiryDate || "N/A"}</td>
                      <td className="border p-2 text-right font-bold text-emerald-700">{printTransaction.quantity} {printTransaction.unit}</td>
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
                  <span className="font-semibold block">Người giao hàng</span>
                  <span className="text-slate-400 italic">(Ký & ghi rõ họ tên)</span>
                </div>
                <div className="space-y-12">
                  <span className="font-semibold block">Thủ kho xác nhận</span>
                  <span className="text-slate-400 italic">(Ký & ghi rõ họ tên)</span>
                </div>
              </div>
            </div>

            {/* Actions for Modal */}
            <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setPrintTransaction(null)}>Hủy</Button>
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
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
