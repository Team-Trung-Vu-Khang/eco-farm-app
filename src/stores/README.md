# Pesticide Store - Zustand State Management

## 📦 Cài đặt

Zustand đã được cài đặt:
```bash
yarn add zustand
```

## 🏗️ Cấu trúc Store

Store được tạo với các middleware:
- **devtools**: Tích hợp Redux DevTools để debug
- **persist**: Lưu trữ dữ liệu vào localStorage

## 🎯 State

```typescript
interface PesticideState {
  pesticides: Pesticide[];      // Danh sách thuốc BVTV
  isLoading: boolean;            // Trạng thái loading
  error: string | null;          // Lỗi nếu có
}
```

## 🔧 Actions (CRUD)

### 1. **Create** - Thêm thuốc mới
```typescript
const addPesticide = usePesticideStore((state) => state.addPesticide);

addPesticide({
  code: "BVTV006",
  name: "Thuốc mới",
  group: "Thuốc trừ sâu",
  form: "EC (nhũ dầu)",
  actionType: "Nội hấp",
  origin: "Thuốc hóa học",
  activeIngredient: "ABC 25%",
  status: "active",
});
```

### 2. **Read** - Đọc dữ liệu
```typescript
// Lấy toàn bộ danh sách
const pesticides = usePesticideStore((state) => state.pesticides);

// Lấy theo ID
const getPesticideById = usePesticideStore((state) => state.getPesticideById);
const pesticide = getPesticideById(1);
```

### 3. **Update** - Cập nhật thuốc
```typescript
const updatePesticide = usePesticideStore((state) => state.updatePesticide);

updatePesticide(1, {
  name: "Tên mới",
  status: "inactive",
});
```

### 4. **Delete** - Xóa thuốc
```typescript
const deletePesticide = usePesticideStore((state) => state.deletePesticide);

deletePesticide(1);
```

## 📝 Ví dụ sử dụng trong Component

### PesticidePage.tsx
```typescript
import usePesticideStore from "../../stores/usePesticideStore";

export default function PesticidePage() {
  // Lấy data và actions từ store
  const pesticides = usePesticideStore((state) => state.pesticides);
  const deletePesticide = usePesticideStore((state) => state.deletePesticide);
  
  const handleDelete = (id: number) => {
    deletePesticide(id);
    toast({ title: "Thành công", description: "Đã xóa thuốc BVTV" });
  };

  return (
    <DataTable
      columns={columns}
      data={pesticides}
      onDelete={handleDelete}
    />
  );
}
```

### PesticideCreatePage.tsx
```typescript
import usePesticideStore from "../../stores/usePesticideStore";

export default function PesticideCreatePage() {
  const addPesticide = usePesticideStore((state) => state.addPesticide);
  
  const handleSubmit = (formData) => {
    addPesticide(formData);
    toast({ title: "Thành công", description: "Đã thêm thuốc BVTV mới" });
    navigate("/cultivation-material/pesticide");
  };

  return <PesticideForm onSubmit={handleSubmit} />;
}
```

### PesticideEditPage.tsx
```typescript
import usePesticideStore from "../../stores/usePesticideStore";

export default function PesticideEditPage({ params }) {
  const getPesticideById = usePesticideStore((state) => state.getPesticideById);
  const updatePesticide = usePesticideStore((state) => state.updatePesticide);
  
  const pesticide = getPesticideById(Number(params.id));
  
  const handleSubmit = (formData) => {
    updatePesticide(Number(params.id), formData);
    toast({ title: "Thành công", description: "Đã cập nhật thuốc BVTV" });
    navigate("/cultivation-material/pesticide");
  };

  return <PesticideForm initialData={pesticide} onSubmit={handleSubmit} />;
}
```

## 🛠️ Utility Actions

### Set Loading
```typescript
const setLoading = usePesticideStore((state) => state.setLoading);
setLoading(true);
```

### Set Error
```typescript
const setError = usePesticideStore((state) => state.setError);
setError("Có lỗi xảy ra");
```

### Reset Store
```typescript
const reset = usePesticideStore((state) => state.reset);
reset(); // Reset về initial state
```

### Set All Pesticides
```typescript
const setPesticides = usePesticideStore((state) => state.setPesticides);
setPesticides(newPesticideList);
```

## 🔍 Redux DevTools

Mở Redux DevTools trong browser để debug:
- Xem state hiện tại
- Xem history của các actions
- Time-travel debugging

Store name: **PesticideStore**

## 💾 LocalStorage Persistence

Dữ liệu được tự động lưu vào localStorage với key: `pesticide-storage`

Chỉ `pesticides` array được persist, không lưu `isLoading` và `error`.

## 🎨 Best Practices

### 1. Selector Pattern
```typescript
// ✅ Good - Chỉ subscribe vào data cần thiết
const pesticides = usePesticideStore((state) => state.pesticides);
const deletePesticide = usePesticideStore((state) => state.deletePesticide);

// ❌ Bad - Subscribe toàn bộ store
const store = usePesticideStore();
```

### 2. Derived State
```typescript
// Tính toán derived state bên ngoài store
const activePesticides = pesticides.filter(p => p.status === "active");
const pesticideCount = pesticides.length;
```

### 3. Async Operations
```typescript
const fetchPesticides = async () => {
  const setLoading = usePesticideStore.getState().setLoading;
  const setPesticides = usePesticideStore.getState().setPesticides;
  const setError = usePesticideStore.getState().setError;
  
  setLoading(true);
  try {
    const response = await api.getPesticides();
    setPesticides(response.data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

## 🚀 Next Steps

Để tích hợp API:
1. Tạo service layer (`src/services/pesticideService.ts`)
2. Thêm async actions vào store
3. Xử lý loading và error states
4. Implement optimistic updates

## 📚 Tài liệu tham khảo

- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Zustand Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
