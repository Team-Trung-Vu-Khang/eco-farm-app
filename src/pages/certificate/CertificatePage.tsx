import GenericPage from "../GenericPage";

const CertificatePage = () => {
  return (
    <GenericPage
      title="Quản lý chứng chỉ"
      description="Quản lý chứng chỉ theo doanh nghiệp/nông hộ"
      entityName="chứng chỉ"
      initialData={[
        {
          id: 1,
          code: "CH001",
          name: "Chứng chỉ",
          description: "Chứng chỉ",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "CH002",
          name: "Chứng chỉ",
          description: "Chứng chỉ",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default CertificatePage;
