type Props = { children: React.ReactNode; className?: string };

export function Bagde({ children, className = "" }: Props) {
  return (
    <span
      className={`inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full ${className}`}
    >
      {children}
    </span>
  );
}
