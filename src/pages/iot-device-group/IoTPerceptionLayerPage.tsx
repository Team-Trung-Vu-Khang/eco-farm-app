import {
  Badge,
  type Column,
  DataTable,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface StaticDataItem {
  id: string;
  label: string;
  description: string;
}

const columns: Column<StaticDataItem>[] = [
  {
    key: "id",
    label: "Mã",
    render: (value) => (
      <Badge variant="outline" className="bg-background font-mono">
        {String(value ?? "")}
      </Badge>
    ),
  },
  { key: "label", label: "Tên" },
  { key: "description", label: "Mô tả" },
];

const data: StaticDataItem[] = [
  {
    id: "do_sensor",
    label: "Cảm biến DO (Oxy hòa tan)",
    description:
      "Quan trọng nhất. Thường dùng cảm biến quang học (Optical DO sensor) thay vì điện hóa để giảm sai số và ít phải hiệu chuẩn lại.",
  },
  {
    id: "ph_temp_sensor",
    label: "Cảm biến pH & Nhiệt độ",
    description:
      "Cặp chỉ số cơ bản luôn đi liền với nhau, ảnh hưởng trực tiếp đến độ độc của các khí khác trong nước.",
  },
  {
    id: "orp_salinity_alkalinity_sensor",
    label: "Cảm biến ORP & Độ mặn/Độ kiềm",
    description:
      "Chỉ số oxy hóa khử và độ mặn/độ kiềm, dùng để đánh giá mức độ ô nhiễm hữu cơ và chất lượng bùn đáy.",
  },
  {
    id: "rain_gauge",
    label: "Cảm biến Lượng mưa (Rain Gauge)",
    description:
      "Rất quan trọng trong nuôi trồng thủy sản. Một cơn mưa lớn đột ngột sẽ rửa trôi phèn trên bờ xuống ao, làm tụt pH nghiêm trọng và gây sốc nhiệt. Dữ liệu giúp kích hoạt cảnh báo rải vôi quanh bờ ao trước khi mưa dông lớn.",
  },
  {
    id: "anemometer",
    label: "Cảm biến Tốc độ và Hướng gió (Anemometer / Wind Vane)",
    description:
      "Gió mạnh ảnh hưởng đến sự phân tầng nhiệt độ nước và khả năng khuếch tán oxy. Trong phun thuốc BVTV bằng Drone, thiết bị này giúp tính toán độ trôi dạt của thuốc để tránh phun nhầm.",
  },
  {
    id: "air_temp_humidity_sensor",
    label: "Cảm biến Nhiệt độ & Độ ẩm không khí",
    description:
      "Giúp tính toán tốc độ bốc hơi nước của ao hồ hoặc dự báo nguy cơ bùng phát nấm bệnh trên cây trồng.",
  },
  {
    id: "lux_par_sensor",
    label: "Cảm biến Cường độ sáng (Lux) / Bức xạ quang hợp (PAR Sensor)",
    description:
      "Trong ao nuôi cá, cường độ ánh sáng quyết định chu kỳ phát triển của tảo. Cảm biến cảnh báo sớm nguy cơ bùng phát tảo (tảo nở hoa) để có biện pháp đánh vi sinh xử lý kịp thời, tránh tình trạng tảo tàn hút cạn oxy.",
  },
  {
    id: "uv_sensor",
    label: "Cảm biến Bức xạ tia UV",
    description: "Giúp đánh giá mức độ sốc nhiệt độ bề mặt.",
  },
  {
    id: "ai_camera",
    label: "Camera AI (Cảm biến thị giác thông minh)",
    description:
      "Đóng vai trò như một cảm biến thu thập dữ liệu phi cấu trúc. Theo dõi hành vi cắn mồi của cá để tự động điều tiết thức ăn, hoặc phát hiện sớm cá nổi đầu do thiếu oxy. Mảng kinh doanh giải pháp công nghệ có tiềm năng mở rộng mạnh mẽ.",
  },
  {
    id: "multispectral_drones",
    label: "Drone mang Cảm biến quang phổ đa sắc (Multispectral Drones)",
    description:
      "Dùng để số hóa và thiết lập bản đồ số vùng nguyên liệu quy mô lớn (vài trăm hecta). Chụp lại chỉ số phản xạ ánh sáng của lá cây/màu nước ao để xuất ra bản đồ nhiệt (Heatmap) phát hiện khu vực thiếu dinh dưỡng hoặc có nguy cơ dịch bệnh mà mắt thường không thấy.",
  },
];

interface Props {
  onEdit?: (item: any) => void;
}

const IoTPerceptionLayerPage = ({ onEdit }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Lớp Cảm nhận</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Các thiết bị phần cứng thu thập dữ liệu trực tiếp tại hiện trường
            (Node thiết bị).
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchable={false}
        totalElements={data.length}
        totalPages={1}
        currentIndex={1}
        pageSize={data.length}
        onEdit={onEdit}
      />
    </div>
  );
};

export default IoTPerceptionLayerPage;
