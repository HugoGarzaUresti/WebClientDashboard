import React, { type ChangeEventHandler } from "react";
import { Input as PrimitiveInput } from "@/components/ui/input";

type InputProps = React.ComponentProps<"input"> & {
  id?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id, placeholder, value, onChange, type, className, ...props }, ref) => {
    return (
      <PrimitiveInput
        id={id}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        className={`${className ?? ""} py-6 placeholder:text `}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
