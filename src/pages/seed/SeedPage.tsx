import GenericPage from "../GenericPage";

const SeedPage = () => {
  return (
    <GenericPage
      title="Quản lý hạt giống"
      description="Quản lý hạt giống theo doanh nghiệp/nông hộ"
      entityName="hạt giống"
      initialData={[
        {
          id: 1,
          code: "HG001",
          name: "Hạt giống sầu riêng Ri6",
          description: "Nhập từ viện nghiên cứu",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "HG002",
          name: "Cây giống xoài Cát",
          description: "Cây ghép 1 năm tuổi",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default SeedPage;
