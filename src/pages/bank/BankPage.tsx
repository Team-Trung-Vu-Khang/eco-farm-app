import GenericPage from "../GenericPage";

const BankPage = () => {
  return (
    <GenericPage
      title="Quản lý thông tin ngân hàng"
      description="Quản lý tài khoản ngân hàng của doanh nghiệp/nông hộ"
      entityName="tài khoản"
      initialData={[
        {
          id: 1,
          code: "NH001",
          name: "Vietcombank - 0123456789",
          description: "Tài khoản chính",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "NH002",
          name: "Agribank - 9876543210",
          description: "Tài khoản phụ",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default BankPage;
