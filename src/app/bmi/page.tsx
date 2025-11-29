"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("1.2"); // 1.2 => no sport => no walk

  const calcBMI = (w: number, h: number) => {
    if (!w || !h) return NaN;
    // turn the tall from cm to m
    const hM = h / 100;
    // bmi = wight / (tall by m * tall by m)
    return w / (hM * hM);
  };

  const calcBMR = (w: number, h: number, a: number, g: string) => {
    if (!w || !h || !a) return NaN;
    // bmr = 10 * whight + 6.25 * hight - 5 * age
    const base = 10 * w + 6.25 * h - 5 * a;
    // men => base + 5 & women => base - 161
    return g === "male" ? base + 5 : base - 161;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!weight || !height || !age) {
      toast.error("Please fill all required fields");
      return;
    }

    toast.success("Scroll down to see results");
  };

  // forms return str even if it is number like 20 it will return it "20"
  const w = Number(weight);
  const h = Number(height);
  const a = Number(age);

  const bmi = calcBMI(w, h);
  const bmr = calcBMR(w, h, a, gender);
  // bmr * activity level
  const dailyCalories = bmr ? bmr * Number(activity) : NaN;

  const bmiCategory =
  // if bmi not a number return "_"
    isNaN(bmi)  ? "-"
      : bmi < 18.5  ? "Underweight"
      : bmi < 25    ? "Normal"
      : bmi < 30    ? "Overweight"
      : "Obese";  // he is over 30 so give him obese

  return (
    <div className="min-h-screen bg-black text-[#EEEEEE] pt-6">
      {/* ===== Hero ===== */}
      <section className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          BMI & Calories <span className="text-[#76ABAE]">Calculator</span>
        </h1>
        <p className="text-gray-300 max-w-2xl">Calculate your Body Mass Index, BMR and daily calorie needs</p>
      </section>

      {/* ===== Calculator Form ===== */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto p-8 rounded-3xl border border-[#76ABAE] bg-[#0f1113] flex flex-col gap-6"
        >
          {/* Weight + Height */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-transparent border border-[#76ABAE] focus:outline-none"
                placeholder="70"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-transparent border border-[#76ABAE] focus:outline-none"
                placeholder="175"
                required
              />
            </div>
          </div>

          {/* Age + Gender + Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-transparent border border-[#76ABAE] focus:outline-none"
                placeholder="25"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-transparent border border-[#76ABAE] focus:outline-none"
              >
                <option value="male" className="text-black">Male</option>
                <option value="female" className="text-black">Female</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold">Activity Level</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-transparent border border-[#76ABAE] focus:outline-none"
              >
                <option value="1.2" className="text-black">Sedentary</option>
                <option value="1.375" className="text-black">Light Activity</option>
                <option value="1.55" className="text-black">Moderate</option>
                <option value="1.725" className="text-black">Active</option>
                <option value="1.9" className="text-black">Athlete</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-10 py-3 rounded-full bg-[#76ABAE] text-black font-bold hover:scale-105 transition w-max mx-auto"
          >
            Calculate
          </button>
        </form>

        {/* ===== Results ===== */}
        <div className="max-w-3xl mx-auto mt-12 p-8 bg-[#181a1d] rounded-3xl border border-[#76ABAE]">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#76ABAE]"> Results </h2>

          <p className="mb-3 text-lg">
            <span className="text-[#76ABAE] font-semibold">BMI: </span>
            {isNaN(bmi) ? "-" : bmi.toFixed(1)} ({bmiCategory})
          </p>

          <p className="mb-3 text-lg">
            <span className="text-[#76ABAE] font-semibold">BMR: </span>
            {isNaN(bmr) ? "-" : Math.round(bmr)} kcal/day
          </p>

          <p className="text-lg">
            <span className="text-[#76ABAE] font-semibold">Daily Calories: </span>
            {isNaN(dailyCalories) ? "-" : Math.round(dailyCalories)} kcal/day
          </p>
        </div>
      </section>
    </div>
  );
}
