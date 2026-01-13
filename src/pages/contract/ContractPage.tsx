import GenericPage from "../GenericPage";

const ContractPage = () => {
  return (
    <GenericPage
      title="Quản lý hợp đồng"
      description="Quản lý hợp đồng theo doanh nghiệp/nông hộ"
      entityName="hợp đồng"
      initialData={[
        {
          id: 1,
          code: "HD001",
          name: "Hợp đồng",
          description: "Hợp đồng",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "HD002",
          name: "Hợp đồng",
          description: "Hợp đồng",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default ContractPage;
