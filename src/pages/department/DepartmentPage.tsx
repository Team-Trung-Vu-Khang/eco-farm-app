import GenericPage from "../GenericPage";

const DepartmentPage = () => {
  return (
    <GenericPage
      title="Quản lý phòng ban"
      description="Quản lý phòng ban theo doanh nghiệp/nông hộ"
      entityName="phòng ban"
      initialData={[
        {
          id: 1,
          code: "PB001",
          name: "Phòng ban",
          description: "Phòng ban",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "PB002",
          name: "Phòng ban",
          description: "Phòng ban",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default DepartmentPage;
