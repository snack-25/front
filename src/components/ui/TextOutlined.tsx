import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface TextInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  showPasswordToggle?: boolean;
  required?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  errorMessage,
  showPasswordToggle = false,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isError = Boolean(errorMessage);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <Input
          type={showPasswordToggle && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            "border rounded-lg px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500",
            isError ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          )}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {isError && (
        <div className="flex items-center gap-1 text-sm text-red-500">
          <AlertCircle size={14} />
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default TextInput;
