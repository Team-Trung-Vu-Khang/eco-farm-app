import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { originOptions, applicationStageOptions } from "./constants";
import { CodeBadge } from "@/components/CodeBadge";
import { formatPackagingVariantText } from "@/features/farm-supply";

export const getFertilizerColumns = (
  onView: (id: number) => void,
): Column<any>[] => [
  { key: "code", label: "Mã", render: (value) => <CodeBadge value={value} /> },
  { key: "sku", label: "Mã SKU", render: (value) => <CodeBadge value={value} /> },
  {
    key: "name",
    label: "Tên phân bón",
    render: (value, row) => (
      <div>
        <span
          className="font-medium text-primary cursor-pointer hover:underline"
          onClick={() => onView(row.id)}
        >
          {String(value ?? "")}
        </span>
        {(row.profile?.scientificName || row.scientificTechnicalName) && (
          <span className="block text-[11px] text-muted-foreground italic mt-0.5">
            {row.profile?.scientificName || row.scientificTechnicalName}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "source",
    label: "Nguồn",
    render: (value) => (
      <Badge variant={value === "MASTER" ? "secondary" : "default"}>
        {value === "MASTER" ? "Hệ thống" : "Nội bộ"}
      </Badge>
    ),
  },
  {
    key: "registrationNumber",
    label: "Số đăng ký",
    render: (val) => (
      <span className="font-mono text-xs">{(val as string) || "—"}</span>
    ),
  },
  {
    key: "originId",
    label: "Phân loại",
    render: (_, row) => {
      const origin =
        row.classifications?.find((c: any) => c.classification === "origin")
          ?.group?.name ||
        row.metadataJson?.origin ||
        row.fertilizerOriginGroup ||
        originOptions.find((o: any) => o.id === row.originId)?.label ||
        "N/A";
      const stage =
        row.classifications?.find(
          (c: any) => c.classification === "effect_stage",
        )?.group?.name ||
        row.applicationStage ||
        applicationStageOptions.find(
          (s: any) => s.id === row.applicationStageId,
        )?.label ||
        "N/A";

      return (
        <div className="flex gap-1 flex-col">
          <Badge variant="outline" className="w-fit text-[10px] py-0 px-1.5">
            {origin}
          </Badge>
          <Badge variant="secondary" className="w-fit text-[10px] py-0 px-1.5">
            {stage}
          </Badge>
        </div>
      );
    },
  },
  {
    key: "npkRatio",
    label: "Tỷ lệ NPK / Hàm lượng",
    render: (val, row) => {
      const npk = val || row.profile?.npkRatio;
      const comp = row.profile?.detailedComposition || row.nutrientContent;
      const display = [npk, comp].filter(Boolean).join(" / ") || "—";
      return <span className="text-xs">{display}</span>;
    },
  },
  {
    key: "targetSubjects",
    label: "Cây trồng áp dụng",
    render: (_, row) => {
      const subjects = row.targetSubjects?.map((s: any) => s.name) || [];
      return subjects.length > 0 ? (
        <div className="flex flex-wrap gap-1 max-w-[180px]">
          {subjects.map((s: any) => (
            <Badge
              key={s}
              variant="outline"
              className="text-[10px] py-0 px-1.5"
            >
              {s}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      );
    },
  },
  {
    key: "packagingVariants",
    label: "Đóng gói / Đơn vị",
    render: (_, row) => {
      const specs =
        row.packagingVariants?.map((pv: any) => formatPackagingVariantText(pv)).filter(Boolean) || [];
      return specs.length > 0 ? (
        <span
          className="text-xs block max-w-[180px] truncate"
          title={specs.join(", ")}
        >
          {specs.join(", ")}
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      );
    },
  },
  {
    key: "certificates",
    label: "Chứng nhận",
    render: (_, row) => {
      const certs =
        row.certificates?.map(
          (c: any) => c.certificate?.name || c.certificate?.code,
        ) || [];
      return certs.length > 0 ? (
        <div className="flex flex-wrap gap-1 w-[180px]">
          {certs.map((c: any) => (
            <Badge
              key={c}
              variant="secondary"
              className="text-[9px] py-0 px-1 bg-green-50 text-green-700 border border-green-200"
            >
              {c}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      );
    },
  },
  {
    key: "referencePrice",
    label: "Giá tham khảo",
    render: (val) => {
      if (!val) return <span className="text-muted-foreground text-xs">—</span>;
      const num = Number(val);
      if (isNaN(num))
        return <span className="text-xs">{String(val)}</span>;
      return (
        <span className="text-xs font-semibold text-slate-700">
          {num.toLocaleString("vi-VN")} đ
        </span>
      );
    },
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge
        variant={value === "active" ? "default" : "secondary"}
        className="text-xs"
      >
        {value === "active" ? "Hoạt động" : "Không hoạt động"}
      </Badge>
    ),
  },
];

export const fertilizerColumns = getFertilizerColumns;
