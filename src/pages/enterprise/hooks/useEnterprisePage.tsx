import {
  Badge,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import type { Enterprise } from "../data/constants";

const formatContactTooltip = (enterprise: Enterprise) => {
  const contacts = enterprise.contacts?.length
    ? enterprise.contacts
    : enterprise.phone || enterprise.email
      ? [
          {
            name: enterprise.representative || enterprise.name,
            phone: enterprise.phone,
            email: enterprise.email,
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

export function useEnterprisePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const enterprises = useEnterpriseStore((state) => state.enterprises);
  const filterEnterprises = useMemo(() => {
    return enterprises.filter((enterprise) => enterprise.type === "enterprise");
  }, [enterprises]);
  const deleteEnterprise = useEnterpriseStore(
    (state) => state.deleteEnterprise,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Enterprise | null>(null);

  const columns: Column<Enterprise>[] = [
    {
      key: "code",
      label: "Mã",
      render: (value) => (
        <Badge
          variant="outline"
          className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-700"
        >
          {value as string}
        </Badge>
      ),
    },
    {
      key: "image",
      label: "Hình ảnh",
      render: (value) =>
        value ? (
          <img
            src={value as string}
            alt="enterprise"
            className="w-10 h-10 object-cover rounded-md border"
          />
        ) : null,
    },
    { key: "name", label: "Tên đơn vị" },
  {
    key: "classification",
    label: "Phân loại",
    render: (value) => {
      const labels: Record<string, string> = {
          production: "Sản xuất",
          processing: "Chế biến",
          trading: "Thương mại",
          service: "Dịch vụ",
          other: "Khác",
      };
      const items = value as string[];
      return (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item: string) => (
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

        return (
          <div className="max-w-[240px] space-y-1" title={formatContactTooltip(row)}>
            <div className="font-medium truncate">{primaryContact?.phone || "-"}</div>
            {extraCount > 0 && (
              <div className="text-xs text-muted-foreground">
                +{extraCount} liên hệ khác
              </div>
            )}
          </div>
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

        return (
          <div className="max-w-[240px] space-y-1" title={formatContactTooltip(row)}>
            <div className="font-medium truncate">{primaryContact?.email || "-"}</div>
            {extraCount > 0 && (
              <div className="text-xs text-muted-foreground">
                +{extraCount} liên hệ khác
              </div>
            )}
          </div>
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

  const filters = [
    {
      key: "classification",
      label: "Phân loại",
      options: [
        { label: "Sản xuất", value: "production" },
        { label: "Chế biến", value: "processing" },
        { label: "Thương mại", value: "trading" },
        { label: "Dịch vụ", value: "service" },
        { label: "Khác", value: "other" },
      ],
    },
  ];

  const handleDelete = (item: Enterprise) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteEnterprise(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa đơn vị khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  return {
    filterEnterprises,
    columns,
    filters,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    setLocation,
  };
}
