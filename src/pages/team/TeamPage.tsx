import GenericPage from "../GenericPage";

const TeamPage = () => {
  return (
    <GenericPage
      title="Quản lý đội ngũ"
      description="Quản lý đội ngũ theo doanh nghiệp/nông hộ"
      entityName="đội ngũ"
      initialData={[
        {
          id: 1,
          code: "DN001",
          name: "Đội ngũ",
          description: "Đội ngũ",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "DN002",
          name: "Đội ngũ",
          description: "Đội ngũ",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default TeamPage;
