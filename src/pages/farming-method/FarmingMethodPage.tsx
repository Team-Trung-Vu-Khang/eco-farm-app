import GenericPage from "../GenericPage";

const FarmingMethodPage = () => {
  return (
    <GenericPage
      title="Quản lý phương thức canh tác"
      description="Các phương thức canh tác áp dụng trong sản xuất"
      entityName="phương thức"
      initialData={[
        {
          id: 1,
          code: "PT001",
          name: "Canh tác hữu cơ",
          description: "Không sử dụng hóa chất, tuân thủ tiêu chuẩn hữu cơ",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "PT002",
          name: "Canh tác truyền thống",
          description: "Phương pháp canh tác truyền thống địa phương",
          status: "active",
          createdAt: "2024-01-11",
        },
        {
          id: 3,
          code: "PT003",
          name: "Canh tác công nghệ cao",
          description: "Áp dụng IoT, tưới tự động, nhà màng",
          status: "active",
          createdAt: "2024-01-12",
        },
        {
          id: 4,
          code: "PT004",
          name: "Thủy canh",
          description: "Trồng cây trong dung dịch dinh dưỡng",
          status: "active",
          createdAt: "2024-01-13",
        },
      ]}
    />
  );
};
export default FarmingMethodPage;
