import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CodeBadge } from "@/components/CodeBadge";
import type { Enterprise } from "../../enterprise/data/constants";

const formatContactTooltip = (farmer: Enterprise) => {
  const contacts = farmer.contacts?.length
    ? farmer.contacts
    : farmer.phone || farmer.email
      ? [
          {
            name: farmer.representative || farmer.name,
            phone: farmer.phone,
            email: farmer.email,
          },
        ]
      : [];

  return contacts
    .map((contact, index) => {
      const parts = [
        `${index + 1}. ${contact.name || "Liên hệ"}`,
        contact.phone ? `SĐT: ${contact.phone}` : null,
        contact.email ? `Email: ${contact.email}` : null,
      ].filter(Boolean);

      return parts.join(" | ");
    })
    .join("\n");
};

export const farmerColumns: Column<Enterprise>[] = [
  {
    key: "code",
    label: "Mã",
    render: (value) => <CodeBadge value={value} />,
  },
  {
    key: "image",
    label: "Hình ảnh",
    render: (value) =>
      value ? (
        <img
          src={value as string}
          alt="farmer"
          className="w-10 h-10 object-cover rounded-md border"
        />
      ) : null,
  },
  { key: "name", label: "Tên nông hộ" },
  {
    key: "classification",
    label: "Lĩnh vực",
    render: (value) => {
      const labels: Record<string, string> = {
        production: "Sản xuất",
        processing: "Chế biến",
        trading: "Thương mại",
        service: "Dịch vụ",
        other: "Khác",
      };
      return (
        <div className="flex flex-wrap gap-1.5">
          {(value as string[])?.map((item: string) => (
            <Badge
              key={item}
              variant="secondary"
              className="rounded-full bg-primary/10 px-2.5 py-1 text-primary"
            >
              {labels[item] || item}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    key: "phone",
    label: "Điện thoại",
    render: (_value, row) => {
      const contacts = row.contacts?.length
        ? row.contacts
        : row.phone || row.email
          ? [
              {
                name: row.representative || row.name,
                phone: row.phone,
                email: row.email,
              },
            ]
          : [];

      const primaryContact = contacts[0];
      const extraCount = Math.max(0, contacts.length - 1);

      return primaryContact?.phone ? (
        <div className="max-w-[240px] space-y-1" title={formatContactTooltip(row)}>
          <Badge
            variant="outline"
            className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-700"
          >
            {primaryContact.phone}
          </Badge>
          {extraCount > 0 && (
            <div className="text-xs text-muted-foreground">
              +{extraCount} liên hệ khác
            </div>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    key: "email",
    label: "Email",
    render: (_value, row) => {
      const contacts = row.contacts?.length
        ? row.contacts
        : row.phone || row.email
          ? [
              {
                name: row.representative || row.name,
                phone: row.phone,
                email: row.email,
              },
            ]
          : [];

      const primaryContact = contacts[0];
      const extraCount = Math.max(0, contacts.length - 1);

      return primaryContact?.email ? (
        <div className="max-w-[240px] space-y-1" title={formatContactTooltip(row)}>
          <Badge
            variant="secondary"
            className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700"
          >
            {primaryContact.email}
          </Badge>
          {extraCount > 0 && (
            <div className="text-xs text-muted-foreground">
              +{extraCount} liên hệ khác
            </div>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  { key: "address", label: "Địa chỉ" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge
        variant={value === "active" ? "default" : "outline"}
        className="rounded-full px-2.5 py-1"
      >
        {value === "active" ? "Hoạt động" : "Không hoạt động"}
      </Badge>
    ),
  },
];
