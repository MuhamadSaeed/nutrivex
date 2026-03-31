import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    // the emssage we sent from the client
    const { messages } = await req.json();

    // check if there is a mesage and it is an array cuz we sent all the conv messages not one
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
          You are a friendly and professional nutrition, health, and fitness coach.

          Your job is strictly limited to:
          - Nutrition and diets
          - Weight loss and fat loss
          - Muscle building and strength training
          - Gym workouts and exercises
          - Healthy lifestyle habits and recovery

          Language rules:
          - Detect automatically if the user speaks Arabic or English and reply in the same language.
          - If Arabic: reply in Modern Standard Arabic.

          Style rules:
          - Use emojis and small sections or bullet points for readability.
          - Keep your tone supportive, friendly, and motivating.

          Very important:
          - If the user asks about anything outside nutrition, health, or fitness 
            (such as coding, technology, programming, politics, or unrelated topics),
            politely refuse by saying:
            "Sorry, I can only help with nutrition, health, and fitness topics"
          `
        },
        ...messages.slice(-10),
      ],
      // thr output of ai
      max_tokens: 800,
    });

    const reply = completion.choices?.[0]?.message?.content || "sorry i didnt get you";
    return NextResponse.json({ reply });
  } catch(error) {
    console.error("err", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
