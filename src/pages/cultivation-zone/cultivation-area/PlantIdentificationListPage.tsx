import { Link } from "wouter";
import { AdminLayout, DataTable, Button } from "@tankhang1/eco-shared-ui";
import usePlantStore from "@/stores/usePlantStore";
import useRegionStore from "@/stores/useRegionStore";
import { type Plant } from "@/pages/region-chart/constants";
import { Plus, MapPin, Upload } from "lucide-react";
import { ImportPlantDialog } from "./components/ImportPlantDialog";
import { useState } from "react";

const PlantIdentificationListPage = () => {
  const { plants } = usePlantStore();
  const [isImportOpen, setIsImportOpen] = useState(false);

  const columns = [
    {
      key: "code",
      label: "Mã định danh",
      render: (v: string, r: Plant) => (
        <Link href={`/plant-identification/${r.id}`}>
          <a className="font-mono font-bold text-primary hover:underline cursor-pointer">
            {v ?? r.id}
          </a>
        </Link>
      ),
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
      key: "coordinate",
      label: "Tạo độ",
      render: (_: any, r: Plant) => {
        return (
          <span className="text-muted-foreground italic text-xs font-mono">
            {r.coordinate?.lat} / {r.coordinate?.lng}
          </span>
        );
      },
    },
    {
      key: "regionName",
      label: "Vị trí địa lý",
      render: (_: any, r: Plant) => {
        if (!r.plotId) {
          return (
            <span className="text-muted-foreground italic text-xs">
              Chưa xác định
            </span>
          );
        }
        const regionStore = useRegionStore.getState();
        const plotData = regionStore.getPlotById(r.plotId);
        if (plotData) return <span>{plotData.region.name}</span>;
        const areaData = regionStore.getAreaById(r.plotId);
        if (areaData) return <span>{areaData.region.name}</span>;
        const regionData = regionStore.regions.find(
          (reg) => String(reg.id) === String(r.plotId),
        );
        if (regionData) return <span>{regionData.name}</span>;

        return (
          <span className="text-muted-foreground italic text-xs">
            Chưa xác định
          </span>
        );
      },
    },
    {
      key: "areaName",
      label: "Vị trí canh tác",
      render: (_: any, r: Plant) => {
        if (!r.plotId) {
          return (
            <span className="text-muted-foreground italic text-xs">
              Chưa xác định
            </span>
          );
        }
        const regionStore = useRegionStore.getState();
        const badgeClass =
          "inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium";

        const plotData = regionStore.getPlotById(r.plotId);
        if (plotData) {
          return (
            <span className={badgeClass}>
              <MapPin className="w-2.5 h-2.5" />
              {plotData.area.name} / {plotData.plot.name}
            </span>
          );
        }

        const areaData = regionStore.getAreaById(r.plotId);
        if (areaData) {
          return (
            <span className={badgeClass}>
              <MapPin className="w-2.5 h-2.5" />
              {areaData.area.name}
            </span>
          );
        }

        const regionData = regionStore.regions.find(
          (reg) => String(reg.id) === String(r.plotId),
        );
        if (regionData) {
          return (
            <span className={badgeClass}>
              <MapPin className="w-2.5 h-2.5" />
              {regionData.name}
            </span>
          );
        }

        return (
          <span className="text-muted-foreground italic text-xs">
            Chưa xác định
          </span>
        );
      },
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
    <>
      <AdminLayout
        title="Định danh cây trồng"
        description="Danh sách thông tin định danh và thông số sinh trưởng của cây trồng"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" /> Nhập từ Excel
            </Button>
            <Link href="/plant-identification/create">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" /> Thêm mới cây
              </Button>
            </Link>
          </div>
        }
      >
        <DataTable columns={columns} data={plants} />
      </AdminLayout>
      <ImportPlantDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
    </>
  );
};

export default PlantIdentificationListPage;
