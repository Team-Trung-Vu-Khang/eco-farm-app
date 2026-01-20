import GenericPage from "../GenericPage";

const DepartmentPage = () => {
  return (
    <GenericPage
      title="Quản lý phòng ban"
      description="Quản lý phòng ban theo doanh nghiệp/nông hộ"
      entityName="phòng ban"
      initialData={[
        {
          id: 1,
          code: "PB-KD",
          name: "Phòng Kinh Doanh",
          description:
            "Quản lý hoạt động bán hàng, marketing và phát triển thị trường.",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "PB-KT",
          name: "Phòng Kỹ Thuật",
          description:
            "Chịu trách nhiệm về quy trình canh tác, kỹ thuật trồng trọt và chất lượng sản phẩm.",
          status: "active",
          createdAt: "2024-01-11",
        },
        {
          id: 3,
          code: "PB-TCKT",
          name: "Phòng Tài Chính - Kế Toán",
          description:
            "Quản lý tài chính, kế toán và ngân sách của doanh nghiệp.",
          status: "active",
          createdAt: "2024-01-12",
        },
        {
          id: 4,
          code: "PB-HCNS",
          name: "Phòng Hành Chính - Nhân Sự",
          description:
            "Quản lý nhân sự, tuyển dụng, đào tạo và công tác hành chính.",
          status: "active",
          createdAt: "2024-01-15",
        },
        {
          id: 5,
          code: "PB-SX",
          name: "Phòng Sản Xuất",
          description:
            "Điều hành hoạt động sản xuất trực tiếp tại nông trại và nhà máy.",
          status: "active",
          createdAt: "2024-01-20",
        },
        {
          id: 6,
          code: "PB-LOG",
          name: "Phòng Logistics & Kho vận",
          description: "Quản lý kho bãi, vận chuyển và phân phối hàng hóa.",
          status: "active",
          createdAt: "2024-01-25",
        },
      ]}
    />
  );
};
export default DepartmentPage;
