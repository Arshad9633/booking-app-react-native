export type ServiceKey =
  | "HAIRCUT"
  | "BEARD_TRIMMING"
  | "HAIR_DYE"
  | "SHAVING"
  | "BLACK_MASK"
  | "LADIES_HAIRCUT"
  | "FACIAL"
  | "STRAIGHTENING"
  | "LADIES_THREADING"
  | "THREADING"
  | "HEAD_OIL_MASSAGE";

export const SERVICES: { key: ServiceKey; label: string; minutes: number }[] = [
  { key: "HAIRCUT", label: "HAIRCUT", minutes: 30 },
  { key: "BEARD_TRIMMING", label: "BEARD TRIMMING", minutes: 15 },
  { key: "HAIR_DYE", label: "HAIR DYE", minutes: 45 },
  { key: "SHAVING", label: "SHAVING", minutes: 15 },
  { key: "BLACK_MASK", label: "BLACK MASK", minutes: 20 },
  { key: "LADIES_HAIRCUT", label: "LADIES HAIRCUT", minutes: 45 },
  { key: "FACIAL", label: "FACIAL", minutes: 30 },
  { key: "STRAIGHTENING", label: "STRAIGHTENING", minutes: 60 },
  { key: "LADIES_THREADING", label: "LADIES THREADING", minutes: 20 },
  { key: "THREADING", label: "THREADING", minutes: 15 },
  { key: "HEAD_OIL_MASSAGE", label: "HEAD OIL MASSAGE", minutes: 20 },
];

export const TIME_SLOTS = [
  "11:00 - 12:59",
  "15:00 - 16:00",
  "16:01 - 17:30",
  "17:30 - 18:16",
  "20:16 - 20:29",
];

export const SERVICERS = ["Choose servicer", "JIGAR", "RAHUL", "AMAN"];
