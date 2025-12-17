import { useMemo, useState } from "react";
import { SERVICES, ServiceKey } from "@/constants/booking";

export type BookingErrors = Partial<Record<
  "date" | "servicer" | "slot" | "services" | "name" | "phone" | "email" | "address" | "agree",
  string
>>;

const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const onlyDigits = (v: string) => v.replace(/\D/g, "");

export const formatDate = (d: Date | null) => {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function useBookingForm() {
  const [date, setDate] = useState<Date | null>(null);
  const [servicer, setServicer] = useState("Choose servicer");
  const [slot, setSlot] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<BookingErrors>({});

  const [selectedServices, setSelectedServices] = useState<Record<ServiceKey, boolean>>(
    () =>
      SERVICES.reduce((acc, s) => {
        acc[s.key] = false;
        return acc;
      }, {} as Record<ServiceKey, boolean>)
  );

  const selectedServiceLabels = useMemo(
    () => SERVICES.filter((s) => selectedServices[s.key]).map((s) => s.label),
    [selectedServices]
  );

  const totalMinutes = useMemo(
    () => SERVICES.reduce((sum, s) => sum + (selectedServices[s.key] ? s.minutes : 0), 0),
    [selectedServices]
  );

  const toggleService = (key: ServiceKey) =>
    setSelectedServices((p) => ({ ...p, [key]: !p[key] }));
  
    const selectOnlyService = (key: ServiceKey) => {
    setSelectedServices(() => {
      const next = SERVICES.reduce((acc, s) => {
        acc[s.key] = false;
        return acc;
      }, {} as Record<ServiceKey, boolean>);

      next[key] = true;
      return next;
    });

    // when service changes, availability changes -> clear time
    setSlot("");
    clearError("services");
    clearError("slot");
  };


  const clearError = (key: keyof BookingErrors) => {
    if (!errors[key]) return;
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const setPhoneDigits = (v: string) => {
    setPhone(onlyDigits(v));
    clearError("phone");
  };

  const reset = () => {
    setDate(null);
    setServicer("Choose servicer");
    setSlot("");
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setAgree(false);
    setErrors({});
    setSelectedServices(
      SERVICES.reduce((acc, s) => {
        acc[s.key] = false;
        return acc;
      }, {} as Record<ServiceKey, boolean>)
    );
  };

  const validate = () => {
    const e: BookingErrors = {};

    if (!date) e.date = "Appointment date is required";
    if (!servicer || servicer === "Choose servicer") e.servicer = "Choose a servicer";
    if (!slot) e.slot = "Select a time slot";
    if (selectedServiceLabels.length === 0) e.services = "Select at least one service";

    if (!name.trim()) e.name = "Name is required";

    if (!phone.trim()) e.phone = "Phone number is required";
    else if (phone.trim().length < 7) e.phone = "Phone number is too short";

    if (!email.trim()) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Enter a valid email";

    if (!address.trim()) e.address = "Address is required";

    if (!agree) e.agree = "You must accept Terms & Conditions";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = () => ({
    date: formatDate(date),
    servicer,
    slot,
    services: selectedServiceLabels,
    totalMinutes,
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    address: address.trim(),
    agree,
  });

  return {
    // values
    date, servicer, slot, name, phone, email, address, agree,
    selectedServices, selectedServiceLabels, totalMinutes,

    // setters
    setDate: (d: Date | null) => { setDate(d); clearError("date"); },
    setServicer: (v: string) => { setServicer(v); clearError("servicer"); },
    setSlot: (v: string) => { setSlot(v); clearError("slot"); },
    setName: (v: string) => { setName(v); clearError("name"); },
    setPhoneDigits,
    setEmail: (v: string) => { setEmail(v); clearError("email"); },
    setAddress: (v: string) => { setAddress(v); clearError("address"); },
    setAgree: (v: boolean) => { setAgree(v); clearError("agree"); },

    // actions
    toggleService,
    selectOnlyService,
    reset,
    validate,
    buildPayload,

    // errors
    errors,
    clearError,
  };
}
