import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { overlaps } from "@/utils/time";

export type BookingPayload = {
  date: string;         // "YYYY-MM-DD"
  servicer: string;
  startTime: string;    // "15:00"
  startMin: number;     // 900
  durationMin: number;  // 45
  endMin: number;       // start + duration + buffer

  services: string[];
  totalMinutes: number;

  name: string;
  phone: string;
  email: string;
  address: string;
  agree: boolean;
};

export async function createBooking(payload: BookingPayload) {
  // 1) read existing bookings for this date + servicer
  const q = query(
    collection(db, "bookings"),
    where("date", "==", payload.date),
    where("servicer", "==", payload.servicer)
  );

  const snap = await getDocs(q);

  // 2) check overlap
  const conflict = snap.docs.some((docSnap) => {
    const b = docSnap.data() as any;
    return overlaps(payload.startMin, payload.endMin, b.startMin, b.endMin);
  });

  if (conflict) {
    throw new Error("This time was just booked. Please choose another time.");
  }

  // 3) save booking
  const ref = await addDoc(collection(db, "bookings"), {
    ...payload,
    createdAt: serverTimestamp(),
    status: "CONFIRMED",
  });

  return ref.id;
}
