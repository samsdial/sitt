type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const base =
    "px-4 py-2 h-12 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed";
  const map = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    ghost:
      "bg-transparent text-blue-500 hover:bg-blue-100",
  } as const;
  const variantClass = map[variant] || map.primary;
  return (
    <button className={`${base} ${variantClass} ${className}`} {...props} />
  );
}
