"use client"

interface TextareaProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
}
export default function Textarea({ label, value, setValue }: TextareaProps) {
  return (
    <label className="block">
      <span className="text-sm text-gray-300">{label}</span>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full mt-1 p-2 rounded bg-[#1E1E2F] border border-[#76E1D1] text-white h-28"
      />
    </label>
  );
}
