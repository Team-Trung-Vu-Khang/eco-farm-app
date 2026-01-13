import GenericPage from "../GenericPage";

const TaskPage = () => {
  return (
    <GenericPage
      title="Quản lý nhiệm vụ"
      description="Quản lý nhiệm vụ theo doanh nghiệp/nông hộ"
      entityName="nhiệm vụ"
      initialData={[
        {
          id: 1,
          code: "DN001",
          name: "Nhiệm vụ",
          description: "Nhiệm vụ",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "DN002",
          name: "Nhiệm vụ",
          description: "Nhiệm vụ",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default TaskPage;
