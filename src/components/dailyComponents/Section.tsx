interface SectionProps {
  title: string;
  children: React.ReactNode;
}
export default function Section({ title, children }: SectionProps) {
  return (
    <div className="bg-[#27293D] p-5 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-[#76E1D1] mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
