"use client";

import { useQuery } from "@tanstack/react-query";
import  fetchNutrition  from "@/lib/fetch/fetchNutritions";

export function useNutritionData() {
  return useQuery({
    queryKey: ["nutrition-data"],
    queryFn: fetchNutrition,
    staleTime: Infinity,         // dont make data refrech while the session
    gcTime: 1000 * 60 * 60,      // remove from cache after one hour
    refetchOnWindowFocus: false, // no refetch after the user return to the window again
    retry: 1,                    // on error => try another one
  });
}