import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;
export const Input = forwardRef<HTMLInputElement, Props>(function InputBase({ className = "", ...props }, ref) {
  return <input ref={ref} className={`border h-12 border-gray-300 bg-white px-3 py-2 rounded-xl ${className}`} {...props} />;
});