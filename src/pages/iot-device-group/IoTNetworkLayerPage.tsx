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
    id: "lorawan",
    label: "Công nghệ truyền dẫn: LoRaWAN",
    description:
      "Lựa chọn tối ưu nhất hiện nay. Một trạm Gateway đặt ở vị trí cao có thể thu nhận tín hiệu từ các phao cảm biến trong bán kính 5-10km với mức tiêu thụ năng lượng cực thấp.",
  },
  {
    id: "4g_nbiot",
    label: "Công nghệ truyền dẫn: 4G/NB-IoT (Narrowband IoT)",
    description:
      "Sử dụng thẳng hạ tầng trạm phát sóng của nhà mạng viễn thông. Thích hợp nếu vùng nuôi rải rác không tập trung.",
  },
  {
    id: "transmission_protocols",
    label: "Giao thức truyền tải (Protocol): MQTT / WebSockets",
    description:
      "Trong lập trình, luồng dữ liệu (payload) từ thiết bị thường được đẩy về qua giao thức MQTT hoặc WebSockets. Đây là các giao thức rất nhẹ, độ trễ thấp (real-time), hoàn hảo để đảm bảo thông số hiển thị trên giao diện cập nhật theo từng giây.",
  },
];

interface Props {
  onEdit?: (item: any) => void;
}

const IoTNetworkLayerPage = ({ onEdit }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Lớp Mạng & Truyền tải</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Các công nghệ và giao thức truyền tải dữ liệu từ hiện trường về máy chủ.
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

export default IoTNetworkLayerPage;
