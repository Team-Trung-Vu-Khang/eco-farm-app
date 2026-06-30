import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Building2,
  Download,
  FileText,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useEnterpriseFormContext } from "../../context/EnterpriseFormContext";
import type { Branch } from "../../data/constants";

export function EnterpriseBranchesStep() {
  const {
    branchInputMethod,
    setBranchInputMethod,
    handleBranchExcelDrop,
    handleBranchExcelUpload,
    newBranch,
    setNewBranch,
    addBranch,
    removeBranch,
    formData,
    isDragging,
    handleDrag,
  } = useEnterpriseFormContext();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Quản lý chi nhánh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={branchInputMethod}
            onValueChange={(val: any) => setBranchInputMethod(val)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1">
              <TabsTrigger
                value="create"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" /> Tạo mới
              </TabsTrigger>
              <TabsTrigger
                value="excel"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <FileText className="w-4 h-4 mr-2" /> Nhập Excel
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="excel"
              className="space-y-4 animate-in fade-in-50 duration-300"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Download className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-blue-900">
                        Mẫu file Excel
                      </p>
                      <p className="text-xs text-blue-700">
                        Tải xuống file mẫu để nhập liệu chính xác
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-blue-200 hover:bg-blue-50"
                    onClick={() =>
                      window.open(
                        "https://static.affina.com.vn/affina/3b0bd357-e259-4ff0-9016-0c23334c5279.xlsx",
                        "_blank",
                      )
                    }
                  >
                    <Download className="w-4 h-4 mr-2" /> Tải mẫu
                  </Button>
                </div>

                <div
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-all group cursor-pointer ${isDragging["branch-excel"] ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"}`}
                  onClick={() =>
                    document.getElementById("branch-excel-upload")?.click()
                  }
                  onDragEnter={(e) => handleDrag("branch-excel", e)}
                  onDragOver={(e) => handleDrag("branch-excel", e)}
                  onDragLeave={(e) => handleDrag("branch-excel", e)}
                  onDrop={handleBranchExcelDrop}
                >
                  <input
                    id="branch-excel-upload"
                    type="file"
                    accept=".xlsx, .xls"
                    className="hidden"
                    onChange={handleBranchExcelUpload}
                  />
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">
                    Tải lên danh sách chi nhánh
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                    Kéo thả file .xlsx hoặc .xls vào đây để nhập danh sách chi
                    nhánh tự động
                  </p>
                  <Button
                    variant="secondary"
                    className="px-8 pointer-events-none"
                  >
                    Chọn file
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="create"
              className="space-y-4 animate-in fade-in-50 duration-300"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label required>Tên chi nhánh</Label>
                  <Input
                    value={newBranch.name}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, name: e.target.value })
                    }
                    placeholder="Nhập tên chi nhánh"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mã số thuế</Label>
                  <Input
                    value={newBranch.taxCode}
                    onChange={(e) =>
                      setNewBranch({
                        ...newBranch,
                        taxCode: e.target.value,
                      })
                    }
                    placeholder="MST chi nhánh"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input
                    value={newBranch.phone}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, phone: e.target.value })
                    }
                    placeholder="SĐT chi nhánh"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={newBranch.email}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, email: e.target.value })
                    }
                    placeholder="Email chi nhánh"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Địa chỉ thuế</Label>
                  <Input
                    value={newBranch.taxAddress}
                    onChange={(e) =>
                      setNewBranch({
                        ...newBranch,
                        taxAddress: e.target.value,
                      })
                    }
                    placeholder="Địa chỉ đăng ký thuế"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Địa chỉ chi nhánh</Label>
                  <Input
                    value={newBranch.address}
                    onChange={(e) =>
                      setNewBranch({
                        ...newBranch,
                        address: e.target.value,
                      })
                    }
                    placeholder="Địa chỉ hoạt động"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Ghi chú</Label>
                  <Textarea
                    value={newBranch.note}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, note: e.target.value })
                    }
                    placeholder="Ghi chú thêm..."
                    rows={2}
                  />
                </div>
              </div>
              <Button onClick={addBranch} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Thêm vào danh sách
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h4 className="font-semibold text-lg flex items-center justify-between">
          Danh sách chi nhánh
          <Badge variant="secondary">{formData.branches.length}</Badge>
        </h4>

        {formData.branches.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              Chưa có chi nhánh nào được thêm
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Vui lòng thêm chi nhánh từ form bên trên
            </p>
          </div>
        ) : (
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Tên chi nhánh
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Mã số thuế
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Liên hệ
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Địa chỉ
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.branches.map((branch: Branch, index: number) => (
                  <tr
                    key={index}
                    className="border-b last:border-0 hover:bg-muted/10 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">{branch.name}</td>
                    <td className="py-3 px-4">{branch.taxCode || "-"}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs">{branch.phone}</span>
                        <span className="text-xs text-muted-foreground">
                          {branch.email}
                        </span>
                      </div>
                    </td>
                    <td
                      className="py-3 px-4 max-w-[200px] truncate"
                      title={branch.address}
                    >
                      {branch.address || "-"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => removeBranch(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
