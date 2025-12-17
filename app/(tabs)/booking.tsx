import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Platform,
  useWindowDimensions,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Screen from "@/components/Screen";

import { SERVICES, SERVICERS, TIME_SLOTS } from "@/constants/booking";
import useBookingForm from "@/hooks/useBookingForm";

import Row from "@/components/booking/Row";
import CheckRow from "@/components/booking/CheckRow";
import FieldError from "@/components/booking/FieldError";
import DateField from "@/components/booking/DateField";
import TermsModal from "@/components/booking/TermsModal";
import BookingSuccessModal from "@/components/booking/BookingSuccessModal";

import useAvailability from "@/hooks/useAvailability";
import { BUFFER_MIN, toMin } from "@/utils/time";
import { createBooking } from "@/services/bookingService";
import TimeSlotsBox from "@/components/booking/TimeSlotsBox";

import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";


export default function Booking() {
  const { width } = useWindowDimensions();
  const isSmall = width < 380;

  const form = useBookingForm();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);
  const [successDetails, setSuccessDetails] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // ✅ LIVE available times depend on: date + servicer + totalMinutes
  const { availableTimes, loading } = useAvailability(
    form.buildPayload().date, // YYYY-MM-DD from your hook
    form.servicer,
    form.totalMinutes
  );

  const onRefresh = () => {
    form.reset();               // clears all fields + errors (from your hook)
    setShowDatePicker(false);   // closes calendar picker if open
    setShowTerms(false);        // closes terms modal
    setSuccessOpen(false);      // closes success modal
    setSuccessDetails(null);    // clears modal data
    setSaving(false);           // stops any “saving…” state
  };

  const params = useLocalSearchParams<{ service?: string | string[] }>();

  useEffect(() => {
    const raw = params.service;
    const serviceKey = Array.isArray(raw) ? raw[0] : raw;

    if (!serviceKey) return;

    const match = SERVICES.find((s) => s.key === serviceKey)?.key; // typed ServiceKey | undefined
    if (match) form.selectOnlyService(match);
  }, [params.service]);


  const onSubmit = () => {
    if (!form.validate()) return;

    // also require a time from live list
    if (!form.slot) {
      Alert.alert("Select time", "Please choose an available start time.");
      return;
    }

    const payload = form.buildPayload();
    setSuccessDetails(payload);
    setSuccessOpen(true);
  };

  return (
    <Screen>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={28}
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-5 pt-6 pb-4 flex-row items-center justify-between">
          <Text className="text-light-100 text-xl font-extrabold tracking-widest">
            APPOINTMENT FORM
          </Text>

          <Pressable
            onPress={onRefresh}
            className="bg-accent px-4 py-2 rounded-xl"
            style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
          >
            <Text className="text-secondary font-bold text-sm">Refresh</Text>
          </Pressable>
        </View>


        <View className="mx-5 h-[1px] bg-accent/40 mb-4" />

        <View className="px-5 gap-4">
          {/* Appointment Date */}
          <Row isSmall={isSmall} label="Appointment Date">
            <DateField
              date={form.date}
              show={showDatePicker}
              setShow={setShowDatePicker}
              onChange={form.setDate}
              error={form.errors.date}
            />
          </Row>

          {/* Servicers */}
          <Row isSmall={isSmall} label="Servicers">
            <View>
              <Pressable
                onPress={() => {
                  const idx = SERVICERS.indexOf(form.servicer);
                  const next = SERVICERS[(idx + 1) % SERVICERS.length];
                  form.setServicer(next);
                }}
                className="bg-dark-100 px-4 py-3 rounded-lg border border-light-300/20"
              >
                <Text className="text-light-100">{form.servicer}</Text>
                <Text className="text-light-300 text-xs mt-1">(Tap to change)</Text>
              </Pressable>
              <FieldError message={form.errors.servicer} />
            </View>
          </Row>

          {/* Service */}
          <Row isSmall={isSmall} label="Service">
            <View>
              <View className="bg-dark-100 rounded-lg border border-light-300/20 px-4 py-2">
                <View className="flex-row">
                  <View className="flex-1 pr-2">
                    {SERVICES.slice(0, Math.ceil(SERVICES.length / 2)).map((s) => (
                      <CheckRow
                        key={s.key}
                        checked={!!form.selectedServices[s.key]}
                        label={s.label}
                        onPress={() => form.toggleService(s.key)}
                      />
                    ))}
                  </View>
                  <View className="flex-1 pl-2">
                    {SERVICES.slice(Math.ceil(SERVICES.length / 2)).map((s) => (
                      <CheckRow
                        key={s.key}
                        checked={!!form.selectedServices[s.key]}
                        label={s.label}
                        onPress={() => form.toggleService(s.key)}
                      />
                    ))}
                  </View>
                </View>
              </View>
              <FieldError message={form.errors.services} />
            </View>
          </Row>

          {/* ✅ LIVE Available Start Times */}
          <Row isSmall={isSmall} label="Available Times">
            <View>
              {!form.buildPayload().date || form.servicer === "Choose servicer" ? (
                <Text className="text-light-300 text-sm py-2">
                  Select date and servicer to see available times.
                </Text>
              ) : form.totalMinutes === 0 ? (
                <Text className="text-light-300 text-sm py-2">
                  Select services to calculate time.
                </Text>
              ) : loading ? (
                <Text className="text-light-300 text-sm py-2">
                  Loading availability...
                </Text>
              ) : availableTimes.length === 0 ? (
                <Text className="text-light-300 text-sm py-2">
                  No times available for this date/servicer.
                </Text>
              ) : (
                <TimeSlotsBox
                  slots={availableTimes}
                  value={form.slot}
                  onChange={form.setSlot}
                  maxHeight={260}
                />
              )}

              <FieldError message={form.errors.slot} />
            </View>
          </Row>

          {/* Name */}
          <Row isSmall={isSmall} label="Your Name">
            <View>
              <TextInput
                value={form.name}
                onChangeText={form.setName}
                placeholder="Full name"
                placeholderTextColor="#9E9E9E"
                className="bg-dark-100 text-light-100 px-4 py-3 rounded-lg border border-light-300/20"
              />
              <FieldError message={form.errors.name} />
            </View>
          </Row>

          {/* Phone */}
          <Row isSmall={isSmall} label="Phone Number">
            <View>
              <TextInput
                value={form.phone}
                onChangeText={form.setPhoneDigits}
                placeholder="Phone number"
                placeholderTextColor="#9E9E9E"
                keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                className="bg-dark-100 text-light-100 px-4 py-3 rounded-lg border border-light-300/20"
              />
              <FieldError message={form.errors.phone} />
            </View>
          </Row>

          {/* Email */}
          <Row isSmall={isSmall} label="Email">
            <View>
              <TextInput
                value={form.email}
                onChangeText={form.setEmail}
                placeholder="Email"
                placeholderTextColor="#9E9E9E"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-dark-100 text-light-100 px-4 py-3 rounded-lg border border-light-300/20"
              />
              <FieldError message={form.errors.email} />
            </View>
          </Row>

          {/* Address */}
          <Row isSmall={isSmall} label="Street Address">
            <View>
              <TextInput
                value={form.address}
                onChangeText={form.setAddress}
                placeholder="Street address"
                placeholderTextColor="#9E9E9E"
                className="bg-dark-100 text-light-100 px-4 py-3 rounded-lg border border-light-300/20"
              />
              <FieldError message={form.errors.address} />
            </View>
          </Row>

          {/* Terms */}
          <View>
            <Pressable
              onPress={() => form.setAgree(!form.agree)}
              className="flex-row items-center mt-2"
            >
              <View
                className={[
                  "w-5 h-5 rounded border",
                  form.agree ? "bg-accent border-accent" : "border-light-300/60",
                ].join(" ")}
              />
              <Text className="text-light-100 ml-3 text-sm">
                I agree to the{" "}
                <Text className="text-accent font-semibold" onPress={() => setShowTerms(true)}>
                  Terms and Conditions
                </Text>
              </Text>
            </Pressable>
            <FieldError message={form.errors.agree} />
          </View>

          {/* Confirm modal -> Save only when Confirm */}
          <BookingSuccessModal
            visible={successOpen}
            details={successDetails}
            saving={saving}
            onCancel={() => {
              if (saving) return;
              setSuccessOpen(false);
              setSuccessDetails(null);
            }}
            onConfirm={async () => {
              if (!successDetails) return;

              try {
                setSaving(true);

                // convert chosen HH:MM -> minutes
                const startMin = toMin(successDetails.slot);
                const durationMin = form.totalMinutes;
                const endMin = startMin + durationMin + BUFFER_MIN;

                await createBooking({
                  ...successDetails,
                  startTime: successDetails.slot,
                  startMin,
                  durationMin,
                  endMin,
                  totalMinutes: durationMin,
                });

                setSuccessOpen(false);
                setSuccessDetails(null);
                form.reset();
              } catch (err: any) {
                Alert.alert("Not available", err?.message || "Please choose another time.");
              } finally {
                setSaving(false);
              }
            }}
          />

          {/* Submit */}
          <View className="pt-2">
            <Pressable
              onPress={onSubmit}
              className="bg-accent rounded-xl py-4 items-center"
              style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
            >
              <Text className="text-secondary font-extrabold text-base">
                Book now
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <TermsModal
        visible={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={() => {
          form.setAgree(true);
          setShowTerms(false);
        }}
      />
    </Screen>
  );
}
