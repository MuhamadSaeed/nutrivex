import toast from "react-hot-toast";

const DATA_URL = "https://raw.githubusercontent.com/MuhamadSaeed/nutrition-data/main/nutrition.json";
export default async function fetchNutrition() {
  try {
    const res = await fetch(DATA_URL);

    if (!res.ok) {
      toast.error("Failed to load nutrition data");
      return undefined; 
    }

    return await res.json();
  } catch {
    toast.error("Connection error, Please try again");
    return undefined;
  }
}