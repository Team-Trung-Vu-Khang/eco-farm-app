import { Link } from "wouter";
import { AdminLayout, DataTable, Button } from "@tankhang1/eco-shared-ui";
import usePlantStore from "../../../stores/usePlantStore";
import { type Plant } from "../../region-chart/constants";
import { Plus } from "lucide-react";

const PlantIdentificationListPage = () => {
  const { plants } = usePlantStore();

  const columns = [
    {
      key: "code",
      label: "Mã định danh",
      render: (v: string, r: Plant) => (
        <Link href={`/plant-identification/${r.id}`}>
          <a className="font-mono font-bold text-primary hover:underline cursor-pointer">
            {v}
          </a>
        </Link>
      ),
    },
    {
      key: "name",
      label: "Loại cây",
      render: (v: string) => <span className="font-medium">{v}</span>,
    },
    {
      key: "height",
      label: "C.Cao (m)",
      render: (v: string) => v || "-",
    },
    {
      key: "ageValue",
      label: "Độ tuổi",
      render: (_: any, r: Plant) => {
        if (!r.ageValue) return r.age || "-";
        const unitLabel = {
          days: "ngày",
          months: "tháng",
          years: "năm",
        }[r.ageUnit || "years"];
        return `${r.ageValue} ${unitLabel}`;
      },
    },
    {
      key: "regionName",
      label: "Vị trí địa lý",
    },
    {
      key: "areaName",
      label: "Vị trí canh tác",
    },
    {
      key: "note",
      label: "Ghi chú",
      render: (v: string) => (
        <span
          className="text-muted-foreground italic text-xs block max-w-50 truncate"
          title={v}
        >
          {v || "-"}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Định danh cây trồng"
      description="Danh sách thông tin định danh và thông số sinh trưởng của cây trồng"
      actions={
        <Link href="/plant-identification/create">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" /> Thêm mới cây
          </Button>
        </Link>
      }
    >
      <DataTable columns={columns} data={plants} />
    </AdminLayout>
  );
};

export default PlantIdentificationListPage;
