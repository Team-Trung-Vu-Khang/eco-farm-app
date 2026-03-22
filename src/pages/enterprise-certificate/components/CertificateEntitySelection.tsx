import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Area, Enterprise, EnterpriseCertificate } from "../../../stores/useEnterpriseCertificateStore";

interface EntitySelectionProps {
  formData: Omit<EnterpriseCertificate, "id" | "createdAt" | "status">;
  setFormData: (data: any) => void;
  enterprises: Enterprise[];
  areas: Area[];
  selectedEnterpriseId: string;
  onEnterpriseSelect: (id: string) => void;
  onAreaSelect: (id: string) => void;
}

export function CertificateEntitySelection({
  formData,
  setFormData,
  enterprises,
  areas,
  selectedEnterpriseId,
  onEnterpriseSelect,
  onAreaSelect,
}: EntitySelectionProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
      <Label>Đối tượng được cấp chứng nhận *</Label>

      {/* Bước 1: Chọn doanh nghiệp */}
      <div className="space-y-2">
        <Label htmlFor="enterpriseSelect">1. Chọn doanh nghiệp *</Label>
        <Select
          value={selectedEnterpriseId}
          onValueChange={onEnterpriseSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tìm và chọn doanh nghiệp..." />
          </SelectTrigger>
          <SelectContent>
            {enterprises.map((enterprise) => (
              <SelectItem key={enterprise.id} value={enterprise.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{enterprise.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {enterprise.code}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bước 2: Chọn cấp cho toàn doanh nghiệp hay vùng trồng cụ thể */}
      {selectedEnterpriseId && (
        <div className="space-y-2">
          <Label htmlFor="entityType">2. Cấp chứng nhận cho *</Label>
          <Select
            value={formData.entityType}
            onValueChange={(val: any) => {
              const baseUpdates = {
                entityType: val,
                entityId: "",
                entityName: "",
              };

              if (val === "enterprise") {
                const enterprise = enterprises.find((e) => e.id === selectedEnterpriseId);
                if (enterprise) {
                  setFormData({
                    ...formData,
                    ...baseUpdates,
                    entityId: enterprise.code,
                    entityName: enterprise.name,
                  });
                }
              } else {
                setFormData({ ...formData, ...baseUpdates });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn phạm vi..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enterprise">Toàn bộ doanh nghiệp</SelectItem>
              <SelectItem value="area">Vùng trồng cụ thể</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Bước 3: Nếu chọn vùng trồng, hiển thị danh sách vùng trồng của doanh nghiệp */}
      {selectedEnterpriseId && formData.entityType === "area" && (
        <div className="space-y-2">
          <Label htmlFor="areaSelect">3. Chọn vùng trồng *</Label>
          <Select
            value={formData.entityId}
            onValueChange={onAreaSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn vùng trồng..." />
            </SelectTrigger>
            <SelectContent>
              {areas
                .filter((area) => area.enterpriseId === selectedEnterpriseId)
                .map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{area.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {area.code}
                      </span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Hiển thị thông tin đã chọn */}
      {formData.entityName && (
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">
                ✓ Đã chọn:
              </span>
              <span className="font-medium">{formData.entityName}</span>
            </div>
            <div className="text-muted-foreground">
              Mã: {formData.entityId} • Loại:{" "}
              {formData.entityType === "enterprise"
                ? "Doanh nghiệp"
                : "Vùng trồng"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
