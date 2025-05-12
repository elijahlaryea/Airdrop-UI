import React from "react";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  type?: string;
  large?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

function InputField({
  label,
  placeholder = "",
  value,
  type = "text",
  large = false,
  onChange,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {large ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none"
          rows={4}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
}

export default InputField;
