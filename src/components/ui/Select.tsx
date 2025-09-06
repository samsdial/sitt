import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, Props>(function SelectBase({ className = "", ...props}, ref) {
    return <select ref={ref} className={`border h-12 bg-white border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props} />;
});