import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search } from "lucide-react";
import { type HRFilterState, EMPTY_HR_FILTER, hrByDepartment, hrByPosition } from "../constants";

// Mock list of individual staff members for detailed search
const mockPersonnelList = [
  { id: "st-1", name: "Nguyễn Văn Hùng", departmentId: "dept-1", department: "Phòng Kỹ thuật nông nghiệp", positionId: "pos-1", position: "Kỹ sư nông nghiệp", pendingTasks: 2, inProgressTasks: 3, status: "Đang làm việc" },
  { id: "st-2", name: "Trần Thị Lan", departmentId: "dept-1", department: "Phòng Kỹ thuật nông nghiệp", positionId: "pos-2", position: "Quản lý vùng trồng", pendingTasks: 1, inProgressTasks: 4, status: "Đang làm việc" },
  { id: "st-3", name: "Lê Hoàng Nam", departmentId: "dept-2", department: "Phòng Vận hành", positionId: "pos-3", position: "Công nhân canh tác", pendingTasks: 3, inProgressTasks: 2, status: "Vắng mặt" },
  { id: "st-4", name: "Phạm Minh Tuấn", departmentId: "dept-1", department: "Phòng Kỹ thuật nông nghiệp", positionId: "pos-3", position: "Công nhân canh tác", pendingTasks: 2, inProgressTasks: 5, status: "Đang làm việc" },
  { id: "st-5", name: "Ngô Quốc Khánh", departmentId: "dept-2", department: "Phòng Vận hành", positionId: "pos-3", position: "Công nhân canh tác", pendingTasks: 0, inProgressTasks: 3, status: "Đang làm việc" },
  { id: "st-6", name: "Vũ Thị Mai", departmentId: "dept-4", department: "Phòng Hành chính - Nhân sự", positionId: "pos-5", position: "Nhân viên văn phòng", pendingTasks: 1, inProgressTasks: 1, status: "Đang làm việc" },
  { id: "st-7", name: "Đặng Hoàng Anh", departmentId: "dept-3", department: "Phòng Kinh doanh", positionId: "pos-5", position: "Nhân viên văn phòng", pendingTasks: 2, inProgressTasks: 2, status: "Đang làm việc" },
  { id: "st-8", name: "Bùi Tiến Dũng", departmentId: "dept-2", department: "Phòng Vận hành", positionId: "pos-1", position: "Kỹ sư nông nghiệp", pendingTasks: 1, inProgressTasks: 2, status: "Đang làm việc" },
];

interface HRReportTabProps {
  hrFilter?: HRFilterState;
}

export function HRReportTab({ hrFilter = EMPTY_HR_FILTER }: HRReportTabProps) {
  const [searchName, setSearchName] = useState("");

  const filteredDepartments = hrByDepartment.filter((dept) => {
    if (hrFilter.departments.length > 0 && !hrFilter.departments.includes(dept.id)) {
      return false;
    }
    if (hrFilter.taskStatus.length > 0) {
      const hasPending = hrFilter.taskStatus.includes("pending") && dept.pendingTasks > 0;
      const hasInProgress = hrFilter.taskStatus.includes("inProgress") && dept.inProgressTasks > 0;
      if (!hasPending && !hasInProgress) return false;
    }
    return true;
  });

  const filteredPositions = hrByPosition.filter((pos) => {
    if (hrFilter.positions.length > 0 && !hrFilter.positions.includes(pos.id)) {
      return false;
    }
    if (hrFilter.taskStatus.length > 0) {
      const hasPending = hrFilter.taskStatus.includes("pending") && pos.pendingTasks > 0;
      const hasInProgress = hrFilter.taskStatus.includes("inProgress") && pos.inProgressTasks > 0;
      if (!hasPending && !hasInProgress) return false;
    }
    return true;
  });

  const filteredPersonnel = mockPersonnelList.filter((staff) => {
    // Filter by name search
    if (searchName && !staff.name.toLowerCase().includes(searchName.toLowerCase())) {
      return false;
    }
    // Filter by department
    if (hrFilter.departments.length > 0 && !hrFilter.departments.includes(staff.departmentId)) {
      return false;
    }
    // Filter by position
    if (hrFilter.positions.length > 0 && !hrFilter.positions.includes(staff.positionId)) {
      return false;
    }
    // Filter by task status
    if (hrFilter.taskStatus.length > 0) {
      const hasPending = hrFilter.taskStatus.includes("pending") && staff.pendingTasks > 0;
      const hasInProgress = hrFilter.taskStatus.includes("inProgress") && staff.inProgressTasks > 0;
      if (!hasPending && !hasInProgress) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Detailed Personnel Search Card */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-sm font-semibold">
            Danh sách nhân sự chi tiết
          </CardTitle>
          <div className="relative w-full sm:max-w-xs shrink-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên nhân sự..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead>Họ và Tên</TableHead>
                  <TableHead>Phòng Ban</TableHead>
                  <TableHead>Chức Vụ</TableHead>
                  <TableHead className="text-center">Chờ triển khai</TableHead>
                  <TableHead className="text-center">Đang triển khai</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersonnel.map((staff) => (
                  <TableRow key={staff.id} className="hover:bg-slate-50/40">
                    <TableCell className="font-semibold text-slate-700">{staff.name}</TableCell>
                    <TableCell className="text-slate-600">{staff.department}</TableCell>
                    <TableCell className="text-slate-600">{staff.position}</TableCell>
                    <TableCell className="text-center font-semibold text-amber-600 font-mono">
                      {staff.pendingTasks}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-blue-600 font-mono">
                      {staff.inProgressTasks}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold ${
                          staff.status === "Đang làm việc"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {staff.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPersonnel.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8 text-xs">
                      Không tìm thấy nhân sự phù hợp
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Aggregate tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Báo cáo nhân sự theo phòng ban
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên Phòng Ban</TableHead>
                  <TableHead className="text-center">Tổng nhân sự</TableHead>
                  <TableHead className="text-center">Chờ triển khai</TableHead>
                  <TableHead className="text-center">Đang triển khai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium text-slate-700">{dept.name}</TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-bold text-slate-800 font-mono">
                        {dept.totalStaff}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-xs font-semibold text-amber-650 font-mono">
                        {dept.pendingTasks}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-xs font-semibold text-blue-650 font-mono">
                        {dept.inProgressTasks}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDepartments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8 text-xs">
                      Không có dữ liệu phù hợp bộ lọc
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Báo cáo nhân sự theo chức vụ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên Chức Vụ</TableHead>
                  <TableHead className="text-center">Tổng nhân sự</TableHead>
                  <TableHead className="text-center">Chờ triển khai</TableHead>
                  <TableHead className="text-center">Đang triển khai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPositions.map((pos) => (
                  <TableRow key={pos.id}>
                    <TableCell className="font-medium text-slate-700">{pos.name}</TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-bold text-slate-800 font-mono">
                        {pos.totalStaff}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-xs font-semibold text-amber-650 font-mono">
                        {pos.pendingTasks}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-xs font-semibold text-blue-650 font-mono">
                        {pos.inProgressTasks}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPositions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8 text-xs">
                      Không có dữ liệu phù hợp bộ lọc
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
