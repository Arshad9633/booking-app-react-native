import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

type Props = {
  slots: string[];          // e.g. ["08:00 - 08:52", ...]
  value: string;            // selected slot
  onChange: (slot: string) => void;
  maxHeight?: number;       // keeps the box neat
};

export default function TimeSlotsBox({
  slots,
  value,
  onChange,
  maxHeight = 260,
}: Props) {
  return (
    <View className="bg-dark-100 rounded-lg border border-light-300/20 overflow-hidden">
      <ScrollView
        style={{ maxHeight }}
        contentContainerStyle={{ paddingVertical: 6 }}
        showsVerticalScrollIndicator={true}
      >
        {slots.map((slot, idx) => {
          const selected = value === slot;

          return (
            <Pressable
              key={slot}
              onPress={() => onChange(slot)}
              className={[
                "flex-row items-center px-4 py-3",
                selected ? "bg-accent/15" : "",
              ].join(" ")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.85 : 1,
              })}
            >
              {/* checkbox */}
              <View
                className={[
                  "w-5 h-5 rounded border mr-3 items-center justify-center",
                  selected ? "bg-accent border-accent" : "border-light-300/60",
                ].join(" ")}
              >
                {selected ? (
                  <View className="w-2.5 h-2.5 rounded-sm bg-secondary" />
                ) : null}
              </View>

              {/* time text (monospace keeps alignment clean) */}
              <Text
                className={[
                  "text-sm",
                  selected ? "text-light-100 font-semibold" : "text-light-200",
                ].join(" ")}
                style={{ fontVariant: ["tabular-nums"] as any }}
              >
                {slot}
              </Text>

              {/* row divider */}
              {idx !== slots.length - 1 ? (
                <View className="absolute left-4 right-4 bottom-0 h-[1px] bg-light-300/10" />
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
