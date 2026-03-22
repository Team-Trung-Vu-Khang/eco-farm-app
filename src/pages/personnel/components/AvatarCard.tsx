import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { User } from "lucide-react";

interface AvatarCardProps {
  avatar: string;
  onChange: (url: string) => void;
}

export function AvatarCard({ avatar, onChange }: AvatarCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ảnh đại diện</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 overflow-hidden relative group cursor-pointer hover:border-primary">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-medium">
              Tải ảnh lên
            </span>
          </div>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                onChange(url);
              }
            }}
          />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Hỗ trợ định dạng JPG, PNG. Tối đa 2MB.
        </p>
      </CardContent>
    </Card>
  );
}
