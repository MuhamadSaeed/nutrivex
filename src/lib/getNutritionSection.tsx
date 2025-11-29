import React from "react";
import type { Nutrient } from "@/types"; 

export function getSection(title: string, filter: string[], allNutrients: Nutrient[]) {
  // we filter all nutrition to just the data that we send in the "filter"
  const sectionData = allNutrients.filter((n) => filter.includes(n.name));

  if (sectionData.length === 0) return null;

  return (
    <div className="mb-8 sm:mb-10">
      <h3 className="text-xl sm:text-2xl font-bold text-[#76ABAE] mb-3 sm:mb-4">{title}</h3>
      <table className="w-full text-[#EEEEEE] text-xs sm:text-sm border-separate border-spacing-y-2">
        <tbody>
          {sectionData.map((n, i) => (
            <tr key={i} className="bg-[#31363F] hover:bg-[#3a4048] transition">
              <td className="py-2 px-3 sm:px-4 font-medium">{n.name}</td>
              <td className="py-2 px-3 sm:px-4 text-right font-semibold">
                {n.amount.toFixed(2)}
              </td>
              <td className="py-2 px-3 sm:px-4 text-right text-gray-400">{n.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
