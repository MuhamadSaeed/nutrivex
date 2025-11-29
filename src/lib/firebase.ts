import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, Timestamp} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

export interface Blog {
  imageUrl: string;
  id: string;
  title: string;
  content: string;
  createdAt?: Timestamp | null;
}

const firebaseConfig = {
  apiKey: "AIzaSyBxm0FVnrRUqLS-9yJphKmqjagvWsAJRvE",
  authDomain: "nutrivex-ebd58.firebaseapp.com",
  projectId: "nutrivex-ebd58",
  storageBucket: "nutrivex-ebd58.appspot.com",
  messagingSenderId: "774881073699",
  appId: "1:774881073699:web:472ce8e2944e7fd9d12f96"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); 

export const getLatestBlogsFirebase = async (limit: number = 3): Promise<Blog[]> => {
  const snapshot = await getDocs(collection(db, "posts"));
  console.log(snapshot.docs)
  const blogs = snapshot.docs.map(doc => {
      const data = doc.data() as Omit<Blog, "id">;
      // console.log(data);      
      return { id: doc.id, ...data };
    }).sort((a, b) => {
      // if b - a = positive num then it is latest 
      return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0); 
    }).slice(0, limit);
  return blogs;
};