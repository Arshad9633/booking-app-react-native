import React, { useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Screen from "@/components/Screen";

type ServiceItem = {
  id: string;
  bookingKey:
    | "HAIRCUT"
    | "BEARD_TRIMMING"
    | "HAIR_DYE"
    | "SHAVING"
    | "BLACK_MASK"
    | "LADIES_HAIRCUT"
    | "FACIAL"
    | "STRAIGHTENING"
    | "LADIES_THREADING"
    | "THREADING"
    | "HEAD_OIL_MASSAGE";
  name: string;
  price: number;
  minutes: number;
  category: "Hair" | "Beard" | "Skin" | "Ladies" | "Other";
};


const SERVICES: ServiceItem[] = [
  { id: "haircut", bookingKey: "HAIRCUT", name: "Haircut", price: 12, minutes: 30, category: "Hair" },
  { id: "hair-dye", bookingKey: "HAIR_DYE", name: "Hair Dye", price: 25, minutes: 45, category: "Hair" },
  { id: "straightening", bookingKey: "STRAIGHTENING", name: "Straightening", price: 35, minutes: 60, category: "Hair" },

  { id: "beard-trim", bookingKey: "BEARD_TRIMMING", name: "Beard Trimming", price: 8, minutes: 15, category: "Beard" },
  { id: "shaving", bookingKey: "SHAVING", name: "Shaving", price: 7, minutes: 15, category: "Beard" },

  { id: "facial", bookingKey: "FACIAL", name: "Facial", price: 18, minutes: 30, category: "Skin" },
  { id: "black-mask", bookingKey: "BLACK_MASK", name: "Black Mask", price: 10, minutes: 20, category: "Skin" },

  { id: "ladies-haircut", bookingKey: "LADIES_HAIRCUT", name: "Ladies Haircut", price: 20, minutes: 45, category: "Ladies" },
  { id: "ladies-threading", bookingKey: "LADIES_THREADING", name: "Ladies Threading", price: 9, minutes: 20, category: "Ladies" },

  { id: "threading", bookingKey: "THREADING", name: "Threading", price: 6, minutes: 15, category: "Other" },
  { id: "head-oil", bookingKey: "HEAD_OIL_MASSAGE", name: "Head Oil Massage", price: 8, minutes: 20, category: "Other" },
];


const CATEGORIES: ServiceItem["category"][] = ["Hair", "Beard", "Skin", "Ladies", "Other"];

const Pill = ({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className={[
      "px-4 py-2 rounded-full border",
      active ? "bg-accent border-accent" : "bg-dark-100 border-light-300/20",
    ].join(" ")}
  >
    <Text className={active ? "text-secondary font-bold" : "text-light-100"}>
      {label}
    </Text>
  </Pressable>
);

const ServiceCard = ({
  item,
  onBook,
}: {
  item: ServiceItem;
  onBook: () => void;
}) => (
  <View className="bg-dark-100 border border-light-300/15 rounded-2xl p-4 mb-3">
    <View className="flex-row items-start justify-between">
      <View className="flex-1 pr-3">
        <Text className="text-light-100 text-base font-extrabold tracking-wide">
          {item.name}
        </Text>
        <Text className="text-light-300 text-sm mt-1">
          Approx. {item.minutes} min
        </Text>
      </View>

      <View className="items-end">
        <Text className="text-accent text-lg font-extrabold">€{item.price}</Text>
        <Text className="text-light-300 text-xs mt-1">{item.category}</Text>
      </View>
    </View>

    <Pressable
      onPress={onBook}
      className="mt-4 bg-accent rounded-xl py-3 items-center"
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
    >
      <Text className="text-secondary font-extrabold">Book now</Text>
    </Pressable>
  </View>
);

export default function Service() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ServiceItem["category"] | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return SERVICES.filter((s) => {
      const matchCategory = activeCategory === "All" ? true : s.category === activeCategory;
      const matchQuery = q ? s.name.toLowerCase().includes(q) : true;
      return matchCategory && matchQuery;
    });
  }, [query, activeCategory]);

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-3">
          <Text className="text-light-100 text-2xl font-extrabold tracking-widest">
            SERVICES
          </Text>
          <Text className="text-light-300 mt-2">
            Choose a service and book an appointment.
          </Text>
        </View>

        {/* Search */}
        <View className="px-5">
          <View className="bg-dark-100 border border-light-300/15 rounded-2xl px-4 py-3">
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search services..."
              placeholderTextColor="#9E9E9E"
              className="text-light-100"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Category pills */}
        <View className="px-5 mt-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              <Pill
                label="All"
                active={activeCategory === "All"}
                onPress={() => setActiveCategory("All")}
              />
              {CATEGORIES.map((c) => (
                <Pill
                  key={c}
                  label={c}
                  active={activeCategory === c}
                  onPress={() => setActiveCategory(c)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* List */}
        <View className="px-5 mt-5">
          {filtered.length === 0 ? (
            <View className="bg-dark-100 border border-light-300/15 rounded-2xl p-5">
              <Text className="text-light-100 font-bold">No results</Text>
              <Text className="text-light-300 mt-2">
                Try a different keyword or category.
              </Text>
            </View>
          ) : (
            filtered.map((item) => (
              <ServiceCard
                key={item.id}
                item={item}
               onBook={() =>
                router.push({
                  pathname: "/booking",
                  params: { service: item.bookingKey },
                })
               }
              />
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
