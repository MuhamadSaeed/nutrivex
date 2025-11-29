import { notFound } from "next/navigation";
import Link from "next/link";
import {Exercise} from "@/types"
import Image from "next/image";

export default async function ExerciseDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetch(`https://ex-swart-psi.vercel.app/api/v1/exercises/${id}`);

  if (!res.ok) notFound();

  const json = await res.json();
  const ex: Exercise = json.data || json;

  return (
    <div className="min-h-screen bg-[#222831] text-[#EEEEEE] pt-[90px] px-4 sm:px-6 pb-16">
      <div className="max-w-5xl mx-auto bg-[#31363F] sm:rounded-2xl sm:shadow-[0_4px_20px_rgba(0,0,0,0.3)] sm:p-10 p-0">
        {ex.gifUrl && (
        <div className="flex justify-center mb-8 sm:mb-8">
          <Image
            src={ex.gifUrl}
            alt={ex.name}
            width={300}   
            height={200}
            className="rounded-xl shadow-lg object-contain sm:w-[400px] sm:h-[300px]"
          />
        </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#76ABAE] mb-8">
          {ex.name.length > 50 ? ex.name.slice(0, 47) + "..." : ex.name}
        </h1>

        <div className="space-y-6 px-4 sm:px-0">
          {ex.bodyParts && ex.bodyParts.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[#76ABAE] mb-2">Body Parts:</h2>
              <div className="flex flex-wrap gap-2">
                {ex.bodyParts.map((b) => (
                  <span key={b} className="px-3 py-1 bg-[#76ABAE]/15 text-[#EEEEEE] rounded-full text-sm">{b}</span>
                ))}
              </div>
            </div>
          )}

          {ex.targetMuscles && ex.targetMuscles.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[#76ABAE] mb-2">Target Muscles:</h2>
              <div className="flex flex-wrap gap-2">
                {ex.targetMuscles.map((m) => (
                  <span key={m} className="px-3 py-1 bg-[#76ABAE]/20 text-[#EEEEEE] rounded-full text-sm">{m}</span>
                ))}
              </div>
            </div>
          )}

          {ex.secondaryMuscles && ex.secondaryMuscles.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[#76ABAE] mb-2">Secondary Muscles:</h2>
              <div className="flex flex-wrap gap-2">
                {ex.secondaryMuscles.map((m) => (
                  <span key={m} className="px-3 py-1 bg-[#EEEEEE]/10 text-[#EEEEEE] rounded-full text-sm">{m}</span>
                ))}
              </div>
            </div>
          )}

          {ex.equipments && ex.equipments.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[#76ABAE] mb-2">Equipments:</h2>
              <div className="flex flex-wrap gap-2">
                {ex.equipments.map((eq) => (
                  <span key={eq} className="px-3 py-1 bg-[#31363F] border border-[#76ABAE] text-[#76ABAE] rounded-full text-sm">{eq}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-[#76ABAE] mb-3">Instructions:</h2>
            <ol className="list-decimal list-inside space-y-2 text-[#EEEEEE] leading-relaxed">
              {ex.instructions && ex.instructions.length > 0 ? (
                ex.instructions.map((ins, i) => (
                  <li key={i}>{ins.replace(/^Step:\d+\s*/i, "")}</li>
                ))
              ) : (
                <p className="text-gray-400">No instructions available.</p>
              )}
            </ol>
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/assistant"
              className="bg-[#76ABAE] hover:bg-[#89c3c6] text-[#222831] font-semibold py-3 px-6 rounded-full transition-all duration-300"
            >
              Need AI Help?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
