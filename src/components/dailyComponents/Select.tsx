"use client";

interface SelectProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: string[];
}
export default function Select({ label, value, setValue, options }: SelectProps) {
  return (
    <label className="block">
      <span className="text-sm text-gray-300">{label}</span>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full mt-1 p-2 rounded bg-[#1E1E2F] border border-[#76E1D1] text-white"
      >
        <option value="">Select…</option>
            {options.map((op: string) => (
                <option key={op} value={op}>{op}</option>
            ))}
      </select>
    </label>
  );
}