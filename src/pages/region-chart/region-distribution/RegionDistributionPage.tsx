import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Plus, Trash2, Edit } from "lucide-react";

import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  FormDialog,
  Input,
  Label,
  Textarea,
  useToast,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@tankhang1/eco-shared-ui";
import { MapContainer, TileLayer, Rectangle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet Icon
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import {
  type Region,
  type SubArea,
  PROVINCES,
  DISTRICTS,
  ENTERPRISES,
  LAND_TYPES,
  TERRAIN_TYPES,
} from "../constants";
import {
  DraggableRectangle,
  MapController,
} from "../components/DraggableRectangle";
import { SubAreaEditor } from "../components/SubAreaEditor";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const RegionDistributionPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [data, setData] = useState<Region[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Region>>({});

  // Map State for Editing
  // Default bounds for a new map (e.g. somewhere in Hochiminh or Binh Phuoc)
  const defaultBounds = L.latLngBounds(
    [11.53, 106.88], // SW
    [11.55, 106.91], // NE
  );

  const [currentBounds, setCurrentBounds] =
    useState<L.LatLngBounds>(defaultBounds);

  // Sub-area editing
  const [editingSubArea, setEditingSubArea] = useState<Partial<SubArea> | null>(
    null,
  );
  const [subAreaBounds, setSubAreaBounds] =
    useState<L.LatLngBounds>(defaultBounds);

  // Initial Data Load
  useEffect(() => {
    // Mock initial data
    setData([
      {
        id: 1,
        code: "REG-001",
        name: "Vùng Bình Phước Alpha",
        provinceId: "binh-phuoc",
        districtId: "dong-xoai",
        address: "Khu phố 3, Phường Tân Đồng",
        enterpriseId: "ent-1",
        area: 50.5,
        landType: "red-soil",
        terrain: "flat",
        note: "Vùng trồng thử nghiệm sầu riêng",
        status: "active",
        createdAt: "2024-01-15",
        coordinates: [
          { lat: 11.53, lng: 106.88 },
          { lat: 11.55, lng: 106.91 },
        ],
        subAreas: [],
      },
    ]);
  }, []);

  const handleAdd = () => {
    setLocation("/region-distribution/create");
  };

  const handleEdit = (item: Region) => {
    setEditingRegion(item);
    setFormData({ ...item });
    // Restore bounds from coordinates
    if (item.coordinates && item.coordinates.length >= 2) {
      const lats = item.coordinates.map((c) => c.lat);
      const lngs = item.coordinates.map((c) => c.lng);
      const sw = L.latLng(Math.min(...lats), Math.min(...lngs));
      const ne = L.latLng(Math.max(...lats), Math.max(...lngs));
      setCurrentBounds(L.latLngBounds(sw, ne));
    }
    setFormOpen(true);
  };

  const handleDelete = (item: Region) => {
    setDeletingId(item.id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setData((prev) => prev.filter((i) => i.id !== deletingId));
      toast({ title: "Thành công", description: "Đã xóa vùng trồng" });
      setDeleteOpen(false);
    }
  };

  const handleSubmit = () => {
    // Save map bounds to coordinates
    const sw = currentBounds.getSouthWest();
    const ne = currentBounds.getNorthEast();
    const nw = L.latLng(ne.lat, sw.lng);
    const se = L.latLng(sw.lat, ne.lng);

    const newCoords = [
      { lat: sw.lat, lng: sw.lng },
      { lat: nw.lat, lng: nw.lng },
      { lat: ne.lat, lng: ne.lng },
      { lat: se.lat, lng: se.lng },
    ];

    const finalData = {
      ...formData,
      coordinates: newCoords,
    } as Region;

    if (editingRegion) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingRegion.id ? { ...item, ...finalData } : item,
        ),
      );
      toast({
        title: "Thành công",
        description: "Cập nhật vùng trồng thành công",
      });
    } else {
      setData((prev) => [
        ...prev,
        {
          ...finalData,
          id: Date.now(),
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
      toast({
        title: "Thành công",
        description: "Thêm vùng trồng mới thành công",
      });
    }
    setFormOpen(false);
  };

  const addSubArea = () => {
    const newSub: SubArea = {
      id: `sub-${Date.now()}`,
      name: "Khu vực mới",
      area: 0,
      landType: "",
      coordinates: [],
    };
    setEditingSubArea(newSub);
    setSubAreaBounds(currentBounds); // Start within the parent bounds logically
  };

  const saveSubArea = () => {
    if (!editingSubArea) return;

    // Calculate coords from bounds
    const sw = subAreaBounds.getSouthWest();
    const ne = subAreaBounds.getNorthEast();

    // Actually let's store 4 points like parent
    const nw = L.latLng(ne.lat, sw.lng);
    const se = L.latLng(sw.lat, ne.lng);
    const fullCoords = [
      { lat: sw.lat, lng: sw.lng },
      { lat: nw.lat, lng: nw.lng },
      { lat: ne.lat, lng: ne.lng },
      { lat: se.lat, lng: se.lng },
    ];

    const updatedSub = {
      ...editingSubArea,
      coordinates: fullCoords,
    } as SubArea;

    const currentSubs = formData.subAreas || [];
    const index = currentSubs.findIndex((s) => s.id === updatedSub.id);

    let newSubs;
    if (index >= 0) {
      newSubs = [...currentSubs];
      newSubs[index] = updatedSub;
    } else {
      newSubs = [...currentSubs, updatedSub];
    }

    setFormData({ ...formData, subAreas: newSubs });
    setEditingSubArea(null);
  };

  const removeSubArea = (id: string) => {
    setFormData({
      ...formData,
      subAreas: (formData.subAreas || []).filter((s) => s.id !== id),
    });
  };

  return (
    <AdminLayout
      title="Phân bố vùng"
      description="Quản lý danh sách và bản đồ phân bố vùng trồng"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm vùng trồng
        </Button>
      }
    >
      <DataTable
        columns={[
          { key: "code", label: "Mã vùng" },
          { key: "name", label: "Tên vùng" },
          { key: "area", label: "Diện tích (ha)" },
          { key: "address", label: "Địa chỉ" },
          {
            key: "status",
            label: "Trạng thái",
            render: (v) => (
              <Badge variant={v === "active" ? "default" : "secondary"}>
                {v === "active" ? "Hoạt động" : "Ngưng"}
              </Badge>
            ),
          },
        ]}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingRegion ? "Cập nhật vùng trồng" : "Thêm mới vùng trồng"}
        onSubmit={handleSubmit}
        size="xl"
      >
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông tin chung</TabsTrigger>
            <TabsTrigger value="map">Bản đồ & Khu vực</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Mã vùng <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.code || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="VD: REG-001"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Tên vùng <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Tên vùng trồng"
                />
              </div>
            </div>

            {/* Other form fields can be modularized too if needed, but keeping here for now */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tỉnh / Thành</Label>
                <Select
                  value={formData.provinceId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, provinceId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tỉnh thành" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quận / Huyện</Label>
                <Select
                  value={formData.districtId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, districtId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quận huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRICTS.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Địa chỉ chi tiết</Label>
              <Input
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Số nhà, đường, thôn/xóm..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Doanh nghiệp / Nông hộ</Label>
                <Select
                  value={formData.enterpriseId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, enterpriseId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENTERPRISES.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Diện tích (ha)</Label>
                <Input
                  type="number"
                  value={formData.area || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      area: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loại đất</Label>
                <Select
                  value={formData.landType}
                  onValueChange={(v) =>
                    setFormData({ ...formData, landType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại đất" />
                  </SelectTrigger>
                  <SelectContent>
                    {LAND_TYPES.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Địa hình</Label>
                <Select
                  value={formData.terrain}
                  onValueChange={(v) =>
                    setFormData({ ...formData, terrain: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn địa hình" />
                  </SelectTrigger>
                  <SelectContent>
                    {TERRAIN_TYPES.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.note || ""}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="map" className="py-4 space-y-4">
            <div className="space-y-2">
              <Label className="font-semibold">
                Bản đồ vùng trồng (Kéo thả điểm để chỉnh sửa)
              </Label>
              <div className="h-[400px] w-full rounded-lg border overflow-hidden">
                <MapContainer
                  center={[
                    currentBounds.getCenter().lat,
                    currentBounds.getCenter().lng,
                  ]}
                  zoom={13}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <DraggableRectangle
                    bounds={currentBounds}
                    setBounds={setCurrentBounds}
                    color="blue"
                  />
                  {/* Show sub-areas as static outlines */}
                  {formData.subAreas?.map((sub) => {
                    if (sub.coordinates.length < 2) return null;
                    const lats = sub.coordinates.map((c) => c.lat);
                    const lngs = sub.coordinates.map((c) => c.lng);
                    const b = [
                      [Math.min(...lats), Math.min(...lngs)],
                      [Math.max(...lats), Math.max(...lngs)],
                    ];
                    return (
                      <Rectangle
                        key={sub.id}
                        bounds={b as any}
                        pathOptions={{ color: "green", weight: 1 }}
                      />
                    );
                  })}

                  <MapController
                    center={[
                      currentBounds.getCenter().lat,
                      currentBounds.getCenter().lng,
                    ]}
                  />
                </MapContainer>
              </div>
              <div className="text-xs text-muted-foreground">
                Toạ độ: {currentBounds.getSouthWest().lat.toFixed(4)},{" "}
                {currentBounds.getSouthWest().lng.toFixed(4)} -{" "}
                {currentBounds.getNorthEast().lat.toFixed(4)},{" "}
                {currentBounds.getNorthEast().lng.toFixed(4)}
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">
                  Danh sách phân bổ khu vực
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSubArea}
                  type="button"
                >
                  <Plus className="w-4 h-4 mr-2" /> Thêm khu vực
                </Button>
              </div>

              {/* Sub-areas List */}
              <div className="space-y-2">
                {(!formData.subAreas || formData.subAreas.length === 0) && (
                  <p className="text-sm text-muted-foreground italic">
                    Chưa có khu vực nào được thiết lập.
                  </p>
                )}
                {formData.subAreas?.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-green-500 rounded-full" />
                      <div>
                        <p className="font-medium text-sm">{sub.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {sub.area || 0} ha -{" "}
                          {LAND_TYPES.find((l) => l.id === sub.landType)
                            ?.name || sub.landType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingSubArea(sub);
                        }}
                        type="button"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeSubArea(sub.id)}
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </FormDialog>

      {editingSubArea && (
        <SubAreaEditor
          editingSubArea={editingSubArea}
          setEditingSubArea={setEditingSubArea}
          subAreaBounds={subAreaBounds}
          setSubAreaBounds={setSubAreaBounds}
          currentBounds={currentBounds}
          onSave={saveSubArea}
        />
      )}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        description="Bạn có chắc chắn muốn xóa vùng trồng này?"
      />
    </AdminLayout>
  );
};

export default RegionDistributionPage;
