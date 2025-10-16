import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="mb-1 text-stone-200/80">{label}</label>}
      <input
        ref={ref}
        {...props}
        className="p-2 rounded-md bg-stone-200/30 text-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-200/60"
      />
      {error && <span className="text-red-400 text-sm mt-1">{error}</span>}
    </div>
  )
);
