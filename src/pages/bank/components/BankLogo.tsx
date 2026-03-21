interface BankLogoProps {
  logo?: string;
  bankName: string;
  size?: number;
  className?: string;
}

export default function BankLogo({
  logo,
  bankName,
  size = 40,
  className = "rounded-full",
}: BankLogoProps) {
  return (
    <div
      className={`border bg-white flex items-center justify-center p-1 overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logo}
        alt={bankName}
        className="w-full h-full object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/40x40?text=" + (bankName?.[0] || "B");
        }}
      />
    </div>
  );
}
