import GenericPage from "../GenericPage";

const PositionPage = () => {
  return (
    <GenericPage
      title="Quản lý vị trí"
      description="Quản lý vị trí theo doanh nghiệp/nông hộ"
      entityName="vị trí"
      initialData={[
        {
          id: 1,
          code: "POS-GD",
          name: "Giám Đốc",
          description:
            "Người đứng đầu, chịu trách nhiệm quản lý chung toàn bộ hoạt động của doanh nghiệp.",
          status: "active",
          createdAt: "2024-01-01",
        },
        {
          id: 2,
          code: "POS-TP",
          name: "Trưởng Phòng",
          description:
            "Quản lý hoạt động của một phòng ban cụ thể (Kinh doanh, Kỹ thuật, ...).",
          status: "active",
          createdAt: "2024-01-05",
        },
        {
          id: 3,
          code: "POS-KS",
          name: "Kỹ Sư Nông Nghiệp",
          description:
            "Chịu trách nhiệm kỹ thuật trồng trọt, chăm sóc và bảo vệ thực vật.",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 4,
          code: "POS-NV",
          name: "Nhân Viên Kinh Doanh",
          description: "Thực hiện tìm kiếm khách hàng, tư vấn và bán sản phẩm.",
          status: "active",
          createdAt: "2024-01-15",
        },
        {
          id: 5,
          code: "POS-KT",
          name: "Kế Toán Viên",
          description:
            "Thực hiện các công việc liên quan đến tài chính, kế toán, thuế.",
          status: "active",
          createdAt: "2024-01-20",
        },
        {
          id: 6,
          code: "POS-QL",
          name: "Quản Lý Kho",
          description: "Quản lý xuất nhập tồn, bảo quản hàng hóa trong kho.",
          status: "active",
          createdAt: "2024-01-25",
        },
        {
          id: 7,
          code: "POS-CN",
          name: "Công Nhân Sản Xuất",
          description:
            "Thực hiện các công việc lao động trực tiếp tại nông trại.",
          status: "active",
          createdAt: "2024-01-30",
        },
        {
          id: 8,
          code: "POS-BV",
          name: "Nhân Viên Bảo Vệ",
          description: "Đảm bảo an ninh, trật tự và tài sản của doanh nghiệp.",
          status: "active",
          createdAt: "2024-02-01",
        },
      ]}
    />
  );
};
export default PositionPage;
