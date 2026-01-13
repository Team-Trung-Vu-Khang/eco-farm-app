import GenericPage from "../GenericPage";

const FertilizerPage = () => {
  return (
    <GenericPage
      title="Quản lý chất bón"
      description="Quản lý chất bón theo doanh nghiệp/nông hộ"
      entityName="chất bón"
      initialData={[
        {
          id: 1,
          code: "CB001",
          name: "Chất bón",
          description: "Chất bón",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "CB002",
          name: "Chất bón",
          description: "Chất bón",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default FertilizerPage;
