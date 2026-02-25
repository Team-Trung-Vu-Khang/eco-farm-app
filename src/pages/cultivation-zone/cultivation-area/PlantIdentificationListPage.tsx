import { Link } from "wouter";
import {
  AdminLayout,
  DataTable,
  Badge,
  Button,
} from "@tankhang1/eco-shared-ui";
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
      label: "Chiều cao",
    },
    {
      key: "age",
      label: "Độ tuổi",
    },
    {
      key: "canopy",
      label: "Tán",
    },
    {
      key: "rootSpread",
      label: "Rễ",
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
      key: "status",
      label: "Hiện trạng",
      render: (v: string) => {
        const config: Record<
          string,
          {
            label: string;
            variant: "default" | "secondary" | "destructive" | "outline";
          }
        > = {
          healthy: { label: "Khỏe mạnh", variant: "default" },
          warning: { label: "Cần chú ý", variant: "secondary" },
          critical: { label: "Nguy kịch", variant: "destructive" },
        };
        const item = config[v] || { label: v, variant: "outline" };
        return <Badge variant={item.variant}>{item.label}</Badge>;
      },
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
