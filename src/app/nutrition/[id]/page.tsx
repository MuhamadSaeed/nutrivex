"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNutritionData } from "@/hooks/useNutritionData";
import { getSection } from "@/lib/getNutritionSection";

type Food = Record<string, string | number | undefined>;

export default function NutritionDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = React.use(props.params);

  const { data: allFoods, isLoading, isError } = useNutritionData();

  const food = React.useMemo<Food | undefined>(() => {
    if (!Array.isArray(allFoods)) return undefined;

    return allFoods.find((f: Food) =>
      String(f.id) === String(id) ||
      String(f.ID) === String(id) ||
      String(f.Name) === String(id)
    );
  }, [allFoods, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222831] flex items-center justify-center">
        <p className="text-[#76ABAE] text-2xl animate-pulse">Loading data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#222831] flex items-center justify-center">
        <div className="text-red-500 text-center mt-20 text-xl">Error loading data</div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="text-gray-300 text-center mt-20 text-xl">Food item not found.</div>
    );
  }

  //convert the object to array
  const allNutrients = Object.entries(food)
    // remove the items that equall null or not number
    .filter(([_, value]) => value !== "NULL" && !isNaN(Number(value)))
    .map(([key, value]) => ({
      name: key,
      amount: Number(value),
      unit: key.includes("(g)")
        ? "g"
        : key.includes("(mg)")
        ? "mg"
        : key.includes("(mcg)")
        ? "mcg"
        : key.includes("(IU)")
        ? "IU"
        : "",
    }));

  // for chart
  const macros = ["Protein (g)", "Fat (g)", "Carbohydrate (g)"];
  // filter to the three items above
  const macroValues = allNutrients.filter((n) => macros.includes(n.name));
  // name and value cuz we will eed it to the chart
  const chartData = macroValues.map((n) => ({ name: n.name, value: n.amount }));

  const COLORS = ["#36A2EB", "#FF6384", "#FFCE56"];
  

  return (
    <div className="min-h-screen bg-[#222831] text-[#EEEEEE] p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-2xl sm:text-4xl font-extrabold mb-6 sm:mb-8 mt-10 pt-2 sm:mt-12 text-[#76ABAE] text-center">
        {food["Name"]} — Nutrition Facts (for 100 g)
      </h1>

      {/* Pie Chart */}
      <div className="bg-[#31363F] border border-[#76ABAE]/40 rounded-2xl p-4 sm:p-6 mb-8 shadow-lg w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#76ABAE] text-center">Macronutrient Breakdown</h2>
        <div className="w-full h-64 sm:h-80">
          <ResponsiveContainer  width="100%" height="100%" minWidth={0} minHeight={200}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="70%"
                label
              >
                {chartData.map((_item, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Sections */}
      <div className="w-full max-w-4xl bg-[#31363F] rounded-3xl p-5 sm:p-8 shadow-xl border border-[#76ABAE]/30">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-center text-[#76ABAE]">
          Detailed Nutritional Data
        </h2>
        {/* get section takes 3 parameters (name or title, the data items of this title, and the all data) */}
          {getSection(
            "Macronutrients",
            [
              "Calories",
              "Fat (g)",
              "Saturated Fats (g)",
              "Trans Fatty Acids (g)",
              "Fatty acids, total monounsaturated (mg)",
              "Fatty acids, total polyunsaturated (mg)",
              "Protein (g)",
              "Carbohydrate (g)",
              "Net-Carbs (g)",
              "Sugars (g)",
              "Added Sugar (g)",
              "Total sugar alcohols (g)",
              "Starch (g)",
              "Fiber (g)",
              "Soluble Fiber (g)",
              "Insoluble Fiber (g)",
              "Alcohol (g)",
              "Water (g)"
            ],
            allNutrients
          )}

          {getSection(
            "Sugars & Sweeteners",
            [
              "Sugars (g)",
              "Sucrose (g)",
              "Glucose (Dextrose) (g)",
              "Fructose (g)",
              "Lactose (g)",
              "Maltose (g)",
              "Galactose (g)",
              "Added Sugar (g)",
              "Total sugar alcohols (g)"
            ],
            allNutrients
          )}

          {getSection(
            "Carbohydrates Breakdown",
            [
              "Carbohydrate (g)",
              "Net-Carbs (g)",
              "Starch (g)",
              "Total sugar alcohols (g)"
            ],
            allNutrients
          )}

          {getSection(
            "Fatty Acids & Omegas (mg)",
            [
              "Fatty acids, total monounsaturated (mg)",
              "Fatty acids, total polyunsaturated (mg)",
              "18:3 n-3 c,c,c (ALA) (mg)",
              "20:5 n-3 (EPA) (mg)",
              "22:5 n-3 (DPA) (mg)",
              "22:6 n-3 (DHA) (mg)",
              "Omega 3s (mg)",
              "Omega 6s (mg)"
            ],
            allNutrients
          )}

          {getSection(
            "Cholesterol & Lipids",
            [
              "Cholesterol (mg)",
              "PRAL score",
              "Trans Fatty Acids (g)",
              "Fatty acids, total monounsaturated (mg)",
              "Fatty acids, total polyunsaturated (mg)"
            ],
            allNutrients
          )}

          {getSection(
            "Minerals",
            [
              "Calcium (mg)",
              "Iron, Fe (mg)",
              "Potassium, K (mg)",
              "Magnesium (mg)",
              "Phosphorus, P (mg)",
              "Sodium (mg)",
              "Chlorine (mg)",
              "Zinc, Zn (mg)",
              "Copper, Cu (mg)",
              "Manganese (mg)",
              "Selenium, Se (mcg)",
              "Fluoride, F (mcg)",
              "Molybdenum (mcg)"
            ],
            allNutrients
          )}

          {getSection(
            "Vitamins & Carotenoids",
            [
              "Vitamin A, IU (IU)",
              "Vitamin A, RAE (mcg)",
              "Retinol (mcg)",
              "Carotene, beta (mcg)",
              "Carotene, alpha (mcg)",
              "Lycopene (mcg)",
              "Lutein + Zeaxanthin (mcg)",
              "Vitamin C (mg)",
              "Vitamin D (mcg)",
              "Vitamin D2 (ergocalciferol) (mcg)",
              "Vitamin D3 (cholecalciferol) (mcg)",
              "Vitamin D (IU) (IU)",
              "Vitamin E (Alpha-Tocopherol) (mg)",
              "Vitamin K (mcg)",
              "Dihydrophylloquinone (mcg)",
              "Menaquinone-4 (mcg)"
            ],
            allNutrients
          )}

          {getSection(
            "B-Vitamins",
            [
              "Thiamin (B1) (mg)",
              "Riboflavin (B2) (mg)",
              "Niacin (B3) (mg)",
              "Pantothenic acid (B5) (mg)",
              "Vitamin B6 (mg)",
              "Vitamin B-12 (mcg)",
              "Biotin (B7) (mcg)",
              "Folate (B9) (mcg)",
              "Folic acid (mcg)",
              "Food Folate (mcg)",
              "Folate DFE (mcg)",
              "Choline (mg)",
              "Betaine (mg)"
            ],
            allNutrients
          )}

          {getSection(
            "Amino Acids (mg)",
            [
              "Tryptophan (mg)",
              "Threonine (mg)",
              "Isoleucine (mg)",
              "Leucine (mg)",
              "Lysine (mg)",
              "Methionine (mg)",
              "Cystine (mg)",
              "Phenylalanine (mg)",
              "Tyrosine (mg)",
              "Valine (mg)",
              "Arginine (mg)",
              "Histidine (mg)",
              "Alanine (mg)",
              "Aspartic acid (mg)",
              "Glutamic acid (mg)",
              "Glycine (mg)",
              "Proline (mg)",
              "Serine (mg)",
              "Hydroxyproline (mg)"
            ],
            allNutrients
          )}

          {getSection(
            "Servings & Portions",
            [
              "Serving Weight 1 (g)",
              "Serving Description 1 (g)",
              "Serving Weight 2 (g)",
              "Serving Description 2 (g)",
              "Serving Weight 3 (g)",
              "Serving Description 3 (g)",
              "Serving Weight 4 (g)",
              "Serving Description 4 (g)",
              "Serving Weight 5 (g)",
              "Serving Description 5 (g)",
              "Serving Weight 6 (g)",
              "Serving Description 6 (g)",
              "Serving Weight 7 (g)",
              "Serving Description 7 (g)",
              "Serving Weight 8 (g)",
              "Serving Description 8 (g)",
              "Serving Weight 9 (g)",
              "Serving Description 9 (g)",
              "200 Calorie Weight (g)"
            ],
            allNutrients
          )}

          {getSection(
            "Other Nutritional Info",
            [
              "Cholesterol (mg)",
              "PRAL score",
              "Net-Carbs (g)",
              "200 Calorie Weight (g)",
              "Water (g)",
              "Omega 3s (mg)",
              "Omega 6s (mg)"
            ],
            allNutrients
          )}


      </div>
    </div>
  );
}
