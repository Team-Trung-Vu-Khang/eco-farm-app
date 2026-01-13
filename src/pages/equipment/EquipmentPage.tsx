import GenericPage from "../GenericPage";

const EquipmentPage = () => {
  return (
    <GenericPage
      title="Quản lý thiết bị"
      description="Quản lý thiết bị theo doanh nghiệp/nông hộ"
      entityName="thiết bị"
      initialData={[
        {
          id: 1,
          code: "TB001",
          name: "Thiết bị",
          description: "Thiết bị",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "TB002",
          name: "Thiết bị",
          description: "Thiết bị",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default EquipmentPage;
