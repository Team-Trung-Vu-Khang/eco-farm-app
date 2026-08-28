import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Contact, User } from "lucide-react";
import type {
  CultivationRegionDetails,
  PersonnelItem,
} from "../../useCultivationRegionDetail";
import { StaffDetailPanel, StaffDetailEmpty } from "./StaffDetailPanel";

interface StaffTabProps {
  details: CultivationRegionDetails;
}

export const StaffTab = ({ details }: StaffTabProps) => {
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(
    () => details.personnel?.[0]?.id ?? null,
  );

  const personnel = details.personnel ?? [];

  const staffColumns: Column<PersonnelItem>[] = [
    {
      key: "avatarUrl",
      label: "Ảnh",
      render: (value: string | null, item: PersonnelItem) => (
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold overflow-hidden border border-slate-200">
          {value ? (
            <img
              src={value}
              alt={item.fullName}
              className="w-full h-full object-cover"
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
      key: "positionName",
      label: "Chức vụ",
      render: (value: string) => (
        <Badge variant="outline" className="text-[10px] font-medium">
          {value || "—"}
        </Badge>
      ),
    },
  ];

  const selectedStaff = personnel.find((p) => p.id === selectedStaffId) ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      {/* Left Column – Staff List (6/10) */}
      <div className="lg:col-span-6 space-y-6">
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="border-b bg-slate-50/50 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Contact className="w-4 h-4 text-primary" />
                Danh sách nhân viên
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Chọn nhân viên để xem chi tiết thông tin
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              {personnel.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <User className="w-10 h-10 mb-3 text-slate-200" />
                  <p className="text-sm font-medium">Chưa có nhân viên nào</p>
                </div>
              ) : (
                <DataTable
                  columns={staffColumns}
                  data={personnel}
                  onView={(item) => setSelectedStaffId(item.id)}
                  searchPlaceholder="Tìm kiếm nhân viên..."
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column – Detail Panel (4/10) */}
      <div className="lg:col-span-4">
        <div className="sticky top-1">
          {selectedStaff ? (
            <StaffDetailPanel staff={selectedStaff} />
          ) : (
            <StaffDetailEmpty />
          )}
        </div>
      </div>
    </div>
  );
};
