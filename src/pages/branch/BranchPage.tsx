import GenericPage from "../GenericPage";

const BranchPage = () => {
  return (
    <GenericPage
      title="Quản lý chi nhánh"
      description="Quản lý chi nhánh theo doanh nghiệp/nông hộ"
      entityName="chi nhánh"
      initialData={[
        {
          id: 1,
          code: "CN001",
          name: "Chi nhánh",
          description: "Chi nhánh",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "CN002",
          name: "Chi nhánh",
          description: "Chi nhánh",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default BranchPage;
