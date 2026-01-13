import GenericPage from "../GenericPage";

const CultivationZonePage = () => {
  return (
    <GenericPage
      title="Quản lý vùng canh tác"
      description="Quản lý vùng canh tác khi đã xác định cây trồng"
      entityName="vùng canh tác"
      initialData={[
        {
          id: 1,
          code: "VCT001",
          name: "Vùng A1 - Sầu riêng",
          description: "Trồng sầu riêng Monthon",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "VCT002",
          name: "Vùng B1 - Xoài",
          description: "Trồng xoài Cát Hòa Lộc",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default CultivationZonePage;
