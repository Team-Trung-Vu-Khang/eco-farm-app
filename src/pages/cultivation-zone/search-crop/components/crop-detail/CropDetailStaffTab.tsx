import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  TabsContent,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Contact, Layers, Mail, MapPin, Phone, User } from "lucide-react";
import { HorizontalPersonnelList } from "../../../../../components/personnel/HorizontalPersonnelList";
import type { Personnel } from "../../../../../stores/usePersonnelStore";
import type { CropDetailStaffProps } from "./types";

const staffColumns: Column<Personnel>[] = [
  {
    key: "avatar",
    label: "Thợ",
    render: (value: string, item: Personnel) => (
      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 font-bold text-slate-500">
        {value ? (
          <img
            src={value}
            alt={item.fullName}
            className="h-full w-full object-cover"
          />
        ) : (
          item.fullName.charAt(0)
        )}
      </div>
    ),
  },
  {
    key: "fullName",
    label: "Họ và tên",
    render: (value: string) => (
      <span className="font-semibold text-slate-700">{value}</span>
    ),
  },
  {
    key: "position",
    label: "Chức vụ",
    render: (value: string) => (
      <Badge variant="outline" className="text-[10px] font-medium">
        {value}
      </Badge>
    ),
  },
  {
    key: "phone",
    label: "Số điện thoại",
    render: (value: string) => (
      <span className="text-xs text-muted-foreground">{value}</span>
    ),
  },
];

export const CropDetailStaffTab = ({
  details,
  personnel,
  selectedStaffId,
  setSelectedStaffId,
}: CropDetailStaffProps) => {
  const selectedStaff =
    selectedStaffId !== null
      ? personnel.find((item) => item.id === selectedStaffId) || null
      : null;

  return (
    <TabsContent value="staff" className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
        <div className="space-y-6 lg:col-span-6">
          <Card className="overflow-hidden border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 py-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <Contact className="h-4 w-4 text-primary" />
                  Danh sách nhân viên
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  Chọn nhân viên để xem chi tiết thông tin
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-4">
                <HorizontalPersonnelList
                  personnel={details.managers}
                  onSelect={(item) => setSelectedStaffId(item.id)}
                  className="mb-4"
                />

                <DataTable
                  columns={staffColumns}
                  data={personnel.filter(
                    (item) => !details.managers.some((manager) => manager.id === item.id),
                  )}
                  onView={(item) => setSelectedStaffId(item.id)}
                  searchPlaceholder="Tìm kiếm nhân viên..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-1">
            {selectedStaff ? (
              <Card>
                <div className="relative border-b bg-slate-50/30 p-6">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 shrink-0 rounded-2xl border border-slate-100 bg-white p-1 shadow-lg">
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-primary/5 text-2xl font-bold text-primary select-none">
                        {selectedStaff.avatar ? (
                          <img
                            src={selectedStaff.avatar}
                            alt={selectedStaff.fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          selectedStaff.fullName.charAt(0)
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-black leading-tight tracking-tight text-slate-900">
                        {selectedStaff.fullName}
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                        <Badge className="h-4 border-none bg-primary/10 px-2 py-0 text-[9px] font-black text-primary">
                          {selectedStaff.position}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="space-y-8 p-8">
                  <div className="grid gap-7">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <Layers className="h-3 w-3" />
                        Đơn vị công tác
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 transition-colors hover:border-primary/20">
                          <span className="mb-1 block text-[10px] font-bold uppercase tracking-tight text-slate-400">
                            Bộ phận
                          </span>
                          <span className="text-sm font-bold tracking-tight text-slate-800">
                            {selectedStaff.department}
                          </span>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 transition-colors hover:border-primary/20">
                          <span className="mb-1 block text-[10px] font-bold uppercase tracking-tight text-slate-400">
                            Tổ đội
                          </span>
                          <span className="text-sm font-bold tracking-tight text-slate-800">
                            {selectedStaff.team}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <Contact className="h-3 w-3" />
                        Thông tin liên hệ
                      </div>
                      <div className="space-y-3">
                        <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary transition-transform group-hover:scale-110">
                            <Phone className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-tight text-slate-400">
                              Số điện thoại
                            </span>
                            <span className="select-all text-[15px] font-bold tracking-tight text-slate-800">
                              {selectedStaff.phone}
                            </span>
                          </div>
                        </div>
                        <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary transition-transform group-hover:scale-110">
                            <Mail className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-tight text-slate-400">
                              Địa chỉ Email
                            </span>
                            <span className="block truncate text-[15px] font-bold tracking-tight text-slate-800 select-all">
                              {selectedStaff.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <MapPin className="h-3 w-3" />
                        Địa chỉ thường trú
                      </div>
                      <div className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium leading-relaxed text-slate-600">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                        <span className="text-slate-700">
                          {selectedStaff.address}, {selectedStaff.district},{" "}
                          {selectedStaff.province}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex h-125 flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50/30 p-12 text-center group">
                <div className="relative mb-8">
                  <div className="absolute inset-0 scale-150 rounded-full bg-primary/10 blur-2xl transition-all duration-500 group-hover:bg-primary/20" />
                  <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-200 shadow-xl transition-all duration-500 group-hover:scale-110">
                    <User className="h-12 w-12 text-slate-100" />
                  </div>
                </div>
                <div className="relative z-10 max-w-70 space-y-3">
                  <h4 className="text-xl font-black tracking-tight text-slate-300">
                    HỒ SƠ NHÂN SỰ
                  </h4>
                  <p className="text-xs font-medium leading-relaxed text-slate-400">
                    Thông tin chi tiết của nhân viên sẽ được hiển thị tại đây
                    khi bạn chọn từ danh sách bên trái.
                  </p>
                  <div className="flex justify-center gap-1.5 pt-4 opacity-30">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-1 w-8 rounded-full bg-slate-200"
                      />
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TabsContent>
  );
};
