import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";

type Details = {
  date: string;
  servicer: string;
  slot: string;
  services: string[];
  totalMinutes: number;
  name: string;
  phone: string;
  email: string;
  address: string;
};

type Props = {
  visible: boolean;
  details: Details | null;
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function BookingSuccessModal({
  visible,
  details,
  saving,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!saving) onCancel();
      }}
    >
      <View className="flex-1 bg-black/70 items-center justify-center px-6">
        <View className="bg-dark-100 w-full rounded-2xl p-5 border border-light-300/20">
          <Text className="text-light-100 text-lg font-bold mb-2">
            Confirm Booking
          </Text>

          {!details ? (
            <Text className="text-light-200 text-sm">No details.</Text>
          ) : (
            <View className="gap-2 mt-2">
              <Text className="text-light-200 text-sm">
                <Text className="text-light-100 font-semibold">Name: </Text>
                {details.name}
              </Text>

              <Text className="text-light-200 text-sm">
                <Text className="text-light-100 font-semibold">Date: </Text>
                {details.date}
              </Text>

              <Text className="text-light-200 text-sm">
                <Text className="text-light-100 font-semibold">Time: </Text>
                {details.slot}
              </Text>

              <Text className="text-light-200 text-sm">
                <Text className="text-light-100 font-semibold">Servicer: </Text>
                {details.servicer}
              </Text>

              <Text className="text-light-200 text-sm">
                <Text className="text-light-100 font-semibold">Services: </Text>
                {details.services.join(", ")}
              </Text>

              <Text className="text-light-200 text-sm">
                <Text className="text-light-100 font-semibold">Total: </Text>
                {details.totalMinutes} minutes
              </Text>

              <Text className="text-light-200 text-sm">
                <Text className="text-light-100 font-semibold">Phone: </Text>
                {details.phone}
              </Text>

              <Text className="text-light-200 text-sm">
                <Text className="text-light-100 font-semibold">Email: </Text>
                {details.email}
              </Text>

              <Text className="text-light-200 text-sm">
                <Text className="text-light-100 font-semibold">Address: </Text>
                {details.address}
              </Text>
            </View>
          )}

          <View className="flex-row gap-3 mt-5">
            <Pressable
              onPress={() => {
                if (saving) return;
                onCancel();
              }}
              disabled={saving}
              className="flex-1 border border-light-300/30 rounded-xl py-3 items-center"
              style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
            >
              <Text className="text-light-100 font-semibold">Cancel</Text>
            </Pressable>


            <Pressable
              onPress={onConfirm}
              disabled={saving || !details}
              className="flex-1 bg-accent rounded-xl py-3 items-center"
              style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
            >
              {saving ? (
                <ActivityIndicator />
              ) : (
                <Text className="text-secondary font-bold">Confirm</Text>
              )}
            </Pressable>
          </View>
          {saving && (
            <Text className="text-light-200 text-xs mt-3 text-center">
              Saving your booking...
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
