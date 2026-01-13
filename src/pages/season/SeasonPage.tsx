import GenericPage from "../GenericPage";

const SeasonPage = () => {
  return (
    <GenericPage
      title="Quản lý mùa vụ"
      description="Quản lý mùa vụ theo doanh nghiệp/nông hộ"
      entityName="mùa vụ"
      initialData={[
        {
          id: 1,
          code: "MU001",
          name: "Mùa vụ thu hoạch",
          description: "Mùa vụ thu hoạch",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "MU002",
          name: "Mùa vụ trồng",
          description: "Mùa vụ trồng",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default SeasonPage;
