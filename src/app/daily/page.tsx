"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs,} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
// UI Components
import Input from "@/components/dailyComponents/Input";
import Section from "@/components/dailyComponents/Section";
import Select from "@/components/dailyComponents/Select";
import Textarea from "@/components/dailyComponents/Teaxtarea";
// others
import ReactMarkdown from "react-markdown";

export default function DailyReportPage() {
  // Sleep
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");

  // Nutrition
  const [foodSummary, setFoodSummary] = useState("");
  const [mealsCount, setMealsCount] = useState("");
  const [sugarLevel, setSugarLevel] = useState("");
  const [waterCups, setWaterCups] = useState("");

  // Exercise
  const [exerciseType, setExerciseType] = useState("");
  const [exerciseDuration, setExerciseDuration] = useState("");
  const [exerciseIntensity, setExerciseIntensity] = useState("");

  // Mood & Energy
  const [energyLevel, setEnergyLevel] = useState("");
  const [moodLevel, setMoodLevel] = useState("");

  // Symptoms
  const [feltPain, setFeltPain] = useState("");
  const [painLocation, setPainLocation] = useState("");

  // Personal Health Data
  const [diabetes, setDiabetes] = useState("");
  const [hypertension, setHypertension] = useState("");
  const [jointIssues, setJointIssues] = useState("");
  const [foodAllergies, setFoodAllergies] = useState("");

  // Extra notes
  const [extraNotes, setExtraNotes] = useState("");

  // Others
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [weeklyReady, setWeeklyReady] = useState(false);

  // turn the date to [year]-[month]-[day] => 2025-12-16
  const getDayKey = (d = new Date()) => d.toISOString().split("T")[0];
  // console.log((new Date()).toISOString().split("T")[0]);

  const saveDailyClient = async (summary: string) => {
    const user = auth.currentUser;
    // console.log(auth.currentUser);
    
    if (!user) return false; //if there is no user, it will be null

    // users/{userId}/dailyReports
    const ref = collection(db, "users", user.uid, "dailyReports");
    const todayKey = getDayKey();

    // if there is a document => update it, if there is no => add it
    await setDoc(doc(ref, todayKey), {
      summary,
      createdAt: new Date(),
    });

    const snap = await getDocs(ref);
    return snap.size >= 7;
  };


  const submitData = async () => {
    setLoading(true);

    const summary = `
      DAILY REPORT INPUT DATA
      Sleep:
      - Sleep time: ${sleepTime}
      - Wake time: ${wakeTime}
      - Sleep quality: ${sleepQuality}

      Nutrition:
      - Food summary: ${foodSummary}
      - Meals count: ${mealsCount}
      - Sugar level: ${sugarLevel}
      - Water intake cups: ${waterCups}

      Exercise:
      - Exercise type: ${exerciseType}
      - Exercise duration: ${exerciseDuration}
      - Exercise intensity: ${exerciseIntensity}

      Mood & Energy:
      - Energy level: ${energyLevel}
      - Mood level: ${moodLevel}

      Symptoms:
      - Felt pain: ${feltPain}
      - Pain location: ${painLocation}

      Personal Health Data:
      - Diabetes: ${diabetes}
      - Hypertension: ${hypertension}
      - Joint issues: ${jointIssues}
      - Food allergies: ${foodAllergies}

      Additional Notes:
      ${extraNotes}
    `;

    // AI daily report
    const res = await fetch("/api/daily-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary }),
    });

    const data = await res.json();
    setAiResponse(data.reply);

    // save daily to firebase
    const ready = await saveDailyClient(summary);
    // ready return true if the days = 7 and false if the days < 7 
    setWeeklyReady(ready);

    setLoading(false);
  };

  const generateWeeklyReport = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = collection(db, "users", user.uid, "dailyReports");
    const snap = await getDocs(ref);

    // we already make the bt disabled but maybe he can remove it from the browser devtools
    if (snap.size < 7) {
      alert("Not enough days");
      return;
    }

    const weeklySummary = snap.docs
      // sort it from old to new => 10, 11, 12, 13...
      .sort((a, b) => a.id.localeCompare(b.id))
      // we just get the summary 
      .map(doc => doc.data().summary)
      // make all summaries in one string and put " n line n line ---- line n line n line " between it
      .join("\n\n---\n\n");

    const res = await fetch("/api/weekly-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weeklySummary }),
    });

    const data = await res.json();
    // in the same state of the daily res 
    setAiResponse(data.reply);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setWeeklyReady(false);
        return;
      }

      const ref = collection(db, "users", user.uid, "dailyReports");
      const snap = await getDocs(ref);

      setWeeklyReady(snap.size >= 7);
    });

    return () => unsubscribe();
  }, []);


  return (
    <div className="min-h-screen p-8 bg-[#1E1E2F] text-white">
      <h1 className="text-4xl font-bold text-[#76E1D1] mb-8 pt-16">Daily Health Inputs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Section title="Sleep">
          <Input label="Sleep Time" type="time" value={sleepTime} setValue={setSleepTime} />
          <Input label="Wake Time" type="time" value={wakeTime} setValue={setWakeTime} />
          <Select label="Sleep Quality" value={sleepQuality} setValue={setSleepQuality} options={["Poor", "Average", "Good"]} />
        </Section>

        <Section title="Nutrition">
          <Textarea label="What did you eat today?" value={foodSummary} setValue={setFoodSummary} />
          <Input label="Meals Count" type="number" value={mealsCount} setValue={setMealsCount} />
          <Select label="Sugar Level" value={sugarLevel} setValue={setSugarLevel} options={["Low", "Medium", "High"]} />
          <Input label="Water Cups Drank" type="number" value={waterCups} setValue={setWaterCups} />
        </Section>

        <Section title="Exercise">
          <Input label="Exercise Type" value={exerciseType} setValue={setExerciseType} />
          <Input label="Exercise Duration (minutes)" type="number" value={exerciseDuration} setValue={setExerciseDuration} />
          <Select label="Intensity" value={exerciseIntensity} setValue={setExerciseIntensity} options={["Low", "Medium", "High"]} />
        </Section>

        <Section title="Mood & Energy">
          <Select label="Energy Level (1–5)" value={energyLevel} setValue={setEnergyLevel} options={["1", "2", "3", "4", "5"]} />
          <Select label="Mood Level (1–5)" value={moodLevel} setValue={setMoodLevel} options={["1", "2", "3", "4", "5"]} />
        </Section>

        <Section title="Symptoms">
          <Select label="Felt Pain Today?" value={feltPain} setValue={setFeltPain} options={["Yes", "No"]} />
          <Select label="Pain Location" value={painLocation} setValue={setPainLocation} options={["None", "Back", "Knee", "Head", "Other"]} />
        </Section>

        <Section title="Personal Health Data">
          <Select label="Diabetes?" value={diabetes} setValue={setDiabetes} options={["No", "Type 1", "Type 2"]} />
          <Select label="Hypertension?" value={hypertension} setValue={setHypertension} options={["No", "Yes"]} />
          <Select label="Back/Knee Issues?" value={jointIssues} setValue={setJointIssues} options={["None", "Back", "Knee", "Both"]} />
          <Input label="Food Allergies" value={foodAllergies} setValue={setFoodAllergies} />
        </Section>

        <Section title="Additional Notes">
          <Textarea label="Write anything you want…" value={extraNotes} setValue={setExtraNotes} />
        </Section>

      </div>

      {aiResponse && (
        <div className="mt-10 p-6 bg-[#2F314A] rounded-xl">
          <ReactMarkdown>{aiResponse}</ReactMarkdown>
        </div>
      )}

      <button onClick={submitData} className="mt-8 bg-[#76E1D1] cursor-pointer mr-2 text-black font-bold px-6 py-3 rounded-lg">
        {loading ? "Generating..." : "Generate Report"}
      </button>

      <button disabled={!weeklyReady} onClick={generateWeeklyReport}
        className={`mt-6 font-bold px-6 py-3 rounded-lg 
          ${weeklyReady
            ? "bg-yellow-900 text-black cursor-pointer"
            : "bg-gray-500 text-gray-200 cursor-not-allowed"}
        `}
      >
        Generate Weekly Report
      </button>

    </div>
  );
}