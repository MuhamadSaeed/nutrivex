"use client";

import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/context/AuthContext";
import { doc, getDoc, setDoc, collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { Typewriter } from "react-simple-typewriter";
// to arreng the text of ai
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};
// cuz we just make one conversation for every user
const CONVERSATION_ID = "default";

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null); // last mes 

  // Load conversation when user is ready
  useEffect(() => {
    if (!user) return;

    const loadConversation = async () => {
      //users /
      // {user.uid} /
      //  conversations /
      //   {CONVERSATION_ID} = default
      const convDocRef = doc(
        db,
        "users",
        user.uid, 
        "conversations",
        CONVERSATION_ID
      );
      const convDoc = await getDoc(convDocRef);

      // if the user first time use the ai, create a conversation 
      if (!convDoc.exists()) {
        await setDoc(convDocRef, {
          title: "Default Conversation",
          createdAt: serverTimestamp(),
        });
      }

      const msgRef = collection(
        db,
        "users",
        user.uid, 
        "conversations",  
        CONVERSATION_ID,
        "messages"
      );

      // create a query of msgref to get the data // from old to new
      const q = query(msgRef, orderBy("createdAt", "asc")); 
      // do the query => msgsnap = all data
      const msgSnap = await getDocs(q); 

      const loaded: Message[] = msgSnap.docs.map((d) => {
        const data = d.data();
        return {
          // user or assistant
          role: data.role === "assistant" ? "assistant" : "user",
          content: String(data.content ?? ""),
        };
      });

      // console.log(loaded);      
      setMessages(loaded);
    };

    loadConversation();
  }, [user]);

  // to show it to user immeditly without refresh
  const appendMessageToState = (msg: Message) => {
    // add all the old + the new one
    setMessages((prev) => [...prev, msg]);
  };

  const addMessageToFirestore = async (msg: Message) => {
    if (!user) return;

    // in messages will be a doc for every message with uniqe id
    await addDoc(
      collection(
        db,
        "users",
        user.uid,
        "conversations",
        CONVERSATION_ID,
        "messages"
      ),
      {
        role: msg.role,
        content: msg.content,
        createdAt: serverTimestamp(),
      }
    );
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !user) return;

    setLoading(true); // to show thinking message while loading

    const userMsg: Message = { role: "user", content: text };

    appendMessageToState(userMsg); // sned it to ui
    // send it to fb => users / {uid} / conversations / default / messages
    await addMessageToFirestore(userMsg); 
 
    setInput("");

    try {
      // cuz we will send all messages to the ai [old+new]
      const convoForApi = [...messages, userMsg];

      // send to api
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: convoForApi }),
      });

      const data = await res.json();

      // console.log(data.reply);
      const aiMsg: Message = {
        role: "assistant",
        content: data.reply || "Sorry, I couldnt respond.",
      };

      appendMessageToState(aiMsg);
      await addMessageToFirestore(aiMsg);
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll
  useEffect(() => {
    const id = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50); // 50ms to make sure everything rendered
    return () => clearTimeout(id);
  }, [messages, loading]);

  return (
    <div className="flex pb-2 bg-[#1E1E2F] text-[#EDEDED] pt-22 ">
      <div className="m-auto w-full max-w-3xl flex flex-col h-[90vh] bg-[#27293D] rounded-xl shadow-lg ">
        <header className="p-4 flex justify-between items-center border-b border-[#76E1D1]">
          <h1 className="text-[#76E1D1] font-bold">Chat Assistant</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i}
              // make the msg of user in the right and the ai in left
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-xl px-4 py-3 rounded-2xl shadow-md ${
                m.role === "user" ? "bg-[#76E1D1] text-[#1E1E2F] rounded-br-none" : "bg-[#2F314A] text-[#EDEDED] rounded-bl-none"
              }`}
              >
                <ReactMarkdown>
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="bg-[#2F314A] px-4 py-3 rounded flex items-center gap-2">
              <Typewriter
                words={["Thinking...", "Thinking..", "Thinking."]}
                loop={0}
                // cursor
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={500}
              />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-[#27293D] flex gap-3 border-t border-[#76E1D1]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            className="flex-1 bg-transparent border border-[#76E1D1] px-4 py-2 rounded-lg"
            placeholder="Type your message..."
          />

          <button
            onClick={() => sendMessage(input)}
            className="p-3 rounded-full bg-[#76E1D1] text-[#1E1E2F] cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
