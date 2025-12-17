# Salon Booking App (React Native + Expo Router)

A mobile booking dashboard app built with **React Native (Expo)**, **Expo Router (tabs navigation)** and **NativeWind (Tailwind CSS)**.  
Users can browse services, book appointments, view live available times, accept Terms & Conditions, and submit contact messages.

---

## Features implemented

### ✅ Navigation (Tabs)
- Bottom tab navigation using **Expo Router**
- Tabs/pages:
  - `Home`
  - `Booking`
  - `Service`
  - `Contact`

Folder layout (Expo Router):
- `app/(tabs)/_layout.tsx` → Tabs configuration
- `app/(tabs)/index.tsx` → Home screen
- `app/(tabs)/booking.tsx` → Booking form
- `app/(tabs)/service.tsx` → Services list + filter/search
- `app/(tabs)/contact.tsx` → Contact form

---

### ✅ Global Screen Background
- A reusable `Screen` wrapper component applies:
  - Full screen background image (`images.bg`)
  - Dark overlay to match salon theme
  - Safe-area support (top)

File:
- `components/Screen.tsx`

---

### ✅ Home Page (Animated)
- Home screen design based on the provided UI reference
- Button navigates to Booking page
- Animation support via **react-native-reanimated**

Files:
- `app/(tabs)/index.tsx`
- `babel.config.js` configured for NativeWind + Reanimated plugin

---

### ✅ Booking Form (Mobile friendly)
- Responsive layout (works on small devices)
- Keyboard-safe scrolling using `react-native-keyboard-aware-scroll-view`
- Required fields + validation:
  - Appointment Date (calendar picker)
  - Servicer
  - Services (checkbox list)
  - Live available start times
  - Name, Phone (digits only), Email (format check), Address
  - Terms & Conditions required

Booking flow:
1. User fills the form
2. Presses **Book now**
3. Confirmation modal opens showing booking details
4. Only when user confirms, data is saved to DB
5. Form resets after success

---

### ✅ Terms & Conditions Modal
- Clicking Terms & Conditions opens a modal
- User can accept inside modal, then checkbox becomes checked

---

### ✅ Service Page (Browse & Quick Book)
- Service list UI cards
- Search box
- Category filter pills (All, Hair, Beard, Skin, Ladies, Other)
- “Book now” can navigate to Booking page
- Support for passing a service selection to booking via route params
  - Booking screen can auto-select a service if passed from Service page

---

### ✅ Contact Page
- Styled contact form (Name, Email, Phone, Message)
- Validation + keyboard-safe scrolling

---

### ✅ Database (Firestore)
- Project stores bookings in Firestore
- Booking is saved only after confirm step
- Includes time fields for scheduling logic (startMin, durationMin, endMin, buffer)

Firestore files (example structure):
- `lib/firebase.ts` → Firebase init
- `services/bookingService.ts` → Create booking
- `hooks/useAvailability.ts` → Fetch existing bookings and compute available start times

---

## Tech Stack
- **Expo + React Native**
- **Expo Router** (file-based routing with Tabs)
- **NativeWind** (Tailwind CSS for React Native)
- **React Native Reanimated** (animations)
- **Firestore** (database)
- **Keyboard Aware Scroll View** (fix keyboard overlay issues)

---
## Screenshots

### Home
![Home Screen](screenshots/home.png)

### Booking
![Booking Screen](screenshots/booking.png)

### Services
![Services Screen](screenshots/service.png)

### Contact
![Contact Screen](screenshots/contact.png)

