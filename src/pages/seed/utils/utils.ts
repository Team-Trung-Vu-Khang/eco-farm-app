import type { Supplier } from "../data/mocks";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const cropGroups = [
  { id: "food", name: "Cây lương thực" },
  { id: "fruit", name: "Cây ăn quả" },
  { id: "industrial", name: "Cây công nghiệp" },
];

export const crops: Record<
  string,
  { id: string; name: string; image: string }[]
> = {
  food: [
    {
      id: "rice",
      name: "Lúa",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO3jT_HEXMWHft0Z_YK9nDApKXFJsh1qXdcA&s",
    },
    {
      id: "corn",
      name: "Bắp",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjE-P9TcZSVsvzEDOqbCqIwpfSBakq8901Cg&s",
    },
  ],
  fruit: [
    {
      id: "durian",
      name: "Sầu riêng",
      image:
        "https://bizweb.dktcdn.net/thumb/grande/100/396/015/products/logovietfruit-7fc573e9-36f8-44a5-80ba-e2ce2bd998ca.jpg?v=1671522040127",
    },
    {
      id: "mango",
      name: "Xoài",
      image:
        "https://suckhoedoisong.qltns.mediacdn.vn/Images/duylinh/2019/08/15/8-loi-ich-it-biet-cua-xoai1565855128.jpg",
    },
  ],
  industrial: [
    {
      id: "coffee",
      name: "Cà phê",
      image:
        "https://thoibaotaichinhvietnam.vn/stores/news_dataimages/2026/012026/25/06/in_article/ngay-251-gia-ca-phe-tang-manh-ho-tieu-neo-cao-o-nguong-150000-dongkg-20260125062559.jpg?rt=20260125062600",
    },
    {
      id: "pepper",
      name: "Hồ tiêu",
      image:
        "https://bcp.cdnchinhphu.vn/334894974524682240/2025/2/25/444132dd1a93f3cdaa82-17404595689801945801880.jpg",
    },
  ],
};

export const varietiesByCrop: Record<
  string,
  { id: string; name: string; code?: string; image?: string }[]
> = {
  durian: [
    {
      id: "VARI01",
      name: "Sầu riêng Ri6",
      code: "VARI01",
      image:
        "https://bizweb.dktcdn.net/thumb/grande/100/396/015/products/logovietfruit-7fc573e9-36f8-44a5-80ba-e2ce2bd998ca.jpg?v=1671522040127",
    },
    {
      id: "VARI02",
      name: "Sầu riêng Dona",
      code: "VARI02",
      image:
        "https://traicaytonyteo.com/uploads/source/sau-rieng-dona-thai-2.jpg",
    },
    {
      id: "VARI03",
      name: "Sầu riêng Musang King",
      code: "VARI03",
      image:
        "https://sauriengoi.vn/wp-content/uploads/2023/08/SAU-RIENG-MUSANG-KING-1-1.jpg",
    },
    {
      id: "VARI04",
      name: "Sầu riêng Black Thorn",
      code: "VARI04",
      image:
        "https://vinadurian.com/wp-content/uploads/2023/11/sau-rieng-black-thorn-05-i.jpg",
    },
  ],
  rice: [
    {
      id: "VARI06",
      name: "Lúa OM5451",
      code: "VARI06",
      image:
        "https://lh4.googleusercontent.com/proxy/MLacA6_LHyfmPvTfcrouV2QTLptGspn7YeqqJ9pAjtfQIl262TRrvqXI5nMWlZuSLoOKCs3pwfShUOALa0aEKTu8ATDBIrKX07oDdVXW6fdSHTlsi6vflJMhwO5QILIl3Dz5GLaveQ",
    },
  ],
  soybeans: [
    {
      id: "VARI07",
      name: "Đậu nành DT84",
      code: "VARI07",
      image:
        "https://media.vietnamplus.vn/images/c14f6479e83e315b4cf3a2906cc6a51e875525f3bbe20f9343607ad07a01c92f147aae408267e18cb342aaa0dd834e734827afe323f4eee8886d1806df7f097c/dautuong.jpg.webp",
    },
    {
      id: "VARI08",
      name: "Đậu nành DX11",
      code: "VARI08",
      image:
        "https://i.ex-cdn.com/nongnghiepmoitruong.vn/files/f1/Image/2009/7/5/05072009145217.jpg",
    },
  ],
};

export const originSelectOptions = [
  { value: "Vietnam", label: "Việt Nam" },
  { value: "Thailand", label: "Thái Lan" },
  { value: "USA", label: "Mỹ" },
  { value: "China", label: "Trung Quốc" },
  { value: "Japan", label: "Nhật Bản" },
  { value: "Malaysia", label: "Malaysia" },
];

export function filterSuppliers(suppliers: Supplier[], query: string) {
  const normalizedQuery = query.toLowerCase();

  return suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(normalizedQuery) ||
      supplier.code.toLowerCase().includes(normalizedQuery) ||
      supplier.representative.toLowerCase().includes(normalizedQuery),
  );
}
