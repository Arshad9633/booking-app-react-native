import React from "react";
import { Modal, View, Text, Pressable } from "react-native";

export default function TermsModal({
  visible,
  onClose,
  onAccept,
}: {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/70 items-center justify-center px-6">
        <View className="bg-dark-100 w-full rounded-2xl p-5 border border-light-300/20">
          <Text className="text-light-100 text-lg font-bold mb-3">
            Terms & Conditions
          </Text>

          <Text className="text-light-200 text-sm leading-5">
            • Arrive 5 minutes early.{"\n"}
            • Late arrivals may be rescheduled.{"\n"}
            • Cancel at least 24 hours in advance.{"\n"}
            • Payment is due after service completion.{"\n"}
            • By booking, you consent to be contacted about your appointment.
          </Text>

          <View className="flex-row gap-3 mt-5">
            <Pressable onPress={onClose} className="flex-1 border border-light-300/30 rounded-xl py-3 items-center">
              <Text className="text-light-100 font-semibold">Close</Text>
            </Pressable>

            <Pressable onPress={onAccept} className="flex-1 bg-accent rounded-xl py-3 items-center">
              <Text className="text-secondary font-bold">Accept</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
