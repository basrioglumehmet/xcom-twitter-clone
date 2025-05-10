import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `
          flex h-10 w-full rounded-full bg-background-1 px-3 py-2 text-sm ring-offset-white file:border-0
          file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
          text-black autofill:bg-white autofill:text-black
          [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:!text-black
          [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#fff]
          [&:-webkit-autofill:hover]:!text-black [&:-webkit-autofill:focus]:!text-black
          [&:-webkit-autofill]:[-webkit-text-fill-color:#000]
          [&:-webkit-autofill]:border-none [&:-webkit-autofill]:outline-none
          [&:-webkit-autofill:hover]:border-none [&:-webkit-autofill:focus]:border-none
          `,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
