import { useState, useRef, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import {
  Upload,
  MapPin,
  Plus,
  Trash2,
  Building2,
  CreditCard,
  Users,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import {
  AdminLayout,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
  Card,
  CardContent,
  Badge,
  StepperForm,
  type Step,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@tankhang1/eco-shared-ui";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useBranchStore from "../../stores/useBranchStore";
import useEnterpriseStore from "../../stores/useEnterpriseStore";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface ContactPerson {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

interface ContactInfo {
  id: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch: string;
  isPrimary: boolean;
}

interface BranchFormData {
  code: string;
  name: string;
  enterpriseId: string;
  enterpriseName: string;
  // Thông tin thuế
  taxCode: string;
  taxAddress: string;
  // Website
  website: string;
  // Địa chỉ
  address: string;
  city: string;
  district: string;
  ward: string;
  // Hình ảnh
  imageUrl: string;
  imageFile?: File;
  // Định vị
  latitude: number;
  longitude: number;
  // Trạng thái
  status: "active" | "inactive";
  // Danh sách
  contactInfos: ContactInfo[];
  contacts: ContactPerson[];
  bankAccounts: BankAccount[];
}

// Component để xử lý click trên bản đồ
function LocationMarker({
  position,
  setPosition,
}: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

// Component để cập nhật center của map khi vị trí thay đổi
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMapEvents({});

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

export default function BranchFormPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/branch/:id/edit");
  const isEdit = !!params?.id;
  const branchId = params?.id ? parseInt(params.id) : undefined;

  // Zustand store hooks
  const getBranchById = useBranchStore((state) => state.getBranchById);
  const addBranch = useBranchStore((state) => state.addBranch);
  const updateBranch = useBranchStore((state) => state.updateBranch);
  const branches = useBranchStore((state) => state.branches);
  const branch = branchId ? getBranchById(branchId) : undefined;

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [formData, setFormData] = useState<BranchFormData>({
    code: "",
    name: "",
    enterpriseId: "",
    enterpriseName: "",
    taxCode: "",
    taxAddress: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    imageUrl: "",
    latitude: 10.7769,
    longitude: 106.7009,
    status: "active",
    website: "",
    contactInfos: [],
    contacts: [],
    bankAccounts: [],
  });

  // Load branch data for edit mode
  useEffect(() => {
    if (branch) {
      // Create contactInfos from branch phone and email
      const contactInfos: ContactInfo[] = [];
      if (branch.phone || branch.email) {
        contactInfos.push({
          id: "1",
          phone: branch.phone || "",
          email: branch.email || "",
          isPrimary: true,
        });
      }

      setFormData({
        code: branch.code,
        name: branch.name,
        enterpriseId: "DN001", // Default for now
        enterpriseName: branch.enterpriseName,
        taxCode: branch.taxCode || "",
        taxAddress: branch.taxAddress || "",
        address: branch.address,
        city: branch.city || "",
        district: branch.district || "",
        ward: branch.ward || "",
        imageUrl: branch.imageUrl || "",
        latitude: branch.latitude ? parseFloat(branch.latitude) : 10.7769,
        longitude: branch.longitude ? parseFloat(branch.longitude) : 106.7009,
        status: branch.status,
        website: branch.website || "",
        contactInfos: contactInfos,
        contacts: branch.contacts || [],
        bankAccounts: branch.bankAccounts || [],
      });
    }
  }, [branch]);

  // Get enterprises from store
  const enterprisesFromStore = useEnterpriseStore((state) => state.enterprises);
  const enterprises = enterprisesFromStore
    .filter((e) => e.type === "enterprise")
    .map((e) => ({
      id: e.id.toString(),
      name: e.name,
    }));

  const BANKS_LIST = [
    "Vietcombank",
    "Techcombank",
    "BIDV",
    "Agribank",
    "VietinBank",
    "MB Bank",
    "ACB",
    "Sacombank",
    "VPBank",
    "TPBank",
  ];

  const CITIES_LIST = [
    "Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Cần Thơ",
    "Hải Phòng",
    "Đồng Nai",
    "Bình Dương",
    "Bà Rịa - Vũng Tàu",
  ];

  const WARDS_LIST = [
    "Phường Bến Nghé",
    "Phường Bến Thành",
    "Phường Đa Kao",
    "Phường Tân Định",
    "Phường Phạm Ngũ Lão",
    "Phường Thảo Điền",
    "Phường An Phú",
  ];

  // Debounce search address
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchAddress) {
        handleSearchAddress(searchAddress);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchAddress]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageUrl: reader.result as string,
          imageFile: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý tìm kiếm địa chỉ với autocomplete
  const handleSearchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Sử dụng Nominatim API (OpenStreetMap) - miễn phí
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=5`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setAddressSuggestions(data);
        setShowSuggestions(true);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error searching address:", error);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Xử lý chọn địa chỉ từ gợi ý
  const handleSelectAddress = (suggestion: any) => {
    const address = suggestion.address || {};

    // Parse địa chỉ thành các trường riêng biệt
    const road = address.road || address.street || "";
    const houseNumber = address.house_number || "";
    const streetAddress = houseNumber ? `${houseNumber} ${road}` : road;

    setFormData({
      ...formData,
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      address: streetAddress || suggestion.display_name.split(",")[0],
      ward: address.suburb || address.neighbourhood || address.quarter || "",
      district: address.city_district || address.county || address.town || "",
      city: address.city || address.province || address.state || "",
    });

    setSearchAddress(suggestion.display_name);
    setShowSuggestions(false);
    setAddressSuggestions([]);

    toast({
      title: "Thành công",
      description: "Đã tìm thấy địa chỉ trên bản đồ",
    });
  };

  // Xử lý tạo người liên hệ mới
  const handleAddNewContact = () => {
    const newContact: ContactPerson = {
      id: Date.now().toString(),
      name: "",
      position: "",
      phone: "",
      email: "",
      isPrimary: formData.contacts.length === 0,
    };
    setFormData({
      ...formData,
      contacts: [...formData.contacts, newContact],
    });
  };

  const handleRemoveContact = (id: string) => {
    setFormData({
      ...formData,
      contacts: formData.contacts.filter((c) => c.id !== id),
    });
  };

  const handleUpdateContact = (
    id: string,
    field: keyof ContactPerson,
    value: any,
  ) => {
    setFormData({
      ...formData,
      contacts: formData.contacts.map((c) =>
        c.id === id ? { ...c, [field]: value } : c,
      ),
    });
  };

  const handleSetPrimaryContact = (id: string) => {
    setFormData({
      ...formData,
      contacts: formData.contacts.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      })),
    });
  };

  // Xử lý thông tin liên hệ
  const handleAddNewContactInfo = () => {
    const newContactInfo: ContactInfo = {
      id: Date.now().toString(),
      phone: "",
      email: "",
      isPrimary: formData.contactInfos.length === 0,
    };
    setFormData({
      ...formData,
      contactInfos: [...formData.contactInfos, newContactInfo],
    });
  };

  const handleRemoveContactInfo = (id: string) => {
    setFormData({
      ...formData,
      contactInfos: formData.contactInfos.filter((c) => c.id !== id),
    });
  };

  const handleUpdateContactInfo = (
    id: string,
    field: keyof ContactInfo,
    value: any,
  ) => {
    setFormData({
      ...formData,
      contactInfos: formData.contactInfos.map((c) =>
        c.id === id ? { ...c, [field]: value } : c,
      ),
    });
  };

  const handleSetPrimaryContactInfo = (id: string) => {
    setFormData({
      ...formData,
      contactInfos: formData.contactInfos.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      })),
    });
  };

  // Xử lý tạo tài khoản ngân hàng mới
  const handleAddNewBankAccount = () => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      branch: "",
      isPrimary: formData.bankAccounts.length === 0,
    };
    setFormData({
      ...formData,
      bankAccounts: [...formData.bankAccounts, newAccount],
    });
  };

  const handleRemoveBankAccount = (id: string) => {
    setFormData({
      ...formData,
      bankAccounts: formData.bankAccounts.filter((b) => b.id !== id),
    });
  };

  const handleUpdateBankAccount = (
    id: string,
    field: keyof BankAccount,
    value: any,
  ) => {
    setFormData({
      ...formData,
      bankAccounts: formData.bankAccounts.map((b) =>
        b.id === id ? { ...b, [field]: value } : b,
      ),
    });
  };

  const handleSetPrimaryBankAccount = (id: string) => {
    setFormData({
      ...formData,
      bankAccounts: formData.bankAccounts.map((b) => ({
        ...b,
        isPrimary: b.id === id,
      })),
    });
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast({
            title: "Thành công",
            description: "Đã lấy vị trí hiện tại",
          });
        },
        () => {
          toast({
            title: "Lỗi",
            description: "Không thể lấy vị trí hiện tại",
            variant: "destructive",
          });
        },
      );
    }
  };

  const handleComplete = () => {
    setShowConfirmDialog(true);
  };

  const submitForm = () => {
    setShowConfirmDialog(false);

    // Construct full address
    const fullAddress = [
      formData.address,
      formData.ward,
      formData.district,
      formData.city,
    ]
      .filter(Boolean)
      .join(", ");

    if (isEdit && branchId) {
      // Update existing branch
      updateBranch(branchId, {
        code: formData.code,
        name: formData.name,
        enterpriseName: formData.enterpriseName,
        taxCode: formData.taxCode,
        taxAddress: formData.taxAddress,
        website: formData.website,
        phone: formData.contactInfos[0]?.phone || "",
        email: formData.contactInfos[0]?.email || "",
        address: fullAddress || formData.address,
        city: formData.city,
        district: formData.district,
        ward: formData.ward,
        imageUrl: formData.imageUrl,
        latitude: formData.latitude.toString(),
        longitude: formData.longitude.toString(),
        status: formData.status,
        contacts: formData.contacts,
        bankAccounts: formData.bankAccounts,
      });

      toast({
        title: "Thành công",
        description: `Đã cập nhật chi nhánh "${formData.name}"`,
      });
    } else {
      // Create new branch
      const newId =
        branches.length > 0 ? Math.max(...branches.map((b) => b.id)) + 1 : 1;

      addBranch({
        id: newId,
        code: formData.code || `CN${String(newId).padStart(3, "0")}`,
        name: formData.name,
        enterpriseName: formData.enterpriseName,
        taxCode: formData.taxCode,
        taxAddress: formData.taxAddress,
        website: formData.website,
        phone: formData.contactInfos[0]?.phone || "",
        email: formData.contactInfos[0]?.email || "",
        address: fullAddress || formData.address,
        city: formData.city,
        district: formData.district,
        ward: formData.ward,
        imageUrl: formData.imageUrl,
        latitude: formData.latitude.toString(),
        longitude: formData.longitude.toString(),
        status: formData.status,
        contacts: formData.contacts,
        bankAccounts: formData.bankAccounts,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Thành công",
        description: `Đã thêm chi nhánh mới "${formData.name}"`,
      });
    }

    setLocation("/branch");
  };

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Tên, mã, đơn vị",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">
                Mã chi nhánh <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: CN001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Tên chi nhánh <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Chi nhánh Miền Nam"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="enterprise">
                Đơn vị chủ quản <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.enterpriseId}
                onValueChange={(value) => {
                  const enterprise = enterprises.find((e) => e.id === value);
                  setFormData({
                    ...formData,
                    enterpriseId: value,
                    enterpriseName: enterprise?.name || "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn doanh nghiệp" />
                </SelectTrigger>
                <SelectContent>
                  {enterprises.map((enterprise) => (
                    <SelectItem key={enterprise.id} value={enterprise.id}>
                      {enterprise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isEdit && (
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Thông tin thuế</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxCode">Mã số thuế chi nhánh</Label>
                <Input
                  id="taxCode"
                  value={formData.taxCode}
                  onChange={(e) =>
                    setFormData({ ...formData, taxCode: e.target.value })
                  }
                  placeholder="VD: 0123456789-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxAddress">Địa chỉ thuế</Label>
                <Input
                  id="taxAddress"
                  value={formData.taxAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, taxAddress: e.target.value })
                  }
                  placeholder="Địa chỉ đăng ký thuế"
                />
              </div>
            </div>
          </div>
        </div>
      ),
      isValid: formData.name.length > 0 && formData.code.length > 0,
    },
    {
      id: "contact-info",
      title: "Liên hệ",
      description: "Điện thoại, email, website",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="VD: https://ecofarm.vn"
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center justify-between">
              Danh sách thông tin liên hệ (Điện thoại & Email)
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {formData.contactInfos.length}
                </Badge>
                <Button onClick={handleAddNewContactInfo}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo thông tin liên hệ mới
                </Button>
              </div>
            </h4>

            {formData.contactInfos.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">
                  Chưa có thông tin liên hệ nào
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.contactInfos.map((contactInfo, index) => (
                  <div
                    key={contactInfo.id}
                    className="border rounded-lg p-4 bg-card shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                          Thông tin liên hệ #{index + 1}
                        </h4>
                        {contactInfo.isPrimary && (
                          <Badge variant="default">Chính</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!contactInfo.isPrimary && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleSetPrimaryContactInfo(contactInfo.id)
                            }
                            type="button"
                          >
                            Đặt làm chính
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveContactInfo(contactInfo.id)
                          }
                          type="button"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Số điện thoại</Label>
                        <Input
                          value={contactInfo.phone}
                          onChange={(e) =>
                            handleUpdateContactInfo(
                              contactInfo.id,
                              "phone",
                              e.target.value,
                            )
                          }
                          placeholder="VD: 02839999888"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) =>
                            handleUpdateContactInfo(
                              contactInfo.id,
                              "email",
                              e.target.value,
                            )
                          }
                          placeholder="VD: hcm@ecofarm.vn"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Hình ảnh đại diện</h3>
            </div>
            <div className="flex items-center gap-6">
              <div
                className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative cursor-pointer hover:border-primary transition-colors group"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
              >
                {formData.imageUrl ? (
                  <>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-2">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs text-gray-500">Upload</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div className="text-sm text-muted-foreground">
                  <p>Tải lên hình ảnh đại diện (biển hiệu, văn phòng).</p>
                  <p>Định dạng: JPG, PNG. Kích thước tối đa: 5MB.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("avatar-upload")?.click()
                  }
                  type="button"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Chọn hình ảnh
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "location",
      title: "Định vị",
      description: "Địa chỉ, bản đồ",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Tìm kiếm địa chỉ trên bản đồ</h3>
            </div>

            <div className="relative" ref={searchContainerRef}>
              <Input
                value={searchAddress}
                onChange={(e) => {
                  setSearchAddress(e.target.value);
                  if (!e.target.value) {
                    setShowSuggestions(false);
                  }
                }}
                placeholder="Nhập địa chỉ để tìm kiếm (VD: 123 Nguyễn Huệ, Quận 1, TP.HCM)"
                onFocus={() => {
                  if (addressSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && addressSuggestions.length > 0) {
                    e.preventDefault();
                    handleSelectAddress(addressSuggestions[0]);
                  }
                }}
              />

              {showSuggestions && addressSuggestions.length > 0 && (
                <div className="absolute z-[99999] w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {addressSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors"
                      onClick={() => handleSelectAddress(suggestion)}
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.display_name}
                          </p>
                          {suggestion.address && (
                            <p className="text-xs text-gray-500 mt-1">
                              {[
                                suggestion.address.road,
                                suggestion.address.suburb,
                                suggestion.address.city_district,
                                suggestion.address.city,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="h-96 rounded-lg overflow-hidden border">
              <MapContainer
                center={[formData.latitude, formData.longitude]}
                zoom={15}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                  position={[formData.latitude, formData.longitude]}
                  setPosition={(pos) =>
                    setFormData({
                      ...formData,
                      latitude: pos[0],
                      longitude: pos[1],
                    })
                  }
                />
                <MapUpdater center={[formData.latitude, formData.longitude]} />
              </MapContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vĩ độ (Latitude)</Label>
                <Input value={formData.latitude.toFixed(6)} disabled />
              </div>
              <div className="space-y-2">
                <Label>Kinh độ (Longitude)</Label>
                <Input value={formData.longitude.toFixed(6)} disabled />
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleGetCurrentLocation}
              className="w-full"
              type="button"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Lấy vị trí hiện tại
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-4">Địa chỉ chi tiết</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Số nhà, tên đường"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Tỉnh/Thành phố</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) =>
                      setFormData({ ...formData, city: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES_LIST.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ward">Phường/Xã</Label>
                  <Select
                    value={formData.ward}
                    onValueChange={(value) =>
                      setFormData({ ...formData, ward: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn Phường/Xã" />
                    </SelectTrigger>
                    <SelectContent>
                      {WARDS_LIST.map((ward) => (
                        <SelectItem key={ward} value={ward}>
                          {ward}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "contacts",
      title: "Người liên hệ",
      description: "Quản lý liên hệ",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center justify-between">
              Danh sách người liên hệ
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{formData.contacts.length}</Badge>
                <Button onClick={handleAddNewContact}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo người liên hệ mới
                </Button>
              </div>
            </h4>

            {formData.contacts.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">
                  Chưa có người liên hệ nào
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.contacts.map((contact, index) => (
                  <div
                    key={contact.id}
                    className="border rounded-lg p-4 bg-card shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                          Người liên hệ #{index + 1}
                        </h4>
                        {contact.isPrimary && (
                          <Badge variant="default">Chính</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!contact.isPrimary && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetPrimaryContact(contact.id)}
                            type="button"
                          >
                            Đặt làm chính
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveContact(contact.id)}
                          type="button"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Họ và tên</Label>
                        <Input
                          value={contact.name}
                          onChange={(e) =>
                            handleUpdateContact(
                              contact.id,
                              "name",
                              e.target.value,
                            )
                          }
                          placeholder="VD: Nguyễn Văn A"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Chức vụ</Label>
                        <Input
                          value={contact.position}
                          onChange={(e) =>
                            handleUpdateContact(
                              contact.id,
                              "position",
                              e.target.value,
                            )
                          }
                          placeholder="VD: Giám đốc chi nhánh"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Số điện thoại</Label>
                        <Input
                          value={contact.phone}
                          onChange={(e) =>
                            handleUpdateContact(
                              contact.id,
                              "phone",
                              e.target.value,
                            )
                          }
                          placeholder="VD: 0901234567"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={contact.email}
                          onChange={(e) =>
                            handleUpdateContact(
                              contact.id,
                              "email",
                              e.target.value,
                            )
                          }
                          placeholder="VD: nguyenvana@ecofarm.vn"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "banking",
      title: "Ngân hàng",
      description: "Tài khoản thanh toán",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center justify-between">
              Danh sách tài khoản ngân hàng
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {formData.bankAccounts.length}
                </Badge>
                <Button onClick={handleAddNewBankAccount} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo tài khoản ngân hàng mới
                </Button>
              </div>
            </h4>

            {formData.bankAccounts.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">
                  Chưa có tài khoản ngân hàng nào
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.bankAccounts.map((account, index) => (
                  <div
                    key={account.id}
                    className="border rounded-lg p-4 bg-card shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Tài khoản #{index + 1}</h4>
                        {account.isPrimary && (
                          <Badge variant="default">Tài khoản chính</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!account.isPrimary && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleSetPrimaryBankAccount(account.id)
                            }
                            type="button"
                          >
                            Đặt làm chính
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBankAccount(account.id)}
                          type="button"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tên ngân hàng</Label>
                        <Select
                          value={account.bankName}
                          onValueChange={(value) =>
                            handleUpdateBankAccount(
                              account.id,
                              "bankName",
                              value,
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn ngân hàng" />
                          </SelectTrigger>
                          <SelectContent>
                            {BANKS_LIST.map((bank) => (
                              <SelectItem key={bank} value={bank}>
                                {bank}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Số tài khoản</Label>
                        <Input
                          value={account.accountNumber}
                          onChange={(e) =>
                            handleUpdateBankAccount(
                              account.id,
                              "accountNumber",
                              e.target.value,
                            )
                          }
                          placeholder="VD: 0123456789"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label>Tên chủ tài khoản</Label>
                        <Input
                          value={account.accountHolder}
                          onChange={(e) =>
                            handleUpdateBankAccount(
                              account.id,
                              "accountHolder",
                              e.target.value,
                            )
                          }
                          placeholder="VD: Chi nhánh Miền Nam - EcoFarm"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label>Chi nhánh ngân hàng</Label>
                        <Input
                          value={account.branch}
                          onChange={(e) =>
                            handleUpdateBankAccount(
                              account.id,
                              "branch",
                              e.target.value,
                            )
                          }
                          placeholder="VD: Chi nhánh Sài Gòn"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra lại thông tin",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-muted/30 p-6 rounded-lg space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                <FileText className="w-5 h-5 text-primary" />
                Thông tin chung
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã chi nhánh:</span>
                  <span className="font-medium">{formData.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tên chi nhánh:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-muted-foreground">
                    Đơn vị chủ quản:
                  </span>
                  <span className="font-medium">{formData.enterpriseName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MST:</span>
                  <span className="font-medium">{formData.taxCode || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge
                    variant={
                      formData.status === "active" ? "default" : "secondary"
                    }
                  >
                    {formData.status === "active"
                      ? "Hoạt động"
                      : "Ngừng hoạt động"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                <MapPin className="w-5 h-5 text-primary" />
                Địa chỉ & Liên hệ
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground min-w-[100px]">
                    Địa chỉ:
                  </span>
                  <span className="font-medium text-right">
                    {[
                      formData.address,
                      formData.ward,
                      formData.district,
                      formData.city,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Website:</span>
                  <span className="font-medium">{formData.website || "-"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                <Users className="w-5 h-5 text-primary" />
                Người liên hệ ({formData.contacts.length})
              </h3>
              {formData.contacts.length > 0 ? (
                <div className="grid gap-3">
                  {formData.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="bg-card p-3 rounded border text-sm"
                    >
                      <div className="font-medium flex justify-between">
                        <span>{contact.name || "Chưa nhập tên"}</span>
                        {contact.isPrimary && (
                          <Badge className="text-[10px] h-5 px-1">Chính</Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground text-xs mt-1">
                        {contact.position} • {contact.phone} • {contact.email}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Chưa có người liên hệ
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Tài khoản ngân hàng ({formData.bankAccounts.length})
              </h3>
              {formData.bankAccounts.length > 0 ? (
                <div className="grid gap-3">
                  {formData.bankAccounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="bg-card p-3 rounded border text-sm"
                    >
                      <div className="font-medium flex justify-between">
                        <span>
                          {acc.bankName} - {acc.accountNumber}
                        </span>
                        {acc.isPrimary && (
                          <Badge className="text-[10px] h-5 px-1">Chính</Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground text-xs mt-1">
                        {acc.accountHolder} • {acc.branch}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Chưa có tài khoản ngân hàng
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
            <Building2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Lưu ý:</p>
              <p className="opacity-90 mt-1">
                Vui lòng kiểm tra kỹ tất cả thông tin trước khi xác nhận. Sau
                khi tạo, một số thông tin quan trọng như Mã chi nhánh có thể
                không được phép thay đổi.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title={isEdit ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh mới"}
      description="Điền thông tin theo từng bước để tạo mới"
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/branch")}
            completeLabel={isEdit ? "Cập nhật" : "Tạo mới"}
          />
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEdit ? "Xác nhận cập nhật" : "Xác nhận tạo mới"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn {isEdit ? "cập nhật" : "tạo mới"} chi nhánh
              "{formData.name}" không?
              <br />
              Thông tin đã nhập sẽ được lưu vào hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={submitForm}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
