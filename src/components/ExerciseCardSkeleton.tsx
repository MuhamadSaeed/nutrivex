"use client";

export default function ExerciseCardSkeleton() {
  return (
    <div className="bg-[#31363F] rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-56 bg-[#3d434d]" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-[#3d434d] rounded w-3/4"></div>
        <div className="flex gap-2">
          <div className="h-4 bg-[#3d434d] rounded-full w-16"></div>
          <div className="h-4 bg-[#3d434d] rounded-full w-20"></div>
        </div>
        <div className="h-9 bg-[#3d434d] rounded-xl w-full"></div>
      </div>
    </div>
  );
}