import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BUFFER_MIN, overlaps, toHHMM } from "@/utils/time";

const OPEN_MIN = 11 * 60;   // 11:00
const CLOSE_MIN = 21 * 60;  // 21:00
const STEP_MIN = 5;         // show every 5 minutes (change to 1 if you want)

type Interval = { start: number; end: number };

function computeAvailableStarts(booked: Interval[], durationMin: number) {
  if (!durationMin || durationMin <= 0) return [];

  const starts: number[] = [];

  for (let start = OPEN_MIN; start + durationMin + BUFFER_MIN <= CLOSE_MIN; start += STEP_MIN) {
    const end = start + durationMin + BUFFER_MIN;
    const conflict = booked.some((b) => overlaps(start, end, b.start, b.end));
    if (!conflict) starts.push(start);
  }

  return starts.map(toHHMM); // return list like ["11:00", "11:05", ...]
}

export default function useAvailability(dateStr: string, servicer: string, durationMin: number) {
  const [booked, setBooked] = useState<Interval[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dateStr || !servicer || servicer === "Choose servicer") {
      setBooked([]);
      return;
    }

    setLoading(true);

    const q = query(
      collection(db, "bookings"),
      where("date", "==", dateStr),
      where("servicer", "==", servicer),
      orderBy("startMin", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => d.data() as any);
        setBooked(rows.map((r) => ({ start: r.startMin, end: r.endMin })));
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, [dateStr, servicer]);

  const availableTimes = useMemo(() => {
    return computeAvailableStarts(booked, durationMin);
  }, [booked, durationMin]);

  return { availableTimes, loading };
}
