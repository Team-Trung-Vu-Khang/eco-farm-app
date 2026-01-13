import GenericPage from "../GenericPage";

const MaterialPage = () => {
  return (
    <GenericPage
      title="Quản lý vật liệu"
      description="Quản lý vật liệu theo doanh nghiệp/nông hộ"
      entityName="vật liệu"
      initialData={[
        {
          id: 1,
          code: "VL001",
          name: "Vật liệu",
          description: "Vật liệu",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "VL002",
          name: "Vật liệu",
          description: "Vật liệu",
          status: "active",
          createdAt: "2024-01-11",
        },
      ]}
    />
  );
};
export default MaterialPage;
