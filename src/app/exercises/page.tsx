"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ExerciseCardSkeleton from "@/components/ExerciseCardSkeleton";
import { Exercise } from "@/types";
import toast from "react-hot-toast";
import Image from "next/image";
import { fetchExercises as fetchExercisesApi } from "@/lib/fetch/fetchExercises";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // search text
  const [page, setPage] = useState(1); // page number
  const [totalPages, setTotalPages] = useState(1); // all pages
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const loadExercises = async (pageNum = 1, q = "") => {
    // to show the skeleton
    setLoading(true);
    setError(null);

    try {
      // determine searching mode
      if (q.trim()) {
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }

      // call the functio from lib
      const json = await fetchExercisesApi(pageNum, q);

      const dataArr: Exercise[] = json.data || [];
      setExercises(dataArr);

      const meta = json.metadata;
      setTotalPages(meta?.totalPages ?? 1);
    } catch {
      toast.error("error while fetching exercises");
      setError("error while fetching exercises");
      setExercises([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // fetch when page changes
  useEffect(() => {
    loadExercises(page);
  }, [page]);

  // scroll to top when page changes
  useEffect(() => {
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    return () => clearTimeout(t); // no memory leaks inshallah
  }, [page]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // always send num 1 cuz there is no pagination in the search api fetch
    loadExercises(1, search);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#222831] text-[#EEEEEE] pt-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-[#76ABAE] mb-3">Exercise Library</h1>
          <p className="text-gray-300">Search for exercises by name</p>

          <form onSubmit={onSearch} className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name (e.g., push up)"
              className="w-full sm:w-96 p-3 rounded-xl bg-[#31363F] text-[#EEEEEE] border border-[#76ABAE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
            />
            <button type="submit" className="px-6 py-3 bg-[#76ABAE] text-[#222831] rounded-xl hover:scale-105 transition">Search</button>
          </form>
        </header>

        <main>
          {error && <div className="text-center text-red-400 mb-4">{error}</div>}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* make nine skeletons */}
              {Array.from({ length: 9 }).map((_, i) => (
                <ExerciseCardSkeleton key={i} />
              ))}
            </div>
          ) : exercises.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No exercises found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {exercises.map((ex) => (
                <article key={ex.exerciseId} className="rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.45)]" >
                  <div className="relative w-full h-56 overflow-hidden rounded-xl mb-4">
                    {ex.gifUrl ? (
                        <Image src={ex.gifUrl} alt={ex.name} fill sizes="100%" loading="lazy" unoptimized className="object-cover"/>
                    ) : (
                      <div className="w-full h-full bg-[#3d434d] flex items-center justify-center text-gray-500">No Image</div>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg mb-3 text-center text-[#76ABAE]">
                    {ex.name.length > 30 ? ex.name.slice(0, 27) + "..." : ex.name}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-5 justify-center">
                    {ex.targetMuscles?.[0] && (
                      <span className="text-xs bg-cyan-500 text-black px-3 py-1 rounded-full">{ex.targetMuscles[0]}</span>
                    )}

                    {ex.equipments?.[0] && (
                      <span className="text-xs bg-amber-500 text-[#EEEEEE] px-3 py-1 rounded-full">{ex.equipments[0]}</span>
                    )}
                  </div>

                  <Link href={`/exercises/${ex.exerciseId}`}
                    className="block w-full text-center bg-cyan-500 text-[#0b0b0b] py-2 rounded-xl hover:scale-[1.03] transition"
                  >
                    View Details
                  </Link>
                </article>
              ))}
            </div>
          )}
          {/* total pages should be more than one cuz if we in searching phase, dont show the pagination */}
          {!isSearching && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3 pb-12">
              <button
                // max return u the biggest number of the two u give it and we puted it one cuz when it get to zero, return one 
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-5 py-2 rounded-lg border cursor-pointer border-[#76ABAE] text-[#76ABAE] hover:bg-[#76ABAE] hover:text-[#222831] transition disabled:opacity-40"
              >
                Prev
              </button>

              <span className="text-[#EEEEEE]">Page {page} of {totalPages}</span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="px-5 py-2 rounded-lg border cursor-pointer border-[#76ABAE] text-[#76ABAE] hover:bg-[#76ABAE] hover:text-[#222831] transition disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
