import GenericPage from "../GenericPage";

const GrowthCyclePage = () => {
  return (
    <GenericPage
      title="Quản lý chu kỳ sinh trưởng"
      description="Các giai đoạn phát triển của cây trồng"
      entityName="chu kỳ"
      initialData={[
        {
          id: 1,
          code: "CK001",
          name: "Giai đoạn cây con",
          description: "0-12 tháng sau trồng",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "CK002",
          name: "Giai đoạn sinh trưởng",
          description: "12-36 tháng",
          status: "active",
          createdAt: "2024-01-11",
        },
        {
          id: 3,
          code: "CK003",
          name: "Giai đoạn ra hoa",
          description: "Cây bắt đầu ra hoa",
          status: "active",
          createdAt: "2024-01-12",
        },
        {
          id: 4,
          code: "CK004",
          name: "Giai đoạn đậu quả",
          description: "Cây đậu quả và phát triển",
          status: "active",
          createdAt: "2024-01-13",
        },
        {
          id: 5,
          code: "CK005",
          name: "Giai đoạn thu hoạch",
          description: "Quả chín, sẵn sàng thu hoạch",
          status: "active",
          createdAt: "2024-01-14",
        },
      ]}
    />
  );
};
export default GrowthCyclePage;
