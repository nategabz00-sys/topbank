import Topbank from "./1.logo/Topbank-logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  withLabel?: boolean;
  className?: string;
}

export function Logo({ size = "md", withLabel = false, className = "" }: LogoProps) {
  const sizeMap = {
    sm: { width: 56, height: 56, label: "text-xs", gap: "gap-1" },
    md: { width: 88, height: 88, label: "text-sm", gap: "gap-1" },
    lg: { width: 120, height: 120, label: "text-base", gap: "gap-1" },
    xl: { width: 160, height: 160, label: "text-lg", gap: "gap-2" },
    "2xl": { width: 200, height: 200, label: "text-xl", gap: "gap-2" },
    "3xl": { width: 280, height: 280, label: "text-3xl font-bold", gap: "gap-3" },
    "4xl": { width: 320, height: 320, label: "text-4xl font-bold", gap: "gap-4" },
  };

  const { width, height, label, gap } = sizeMap[size];

  return (
    <div className={`flex flex-col items-center ${gap} ${className}`}>
      <img
        src={Topbank}
        alt="Top Bank logo"
        width={width}
        height={height}
        className="drop-shadow-[0_8px_24px_rgba(242,140,40,0.35)]"
        style={{
          maxWidth: "100%",
          height: "auto",
          objectFit: "contain",
          objectPosition: "center",
          filter: "drop-shadow(0 8px 24px rgba(242, 140, 40, 0.35))",
        }}
      />
      {withLabel && (
        <span
          className={`${label} font-bold tracking-tight uppercase`}
          style={{ color: "#1e3a8a" }}
        >
          TopBank
        </span>
      )}
    </div>
  );
}
