import GenericPage from "../GenericPage";

const PositionPage = () => {
  return (
    <GenericPage
      title="Quản lý vị trí"
      description="Quản lý vị trí theo doanh nghiệp/nông hộ"
      entityName="vị trí"
      initialData={[
        {
          id: 1,
          code: "VP001",
          name: "Vị trí",
          description: "Vị trí",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "VP002",
          name: "Vị trí",
          description: "Vị trí",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default PositionPage;
