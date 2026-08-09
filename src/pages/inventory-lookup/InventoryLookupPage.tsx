import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  Box,
  CalendarDays,
  Flame,
  Layers,
  LayoutGrid,
  Lock,
  Search,
  ShieldAlert,
  ThermometerSnowflake,
} from "lucide-react";
import { useState } from "react";
import useFertilizerStore from "../../stores/useFertilizerStore";
import useMaterialStore from "../../stores/useMaterialStore";
import usePesticideStore from "../../stores/usePesticideStore";
import useWarehouseStore from "../../stores/useWarehouseStore";

export default function InventoryLookupPage() {
  const { areas, allocations, inventory } = useWarehouseStore();
  const { materials } = useMaterialStore();
  const { pesticides } = usePesticideStore();
  const { fertilizers } = useFertilizerStore();

  const [selectedAreaId, setSelectedAreaId] = useState<string>("all");
  const [selectedAllocId, setSelectedAllocId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedArea = areas.find((a) => a.id === selectedAreaId);
  const availableAllocations = allocations.filter(
    (al) => al.areaId === selectedAreaId,
  );

  // Parse inventory items
  const parsedInventory = inventory.map((inv) => {
    let matName = "Vật tư không xác định";
    let matCode = "N/A";
    let groupName = "N/A";

    const pesticideItem = pesticides.find((p) => p.id === inv.materialId);
    const fertilizerItem = fertilizers.find((f) => f.id === inv.materialId);
    const otherItem = materials.find((m) => m.id === inv.materialId);

    if (pesticideItem) {
      matName = pesticideItem.name;
      matCode = pesticideItem.code;
      groupName = pesticideItem.group;
    } else if (fertilizerItem) {
      matName = fertilizerItem.name;
      matCode = fertilizerItem.code;
      groupName = "Phân bón";
    } else if (otherItem) {
      matName = otherItem.name;
      matCode = otherItem.code;
      groupName = otherItem.type;
    }

    const alloc = allocations.find((al) => al.id === inv.allocationId);
    const area = areas.find((a) => a.id === alloc?.areaId);

    // Calculate expiry warning (if within 180 days)
    let isNearExpiry = false;
    let daysToExpiry = 999;
    if (inv.expiryDate) {
      const expDate = new Date(inv.expiryDate);
      const today = new Date();
      const diffTime = expDate.getTime() - today.getTime();
      daysToExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (daysToExpiry <= 180) {
        isNearExpiry = true;
      }
    }

    return {
      id: inv.id,
      code: matCode,
      name: matName,
      group: groupName,
      sector:
        inv.materialType === "crop"
          ? "Trồng trọt"
          : inv.materialType === "livestock"
            ? "Chăn nuôi"
            : "Thủy sản",
      quantity: inv.quantity,
      unit: inv.unit,
      lotNumber: inv.lotNumber || "N/A",
      expiryDate: inv.expiryDate || "N/A",
      daysToExpiry,
      isNearExpiry,
      allocationId: inv.allocationId,
      areaId: area?.id || "",
      location: `${area?.name || ""} - ${alloc?.name || ""}`,
    };
  });

  // Filter list based on search/filters
  const filteredInventory = parsedInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea =
      selectedAreaId === "all" ? true : item.areaId === selectedAreaId;
    const matchesAlloc =
      selectedAllocId === "all" ? true : item.allocationId === selectedAllocId;

    return matchesSearch && matchesArea && matchesAlloc;
  });

  // Prepare shelf occupancy levels for visual representation of selected warehouse
  const targetAreaId =
    selectedAreaId !== "all" ? selectedAreaId : areas[0]?.id || "";
  const targetAllocations = allocations.filter(
    (a) => a.areaId === targetAreaId,
  );

  // Mock occupancy generator based on storage type
  const getAllocOccupancy = (allocId: string, type: string) => {
    // Generate deterministic percentage based on id length/chars
    const sum = allocId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pct = (sum % 9) * 10 + 10; // 10% to 90%

    let colorClass = "bg-emerald-500 border-emerald-600 text-emerald-700";
    let text = "Trống / Sẵn sàng";

    if (pct >= 80) {
      colorClass = "bg-red-500 text-white border-red-600";
      text = "Lấp đầy / Đầy kho";
    } else if (pct >= 40) {
      colorClass = "bg-amber-400 text-slate-900 border-amber-500";
      text = "Còn trống một phần";
    }

    return { percentage: pct, colorClass, text };
  };

  const getStorageIcon = (type: string) => {
    switch (type) {
      case "General":
        return <Box className="w-5 h-5 text-slate-500" />;
      case "Acidic_Fertilizer":
        return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      case "Pesticide":
        return <Flame className="w-5 h-5 text-emerald-500" />;
      case "Cold_Storage":
        return <ThermometerSnowflake className="w-5 h-5 text-blue-500" />;
      case "Locked_Cabinet":
        return <Lock className="w-5 h-5 text-red-500" />;
      default:
        return <Box className="w-5 h-5 text-slate-500" />;
    }
  };

  const columns = [
    { key: "code", label: "Mã vật tư" },
    { key: "name", label: "Tên vật tư" },
    { key: "group", label: "Nhóm" },
    {
      key: "sector",
      label: "Ngành hàng",
      render: (value: any) => {
        const color =
          value === "Trồng trọt"
            ? "bg-green-100 text-green-800"
            : value === "Chăn nuôi"
              ? "bg-orange-100 text-orange-800"
              : "bg-cyan-100 text-cyan-800";
        return (
          <Badge
            className={`text-xs px-2 py-0.5 rounded-full border-none ${color}`}
          >
            {value}
          </Badge>
        );
      },
    },
    { key: "location", label: "Vị trí" },
    {
      key: "quantity",
      label: "Tồn kho",
      render: (value: any, row: any) => `${value} ${row.unit}`,
    },
    { key: "lotNumber", label: "Số lô" },
    {
      key: "expiryDate",
      label: "Hạn sử dụng",
      render: (value: any, row: any) => {
        if (row.isNearExpiry) {
          return (
            <div className="flex items-center gap-1 text-red-600 font-semibold text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>
                {value} (Còn {row.daysToExpiry} ngày)
              </span>
            </div>
          );
        }
        return value;
      },
    },
  ];

  return (
    <PageWrapper
      title="Tra cứu tồn kho vật tư"
      description="Tra cứu nhanh số lượng, hạn sử dụng, vị trí chi tiết của vật tư nông nghiệp và sơ đồ kho trực quan"
    >
      <div className="space-y-6">
        {/* Filters Dashboard */}
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label>Khu vực kho</Label>
              <Select
                value={selectedAreaId}
                onValueChange={(val) => {
                  setSelectedAreaId(val);
                  setSelectedAllocId("all");
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Tất cả kho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả kho</SelectItem>
                  {areas.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Vị trí kệ tủ chứa</Label>
              <Select
                value={selectedAllocId}
                onValueChange={setSelectedAllocId}
                disabled={selectedAreaId === "all"}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Tất cả vị trí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vị trí</SelectItem>
                  {availableAllocations.map((al) => (
                    <SelectItem key={al.id} value={al.id}>
                      {al.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <Label>Tìm kiếm vật tư</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nhập tên vật tư, mã Barcode/QR, số lô..."
                  className="pl-9 bg-slate-50 border-slate-200 h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Shelf Layout (Sơ đồ kệ chứa) */}
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4 text-primary" /> Sơ đồ phân vùng
                kệ chứa
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Bản đồ ảo vị trí lưu trữ của{" "}
                {selectedAreaId === "all" ? areas[0]?.name : selectedArea?.name}
              </p>
            </div>
            {/* Status indicators */}
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600">Trống (&lt;40%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="text-slate-600">Còn chỗ (40%-80%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="text-slate-600">Đầy (&gt;80%)</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {targetAllocations.map((alloc) => {
                const occ = getAllocOccupancy(alloc.id, alloc.storageType);
                return (
                  <div
                    key={alloc.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-3 justify-between hover:shadow-xs transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-1.5 bg-white rounded border shadow-2xs">
                        {getStorageIcon(alloc.storageType)}
                      </div>
                      <Badge
                        className={`text-[9px] font-bold ${occ.colorClass} border-none`}
                      >
                        {occ.percentage}%
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-xs text-slate-800 line-clamp-1">
                        {alloc.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">
                        {
                          inventory.filter((i) => i.allocationId === alloc.id)
                            .length
                        }{" "}
                        loại mặt hàng
                      </p>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="w-full space-y-1">
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            occ.percentage >= 80
                              ? "bg-red-500"
                              : occ.percentage >= 40
                                ? "bg-amber-400"
                                : "bg-emerald-500"
                          }`}
                          style={{ width: `${occ.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] font-semibold text-slate-400 block text-right">
                        {occ.text}
                      </span>
                    </div>
                  </div>
                );
              })}

              {targetAllocations.length === 0 && (
                <div className="col-span-5 text-center py-10 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <Layers className="w-8 h-8 text-slate-300" />
                  <span>Khu vực kho này chưa được phân bổ ô chứa.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Inventory Grid Table */}
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-slate-500" /> Bảng chi tiết
              tồn kho vật tư thực tế
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <DataTable
              columns={columns}
              data={filteredInventory}
              searchPlaceholder="Lọc kết quả tra cứu..."
            />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
