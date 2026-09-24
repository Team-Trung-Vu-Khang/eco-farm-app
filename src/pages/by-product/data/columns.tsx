import { CodeBadge } from "@/components/CodeBadge";
import { formatPackagingVariantText } from "@/features/farm-supply";
import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export const getByProductColumns = (
  onView: (id: number) => void,
  scope?: "admin" | "farm",
): Column<any>[] => {
  const isAdmin = scope
    ? scope === "admin"
    : typeof window !== "undefined" &&
      window.location.pathname.startsWith("/admin");

  const cols: Column<any>[] = [
    {
      key: "code",
      label: "Mã",
      render: (value) => <CodeBadge value={value} />,
    },
    {
      key: "sku",
      label: "Mã SKU",
      render: (value) => <CodeBadge value={value} />,
    },
    {
      key: "name",
      label: "Tên phụ phẩm",
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
  ];

  if (!isAdmin) {
    cols.push({
      key: "source",
      label: "Nguồn",
      render: (value) => {
        const source = value ?? "OWNER";
        return (
          <Badge variant={source === "MASTER" ? "secondary" : "default"}>
            {source === "MASTER" ? "Hệ thống" : "Nội bộ"}
          </Badge>
        );
      },
    });
  }

  return [
    ...cols,
    {
      key: "registrationNumber",
      label: "Số đăng ký",
      render: (val) => (
        <span className="font-mono text-xs">{(val as string) || "—"}</span>
      ),
    },
    {
      key: "classifications",
      label: "Phân loại",
      render: (_, row) => {
        const groups =
          row.classifications?.map((c: any) => c.group?.name).filter(Boolean) || [];

        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {groups.length > 0 ? (
              groups.map((grp: string, idx: number) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="w-fit text-[10px] py-0 px-1.5"
                >
                  {grp}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-xs">—</span>
            )}
          </div>
        );
      },
    },
    {
      key: "detailedComposition",
      label: "Thành phần",
      render: (val, row) => {
        const comp = val || row.profile?.detailedComposition || "—";
        return <span className="text-xs max-w-[200px] truncate block">{comp}</span>;
      },
    },
    {
      key: "targetSubjects",
      label: "Đối tượng áp dụng",
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
          row.packagingVariants
            ?.map((pv: any) => formatPackagingVariantText(pv))
            .filter(Boolean) || [];
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
        if (!val)
          return <span className="text-muted-foreground text-xs">—</span>;
        const num = Number(val);
        if (isNaN(num)) return <span className="text-xs">{String(val)}</span>;
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
};

export const byProductColumns = getByProductColumns;
