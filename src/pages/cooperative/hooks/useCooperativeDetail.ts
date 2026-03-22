import { useState, useEffect } from "react";
import { useRoute } from "wouter";

export function useCooperativeDetail() {
  const [, params] = useRoute("/cooperative/:id");
  const [data, setData] = useState<any>(null);
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [branchSearchQuery, setBranchSearchQuery] = useState("");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        id: params?.id || "DN2024001",
        type: "cooperative",
        code: "DN2024001",
        name: "Hợp tác xã Nông nghiệp Xanh EcoFarm",
        brandName: "EcoFarm Vietnam",
        taxCode: "0101234567",
        taxAddress: "Tầng 5, Tòa nhà ABC, Cầu Giấy, Hà Nội",
        classification: ["production", "processing"],
        foundedDate: "2020-03-15",
        representative: "Nguyễn Văn Giám Đốc",
        phone: "02438888999",
        email: "contact@ecofarm.vn",
        website: "https://ecofarm.vn",
        province: "Hà Nội",
        district: "Cầu Giấy",
        ward: "Dịch Vọng",
        address: "Số 123 Đường Xuân Thủy",
        image:
          "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/company-logo-design-template-e089327a5c476ce5c70c74f7359c5898_screen.jpg?ts=1672291305",
        description:
          "Hợp tác xã tiên phong trong lĩnh vực nông nghiệp công nghệ cao, chuyên sản xuất và cung ứng rau sạch chuẩn VietGAP. Chúng tôi cam kết mang đến những sản phẩm an toàn, chất lượng nhất cho người tiêu dùng.",
        branches: [
          {
            name: "Chi nhánh Miền Nam",
            taxCode: "0101234567-001",
            phone: "02839999888",
            taxAddress: "Quận 1, TP.HCM",
            email: "hcm@ecofarm.vn",
            address: "Số 456 Nguyễn Thị Minh Khai, Q1",
            note: "Văn phòng đại diện phía Nam",
          },
        ],
        bankAccounts: [
          {
            bankName: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
            accountHolder: "ECOFARM CORP",
            accountNumber: "0011001234567",
            branch: "Sở Giao Dịch",
            note: "Tài khoản chính",
          },
          {
            bankName: "Ngân hàng TMCP Quân Đội (MBBank)",
            accountHolder: "NGUYEN VAN A",
            accountNumber: "88889999",
            branch: "Hoàn Kiếm",
            note: "Tài khoản cá nhân",
          },
        ],
        documents: [
          {
            name: "giay_phep_kinh_doanh.pdf",
            type: "application/pdf",
            size: "2.5MB",
            date: "15/03/2020",
          },
          {
            name: "chung_chi_vietgap.jpg",
            type: "image/jpeg",
            size: "1.8MB",
            date: "20/04/2021",
          },
        ],
        status: "active",
        createdAt: "2024-01-15T10:30:00Z",
      });
    }, 500);
  }, [params?.id]);

  return {
    data,
    bankSearchQuery,
    setBankSearchQuery,
    branchSearchQuery,
    setBranchSearchQuery,
  };
}
