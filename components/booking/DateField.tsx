import React from "react";
import { View, Text, Pressable, Modal, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "@/hooks/useBookingForm";
import FieldError from "./FieldError";

export default function DateField({
  date,
  show,
  setShow,
  onChange,
  error,
}: {
  date: Date | null;
  show: boolean;
  setShow: (v: boolean) => void;
  onChange: (d: Date | null) => void;
  error?: string;
}) {
  return (
    <View>
      <Pressable
        onPress={() => setShow(true)}
        className="bg-dark-100 px-4 py-3 rounded-lg border border-light-300/20"
      >
        <Text className={date ? "text-light-100" : "text-light-300"}>
          {date ? formatDate(date) : "YYYY-MM-DD"}
        </Text>
      </Pressable>

      <FieldError message={error} />

      {show && Platform.OS === "android" && (
        <DateTimePicker
          value={date ?? new Date()}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShow(false);
            if (event.type === "set" && selectedDate) onChange(selectedDate);
          }}
        />
      )}

      <Modal visible={show && Platform.OS === "ios"} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-dark-100 rounded-t-2xl p-4 border-t border-light-300/20">
            <View className="flex-row justify-between items-center mb-3">
              <Pressable onPress={() => setShow(false)}>
                <Text className="text-light-200 font-semibold">Cancel</Text>
              </Pressable>

              <Text className="text-light-100 font-bold">Select Date</Text>

              <Pressable onPress={() => setShow(false)}>
                <Text className="text-accent font-bold">Done</Text>
              </Pressable>
            </View>

            <DateTimePicker
              value={date ?? new Date()}
              mode="date"
              display="spinner"
              onChange={(_, selectedDate) => {
                if (selectedDate) onChange(selectedDate);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
