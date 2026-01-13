import GenericPage from "../GenericPage";

const LandPage = () => {
  return (
    <GenericPage
      title="Quản lý đất"
      description="Phân loại và quản lý các loại đất canh tác"
      entityName="loại đất"
      initialData={[
        {
          id: 1,
          code: "DAT001",
          name: "Đất phù sa",
          description: "Đất màu mỡ, giàu dinh dưỡng",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "DAT002",
          name: "Đất đỏ bazan",
          description: "Đất núi lửa, phù hợp cây công nghiệp",
          status: "active",
          createdAt: "2024-01-11",
        },
        {
          id: 3,
          code: "DAT003",
          name: "Đất cát",
          description: "Đất thoát nước tốt",
          status: "active",
          createdAt: "2024-01-12",
        },
      ]}
    />
  );
};
export default LandPage;
