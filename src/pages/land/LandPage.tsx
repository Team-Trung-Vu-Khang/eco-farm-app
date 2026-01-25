import GenericPage from "../GenericPage";

const LandPage = () => {
  return (
    <GenericPage
      title="Quản lý đất"
      description="Phân loại và quản lý các loại đất canh tác"
      entityName="loại đất"
      enableImage={true}
      initialData={[
        {
          id: 1,
          code: "DAT001",
          name: "Đất phù sa",
          image: "https://sudospaces.com/vietchem/2024/03/dat-phu-sa-1.jpg",
          description:
            "Đất màu mỡ, giàu dinh dưỡng, thích hợp trồng lúa, hoa màu",
          status: "active",
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          code: "DAT002",
          name: "Đất đỏ bazan",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlmrvqQAVCVUx0FvNxr-07y7p_B9K2dnaUMg&s",
          description:
            "Đất núi lửa, tầng đất dày, thích hợp cây công nghiệp (cà phê, cao su)",
          status: "active",
          createdAt: "2024-01-11",
        },
        {
          id: 3,
          code: "DAT003",
          name: "Đất cát",
          image:
            "https://chaunhuatrongcayblog.wordpress.com/wp-content/uploads/2023/09/image-6.png",
          description: "Đất thô, thoát nước nhanh, nghèo dinh dưỡng",
          status: "active",
          createdAt: "2024-01-12",
        },
        {
          id: 4,
          code: "DAT004",
          name: "Đất mùn",
          image:
            "https://sfarm.vn/wp-content/uploads/2021/01/mun-huu-co-la-gi.jpg",
          description:
            "Đất đen, tơi xốp, giàu chất hữu cơ, rất tốt cho cây trồng",
          status: "active",
          createdAt: "2024-01-13",
        },
        {
          id: 5,
          code: "DAT005",
          name: "Đất phèn",
          image:
            "https://tanhuyhoang.net/wp-content/uploads/2021/10/Picture44.jpg",
          description: "Đất chua, độ pH thấp, thường bị nứt nẻ khi khô hạn",
          status: "active",
          createdAt: "2024-01-14",
        },
        {
          id: 6,
          code: "DAT006",
          name: "Đất sét",
          image:
            "https://file.hstatic.net/1000269461/file/dat-set-la-gi_d1cb0d6dcf18410096c471077cd3002e_grande.jpg",
          description:
            "Đất hạt mịn, dẻo, giữ nước và dinh dưỡng tốt nhưng kém thoáng khí",
          status: "active",
          createdAt: "2024-01-15",
        },
      ]}
    />
  );
};
export default LandPage;
