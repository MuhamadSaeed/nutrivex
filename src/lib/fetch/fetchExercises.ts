export const fetchExercises = async (pageNum = 1, q = "") => {
  const BASE_URL = "https://ex-swart-psi.vercel.app/api/v1/exercises";
  const LIMIT = 9;  

  // offset = (1 - 1) * 9 = 0 so start with zero
  // offset = (2 - 1) * 9 = 9 so start with 9
  const offset = (pageNum - 1) * LIMIT;
  let url = `${BASE_URL}?limit=${LIMIT}&offset=${offset}`;

  if (q.trim()) {
    url = `${BASE_URL}?search=${encodeURIComponent(q.trim())}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch exercises");

  return res.json(); 
};
