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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { type HRFilterState, EMPTY_HR_FILTER, hrByDepartment, hrByPosition } from "../constants";

interface HRReportTabProps {
  hrFilter?: HRFilterState;
}

export function HRReportTab({ hrFilter = EMPTY_HR_FILTER }: HRReportTabProps) {
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

  return (
    <div className="space-y-6">
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
                <TableHead className="text-center">
                  Chờ triển khai
                </TableHead>
                <TableHead className="text-center">
                  Đang triển khai
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-lg font-display font-bold">
                      {dept.totalStaff}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-semibold text-amber-600">
                      {dept.pendingTasks}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {dept.inProgressTasks}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDepartments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
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
                <TableHead className="text-center">
                  Chờ triển khai
                </TableHead>
                <TableHead className="text-center">
                  Đang triển khai
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPositions.map((pos) => (
                <TableRow key={pos.id}>
                  <TableCell className="font-medium">{pos.name}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-lg font-display font-bold">
                      {pos.totalStaff}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-semibold text-amber-600">
                      {pos.pendingTasks}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {pos.inProgressTasks}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPositions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Không có dữ liệu phù hợp bộ lọc
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
