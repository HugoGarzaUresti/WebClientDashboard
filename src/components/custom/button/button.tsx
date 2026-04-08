import { Button as PrimitiveButton } from "@/components/ui/button";
import { ButtonHTMLAttributes } from "react";
type ButtonProps = {
  children: string;
  type?: "submit" | "button" | "reset";
};

function Button({ type, children }: ButtonProps) {
  return (
    <PrimitiveButton
      type={type}
      className="py-4 px-10 font-medium cursor-pointer hover:bg-primary/80"
    >
      {" "}
      {children}
    </PrimitiveButton>
  );
}

export { Button };
