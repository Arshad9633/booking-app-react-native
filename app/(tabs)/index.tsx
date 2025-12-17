import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, Pressable, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import Screen from "@/components/Screen";
import { images } from "@/constants/images";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  Easing,
} from "react-native-reanimated";

export default function Index() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const logoSize = useMemo(() => {
    return Math.min(240, Math.max(130, Math.round(width * 0.55)));
  }, [width]);

  // Entrance animations
  const logoScale = useSharedValue(0.7);
  const logoOpacity = useSharedValue(0);
  const titleY = useSharedValue(18);
  const titleOpacity = useSharedValue(0);
  const subOpacity = useSharedValue(0);
  const buttonY = useSharedValue(16);
  const buttonOpacity = useSharedValue(0);

  // Button press animation
  const pressScale = useSharedValue(1);

  // Glow pulse
  const glowOpacity = useSharedValue(0.15);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    // small delay so layout feels smoother
    setReady(true);

    logoOpacity.value = withTiming(1, { duration: 450 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 140 });

    titleOpacity.value = withTiming(1, { duration: 450 });
    titleY.value = withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) });

    subOpacity.value = withTiming(1, { duration: 600 });

    buttonOpacity.value = withTiming(1, { duration: 500 });
    buttonY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });

    glowOpacity.value = withRepeat(
      withTiming(0.35, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const subStyle = useAnimatedStyle(() => ({
    opacity: subOpacity.value,
  }));

  const buttonWrapStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonY.value }],
  }));

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  if (!ready) return null;

  return (
    <Screen>
      <View className="flex-1 items-center justify-center px-6 pb-24">
        {/* Logo */}
        <Animated.View style={logoStyle}>
          <Image
            source={images.book_tour}
            resizeMode="contain"
            style={{ width: logoSize, height: logoSize }}
          />
        </Animated.View>

        {/* Title */}
        <Animated.Text
          style={titleStyle}
          className="mt-5 text-light-100 text-3xl font-extrabold tracking-widest text-center"
        >
          FOR LOVERS OF BEARDS
        </Animated.Text>

        {/* Subtitle */}
        <Animated.View style={subStyle} className="flex-row items-center mt-4">
          <View className="h-[1px] w-12 bg-accent/80" />
          <Text className="text-light-100/90 text-base mx-3 text-center">
            The Best Barber Shop since 2016
          </Text>
          <View className="h-[1px] w-12 bg-accent/80" />
        </Animated.View>

        {/* Button + glow */}
        <Animated.View style={buttonWrapStyle} className="mt-8 items-center">
          {/* Glow */}
          <Animated.View
            style={glowStyle}
            className="absolute w-48 h-14 rounded-2xl bg-accent"
          />

          <Animated.View style={pressStyle}>
            <Pressable
              onPress={() => router.push("/booking")}
              onPressIn={() => {
                pressScale.value = withSpring(0.97, { damping: 14, stiffness: 220 });
              }}
              onPressOut={() => {
                pressScale.value = withSpring(1, { damping: 14, stiffness: 220 });
              }}
              className="bg-accent px-10 py-4 rounded-2xl"
              style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1 })}
            >
              <Text className="text-secondary font-extrabold tracking-widest">
                BOOK A TOUR
              </Text>
            </Pressable>
          </Animated.View>

          <Text className="text-light-300 text-xs mt-4">
            Tap to book your appointment
          </Text>
        </Animated.View>
      </View>
    </Screen>
  );
}
