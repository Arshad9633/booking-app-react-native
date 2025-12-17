import React from "react";
import { View } from "react-native";
import LabelPill from "./LabelPill";

export default function Row({
  isSmall,
  label,
  children,
}: {
  isSmall: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (isSmall) {
    return (
      <View className="gap-2">
        <LabelPill text={label} />
        {children}
      </View>
    );
  }

  return (
    <View className="flex-row gap-3 items-start">
      <View className="w-40">
        <LabelPill text={label} />
      </View>
      <View className="flex-1">{children}</View>
    </View>
  );
}
