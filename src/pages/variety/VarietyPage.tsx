import GenericPage from "../GenericPage";

const VarietyPage = () => {
  return (
    <GenericPage
      title="Quản lý giống cây trồng"
      description="Các giống cây trồng có trên thị trường"
      entityName="giống cây"
      initialData={[
        {
          id: 1,
          code: "GCT001",
          name: "Sầu riêng Ri6",
          description: "Giống sầu riêng phổ biến",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "GCT002",
          name: "Sầu riêng Monthon",
          description: "Giống Thái Lan",
          status: "active",
          createdAt: "2024-01-11",
        },
        {
          id: 3,
          code: "GCT003",
          name: "Xoài Cát Hòa Lộc",
          description: "Giống xoài đặc sản",
          status: "active",
          createdAt: "2024-01-12",
        },
      ]}
    />
  );
};
export default VarietyPage;
