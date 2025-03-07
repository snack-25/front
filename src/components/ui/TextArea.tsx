import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: "md" | "sm"; // ✅ md가 기본입니다! sm은 작은 사이즈입니다.
  minLength?: number; // ✅ 최소 입력 글자 수입니다. 8자 이상 입력해야합니다. 
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size = "md", minLength = 8, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState(props.value || "");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      if (props.onChange) props.onChange(e);
    };

    return (
      <div className="flex flex-col gap-1 w-full">
        <textarea
          ref={ref}
          className={cn(
            "border rounded-lg p-3 transition-all focus:ring-2 focus:ring-blue-500",
            size === "sm" ? "h-24 text-sm" : "h-40 text-base",
            className
          )}
          value={inputValue}
          onChange={handleChange}
          {...props}
        />
        {String(inputValue).length < minLength && (
          <p className="text-sm text-red-500">
            최소 {minLength}자 이상 입력해야 합니다.
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
