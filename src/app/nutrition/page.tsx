"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { useNutritionData } from "@/hooks/useNutritionData";

interface FoodItem {
  id?: string;
  ID?: string;
  Name?: string;
  ["Food Group"]?: string;
}

export default function NutritionPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // useref cuz usestate will cause rerenders and thats heavvvvvy
  const fuseRef = useRef<Fuse<FoodItem> | null>(null);

  // react query
  const { data: allFoods, isLoading, isError, } = useNutritionData();

  useEffect(() => {
    // if there is an error, allfood = undifined, null or not an array
    if (!allFoods || !Array.isArray(allFoods)) {  
      fuseRef.current = null;
      setResults([]);
      return;
    }

    // init fuse
    fuseRef.current = new Fuse(allFoods, {
      keys: ["Name"],
      threshold: 0.3,
      includeScore: true,
    });


    // initial preview, show first 20 items
    setResults(allFoods.slice(0, 20));
  }, [allFoods]);

  const doSearch = () => {
    // check if user enter a search not spaces
    if (!query.trim()) {
      setResults(allFoods.slice(0, 20));
      setLoadingSearch(false);
      return;
    }

    setLoadingSearch(true);

    if (!fuseRef.current) {
      setLoadingSearch(false);
      return;
    }

    // feus search ... will return the item and the score and we just need the item 
    const r = fuseRef.current.search(query).map((s) => s.item);
    setResults(r);
    setLoadingSearch(false);
  };

  // Enter key => search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") doSearch();
  };

  const resultsHeading = useMemo(() => (query.trim() ? `Results for "${query}"` : "Some Foods"),
    [query]
  );

  return (
    <div className="min-h-screen bg-[#222831] text-[#EEEEEE] flex flex-col items-center p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-[#76ABAE] pt-16"> Nutrition Search </h1>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 mb-6 sm:mb-8 w-full max-w-md">
        <input type="text" placeholder="Search for food..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
          className="border border-[#76ABAE] text-[#EEEEEE] rounded-xl p-2 sm:p-3 w-full focus:ring-2 focus:ring-[#76ABAE] outline-none text-sm sm:text-base"
        />

        <button onClick={doSearch}
          className="bg-[#76ABAE] text-[#222831] cursor-pointer px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-[#5c9b9e] transition text-sm sm:text-base"
        >
          {loadingSearch ? "Searching..." : "Search"}
        </button>
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center text-[#EEEEEE]">{resultsHeading}</h2>

      {/* Results */}
      <div className="grid gap-4 w-full max-w-2xl">
        {/* Show loading / error / no results */}
        {isLoading ? (
          <p className="text-center text-[#76ABAE]">Loading nutrition data…</p>
        ) : isError ? (
          <p className="text-center text-red-400">Error loading data</p>
        ) : results.length === 0 ? (
          <p className="text-center text-gray-400">No foods found.</p>
        ) : (
          results.map((food, i) => {
            const key = food?.id ?? food?.ID ?? `${food.Name ?? "item"}-${i}`;
            return (
              <Link key={key} href={`/nutrition/${key}`}>
                <div className="bg-[#31363F] border border-[#76ABAE]/40 p-4 sm:p-5 rounded-2xl shadow-md hover:shadow-[#76ABAE]/30 cursor-pointer">
                  <h2 className="text-lg sm:text-xl font-bold text-[#76ABAE] capitalize mb-1">{food?.Name ?? "Unknown"}</h2>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Category: {food?.["Food Group"] || "N/A"} | ID: {key}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
