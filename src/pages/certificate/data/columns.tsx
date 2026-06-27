import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  Certificate,
  CertificationOrganization,
} from "../types/types";

export const organizationColumns: Column<CertificationOrganization>[] = [
  {
    key: "code",
    label: "Mã tổ chức",
    render: (value) => (
      <Badge
        variant="outline"
        className="rounded-full border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold tracking-widest text-slate-700"
      >
        {String(value)}
      </Badge>
    ),
  },
  { key: "name", label: "Tên tổ chức" },
  { key: "phone", label: "Điện thoại" },
  { key: "email", label: "Email" },
  { key: "website", label: "Website" },
];

export function getStandardColumns(
  organizations: CertificationOrganization[],
): Column<Certificate>[] {
  return [
    { key: "code", label: "Mã số" },
    { key: "name", label: "Tên tiêu chuẩn" },
    {
      key: "stampUrl",
      label: "Dấu mộc",
      render: (value) =>
        value ? (
          <img
            src={value as string}
            alt="Stamp"
            className="w-8 h-8 object-contain"
          />
        ) : (
          <span>-</span>
        ),
    },
    {
      key: "organizationIds",
      label: "Tổ chức cấp",
      render: (value) => {
        const orgIds = value as number[];
        const orgNames = organizations
          .filter((org) => orgIds.includes(org.id))
          .map((org) => org.name);

        if (orgNames.length === 0) return <span>-</span>;
        if (orgNames.length === 1) return <span>{orgNames[0]}</span>;

        return (
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">{orgNames[0]}</Badge>
            {orgNames.length > 1 && (
              <Badge variant="outline">+{orgNames.length - 1}</Badge>
            )}
          </div>
        );
      },
    },
  ];
}
