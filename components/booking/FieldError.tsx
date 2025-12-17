import React from "react";
import { Text } from "react-native";

export default function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Text className="text-red-400 text-xs mt-1">{message}</Text>;
}
