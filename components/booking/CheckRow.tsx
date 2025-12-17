import React from "react";
import { Pressable, View, Text } from "react-native";

export default function CheckRow({
  checked,
  label,
  onPress,
}: {
  checked: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-2">
      <View
        className={[
          "w-5 h-5 rounded border",
          checked ? "bg-accent border-accent" : "border-light-300/60",
        ].join(" ")}
      />
      <Text className="text-light-100 ml-3 text-sm">{label}</Text>
    </Pressable>
  );
}
