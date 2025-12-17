import React from "react";
import { View, Text } from "react-native";

export default function LabelPill({ text }: { text: string }) {
  return (
    <View className="bg-accent rounded-lg px-3 py-2">
      <Text className="text-secondary font-semibold text-sm">{text}</Text>
    </View>
  );
}
