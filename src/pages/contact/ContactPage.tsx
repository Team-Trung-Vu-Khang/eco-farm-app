import GenericPage from "../GenericPage";

const ContactPage = () => {
  return (
    <GenericPage
      title="Quản lý thông tin liên hệ"
      description="Quản lý thông tin liên hệ theo doanh nghiệp/nông hộ"
      entityName="thông tin liên hệ"
      initialData={[
        {
          id: 1,
          code: "CL001",
          name: "Thông tin liên hệ",
          description: "Thông tin liên hệ",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "CL002",
          name: "Thông tin liên hệ",
          description: "Thông tin liên hệ",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default ContactPage;
