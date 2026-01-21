import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tankhang1/eco-shared-ui";
import { MapContainer, TileLayer, Rectangle } from "react-leaflet";
import L from "leaflet";
import { type SubArea, LAND_TYPES } from "../constants";
import { DraggableRectangle } from "./DraggableRectangle";

interface SubAreaEditorProps {
  editingSubArea: Partial<SubArea>;
  setEditingSubArea: (val: Partial<SubArea> | null) => void;
  subAreaBounds: L.LatLngBounds;
  setSubAreaBounds: (bounds: L.LatLngBounds) => void;
  currentBounds: L.LatLngBounds;
  onSave: () => void;
}

export const SubAreaEditor = ({
  editingSubArea,
  setEditingSubArea,
  subAreaBounds,
  setSubAreaBounds,
  currentBounds,
  onSave,
}: SubAreaEditorProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background border rounded-xl shadow-lg w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg">
            {editingSubArea.id?.startsWith("sub-")
              ? "Thêm khu vực"
              : "Chỉnh sửa khu vực"}
          </h3>
          <button onClick={() => setEditingSubArea(null)}>
            <span className="sr-only">Close</span>✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tên khu vực</Label>
              <Input
                value={editingSubArea.name || ""}
                onChange={(e) =>
                  setEditingSubArea({
                    ...editingSubArea,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Diện tích (ha)</Label>
              <Input
                type="number"
                value={editingSubArea.area || ""}
                onChange={(e) =>
                  setEditingSubArea({
                    ...editingSubArea,
                    area: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Loại đất</Label>
            <Select
              value={editingSubArea.landType}
              onValueChange={(v) =>
                setEditingSubArea({ ...editingSubArea, landType: v })
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
            <Label>Định vị khu vực (trong vùng trồng chính)</Label>
            <div className="h-[300px] border rounded-lg">
              <MapContainer
                center={[
                  currentBounds.getCenter().lat,
                  currentBounds.getCenter().lng,
                ]}
                zoom={14}
                className="h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Parent Outline */}
                <Rectangle
                  bounds={currentBounds}
                  pathOptions={{
                    color: "blue",
                    fill: false,
                    dashArray: "5, 5",
                  }}
                />

                {/* Editable Sub Area */}
                <DraggableRectangle
                  bounds={subAreaBounds}
                  setBounds={setSubAreaBounds}
                  color="green"
                />
              </MapContainer>
            </div>
            <div className="space-y-4">
              <div className="bg-muted p-2 rounded-md text-sm">
                <strong>Hướng dẫn:</strong> Kéo thả các điểm trên bản đồ hoặc
                nhập toạ độ chính xác cho khu vực con.
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* SW */}
                <div className="space-y-1">
                  <Label className="text-xs">Điểm 1 (Tây Nam)</Label>
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      className="h-8 text-xs"
                      placeholder="Lat"
                      value={subAreaBounds.getSouthWest().lat || 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (isNaN(val)) return;
                        const ne = subAreaBounds.getNorthEast();
                        const sw = subAreaBounds.getSouthWest();
                        setSubAreaBounds(
                          L.latLngBounds(L.latLng(val, sw.lng), ne),
                        );
                      }}
                    />
                    <Input
                      type="number"
                      className="h-8 text-xs"
                      placeholder="Lng"
                      value={subAreaBounds.getSouthWest().lng || 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (isNaN(val)) return;
                        const ne = subAreaBounds.getNorthEast();
                        const sw = subAreaBounds.getSouthWest();
                        setSubAreaBounds(
                          L.latLngBounds(L.latLng(sw.lat, val), ne),
                        );
                      }}
                    />
                  </div>
                </div>

                {/* NW */}
                <div className="space-y-1">
                  <Label className="text-xs">Điểm 2 (Tây Bắc)</Label>
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      className="h-8 text-xs"
                      placeholder="Lat"
                      value={subAreaBounds.getNorthEast().lat || 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (isNaN(val)) return;
                        const sw = subAreaBounds.getSouthWest();
                        const ne = subAreaBounds.getNorthEast();
                        setSubAreaBounds(
                          L.latLngBounds(sw, L.latLng(val, ne.lng)),
                        );
                      }}
                    />
                    <Input
                      type="number"
                      className="h-8 text-xs"
                      placeholder="Lng"
                      value={subAreaBounds.getSouthWest().lng || 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (isNaN(val)) return;
                        const sw = subAreaBounds.getSouthWest();
                        const ne = subAreaBounds.getNorthEast();
                        setSubAreaBounds(
                          L.latLngBounds(L.latLng(sw.lat, val), ne),
                        );
                      }}
                    />
                  </div>
                </div>

                {/* NE */}
                <div className="space-y-1">
                  <Label className="text-xs">Điểm 3 (Đông Bắc)</Label>
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      className="h-8 text-xs"
                      placeholder="Lat"
                      value={subAreaBounds.getNorthEast().lat || 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (isNaN(val)) return;
                        const sw = subAreaBounds.getSouthWest();
                        const ne = subAreaBounds.getNorthEast();
                        setSubAreaBounds(
                          L.latLngBounds(sw, L.latLng(val, ne.lng)),
                        );
                      }}
                    />
                    <Input
                      type="number"
                      className="h-8 text-xs"
                      placeholder="Lng"
                      value={subAreaBounds.getNorthEast().lng || 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (isNaN(val)) return;
                        const sw = subAreaBounds.getSouthWest();
                        const ne = subAreaBounds.getNorthEast();
                        setSubAreaBounds(
                          L.latLngBounds(sw, L.latLng(ne.lat, val)),
                        );
                      }}
                    />
                  </div>
                </div>

                {/* SE */}
                <div className="space-y-1">
                  <Label className="text-xs">Điểm 4 (Đông Nam)</Label>
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      className="h-8 text-xs"
                      placeholder="Lat"
                      value={subAreaBounds.getSouthWest().lat || 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (isNaN(val)) return;
                        const ne = subAreaBounds.getNorthEast();
                        const sw = subAreaBounds.getSouthWest();
                        setSubAreaBounds(
                          L.latLngBounds(L.latLng(val, sw.lng), ne),
                        );
                      }}
                    />
                    <Input
                      type="number"
                      className="h-8 text-xs"
                      placeholder="Lng"
                      value={subAreaBounds.getNorthEast().lng || 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (isNaN(val)) return;
                        const sw = subAreaBounds.getSouthWest();
                        const ne = subAreaBounds.getNorthEast();
                        setSubAreaBounds(
                          L.latLngBounds(sw, L.latLng(ne.lat, val)),
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t bg-muted/20 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setEditingSubArea(null)}>
            Hủy
          </Button>
          <Button onClick={onSave}>Lưu khu vực</Button>
        </div>
      </div>
    </div>
  );
};
