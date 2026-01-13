import GenericPage from "../GenericPage";

const UnitPage = () => {
  return (
    <GenericPage
      title="Quản lý đơn vị"
      description="Quản lý đơn vị theo doanh nghiệp/nông hộ"
      entityName="đơn vị"
      initialData={[
        {
          id: 1,
          code: "DV001",
          name: "Đơn vị",
          description: "Đơn vị",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "DV002",
          name: "Đơn vị",
          description: "Đơn vị",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default UnitPage;
