"use client";

interface InputProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
}

export default function Input({ label, value, setValue, type = "text" }: InputProps) {
  return (
    <label className="block">
      <span className="text-sm text-gray-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full mt-1 p-2 rounded bg-[#1E1E2F] border border-[#76E1D1] text-white"
      />
    </label>
  );
}
