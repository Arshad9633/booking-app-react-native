import React from "react";
import { Tabs } from "expo-router";
import {
  View,
  Text,
  Pressable,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

const routes = [
  { name: "index", label: "Home", icon: icons.home },
  { name: "booking", label: "Book", icon: icons.booking },
  { name: "service", label: "Service", icon: icons.service },
  { name: "contact", label: "Contact", icon: icons.contact },
] as const;

const ICON_SIZE = 24;

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 16,
        height: 74,
        backgroundColor: "#1E1E1E",
        borderRadius: 22,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: Platform.OS === "ios" ? 14 : 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {routes.map((r, i) => {
          const isFocused = state.index === i;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: state.routes[i].key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(r.name as never);
            }
          };

          return (
            <Pressable
              key={r.name}
              onPress={onPress}
              style={{
                flex: 1, // ✅ each tab gets equal width
                alignItems: "center",
                justifyContent: "center",
              }}
              hitSlop={10}
            >
              {!isFocused ? (
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={r.icon}
                    style={{
                      width: ICON_SIZE,
                      height: ICON_SIZE,
                      tintColor: "#9CA3AF",
                    }}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <ImageBackground
                  source={images.highlight}
                  resizeMode="stretch"
                  style={{
                    height: 46,
                    borderRadius: 23,
                    paddingHorizontal: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={r.icon}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: "#151312",
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      marginLeft: 8,
                      color: "#151312",
                      fontWeight: "700",
                      fontSize: 13,
                    }}
                    numberOfLines={1}
                  >
                    {r.label}
                  </Text>
                </ImageBackground>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />} // ✅ custom tab bar
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="booking" />
      <Tabs.Screen name="service" />
      <Tabs.Screen name="contact" />
    </Tabs>
  );
}
