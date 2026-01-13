import GenericPage from "../GenericPage";

const GeoZonePage = () => {
  return (
    <GenericPage
      title="Quản lý vùng trồng địa lý"
      description="Quản lý vùng trồng về mặt địa lý chưa phân bổ"
      entityName="vùng trồng"
      initialData={[
        {
          id: 1,
          code: "VT001",
          name: "Vùng A - Bình Phước",
          description: "Diện tích 50 ha",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "VT002",
          name: "Vùng B - Đồng Nai",
          description: "Diện tích 30 ha",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default GeoZonePage;
