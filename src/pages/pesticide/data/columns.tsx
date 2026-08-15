import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { toxicityLevels } from "./constants";

const toxicityBadgeColor: Record<string, string> = {
  Ia: "bg-red-100 text-red-700 border-red-300",
  Ib: "bg-orange-100 text-orange-700 border-orange-300",
  II: "bg-yellow-100 text-yellow-700 border-yellow-300",
  III: "bg-blue-100 text-blue-700 border-blue-300",
  U: "bg-green-100 text-green-700 border-green-300",
};

export const pesticideColumns = (
  onNavigateDetail: (id: number) => void,
): Column<any>[] => [
  { key: "code", label: "Mã" },
  { key: "sku", label: "Mã SKU" },
  {
    key: "name",
    label: "Tên thương mại",
    render: (value, row) => (
      <span
        className="font-medium text-primary cursor-pointer hover:underline"
        onClick={() => onNavigateDetail(row.id)}
      >
        {value}
      </span>
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
    render: (value) =>
      value ? (
        <span className="font-mono text-xs text-slate-600">{value}</span>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      ),
  },
  {
    key: "group",
    label: "Nhóm phân loại",
    render: (_, row) => {
      const type =
        row.domainCode === "LIVESTOCK"
          ? "control_level"
          : row.domainCode === "AQUACULTURE"
            ? "control_residue_level"
            : "target_group";
      const val = row.classifications?.find(
        (c: any) => c.classification === type,
      )?.group?.name;
      return val ? (
        <Badge variant="outline">{val}</Badge>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      );
    },
  },
  {
    key: "form",
    label: "Dạng bào chế",
    render: (_, row) => {
      const val = row.classifications?.find(
        (c: any) => c.classification === "dosage_form",
      )?.group?.name;
      return val || <span className="text-muted-foreground text-xs">—</span>;
    },
  },
  {
    key: "toxicityLevel",
    label: "Nhóm độc (WHO)",
    render: (_, row) => {
      let val = row.classifications?.find(
        (c: any) => c.classification === "toxicity",
      )?.group?.name;
      if (!val && row.metadataJson) {
        try {
          const meta =
            typeof row.metadataJson === "string"
              ? JSON.parse(row.metadataJson)
              : row.metadataJson;
          val = meta?.toxicityLevel;
        } catch (e) {
          // ignore
        }
      }
      if (!val) {
        val = row.toxicityLevel;
      }
      const displayLabel =
        toxicityLevels.find((t) => t.value === val)?.label || val;
      return val ? (
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold border ${toxicityBadgeColor[val] ?? "bg-slate-100 text-slate-600"}`}
        >
          {displayLabel}
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      );
    },
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value === "active" ? "Hoạt động" : "Không hoạt động"}
      </Badge>
    ),
  },
];
