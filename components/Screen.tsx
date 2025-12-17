import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";

type Props = {
  children: React.ReactNode;
};

export default function Screen({ children }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Wrap background and disable touches here */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <ImageBackground
          source={images.bg}
          resizeMode="cover"
          style={StyleSheet.absoluteFillObject}
        />
        {/* optional overlay */}
        <View style={styles.overlay} />
      </View>

      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#121212" },
  content: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
});
