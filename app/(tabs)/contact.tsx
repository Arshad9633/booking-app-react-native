import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Screen from "@/components/Screen";

const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const onlyDigits = (v: string) => v.replace(/\D/g, "");

type Errors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <Text className="text-red-400 text-xs mt-1">{message}</Text>;
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-light-200 text-sm mb-2">{children}</Text>
);

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);

  const canSend = useMemo(() => {
    return (
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      phone.trim().length > 0 &&
      message.trim().length > 0 &&
      isValidEmail(email)
    );
  }, [name, email, phone, message]);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setErrors({});
  };

  const validate = () => {
    const e: Errors = {};

    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Enter a valid email";

    if (!phone.trim()) e.phone = "Phone number is required";
    else if (phone.trim().length < 7) e.phone = "Phone number is too short";

    if (!message.trim()) e.message = "Message is required";
    else if (message.trim().length < 10) e.message = "Write a bit more (min 10 chars)";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSend = async () => {
    if (!validate()) return;

    try {
      setSending(true);

      // ✅ For now, just show success.
      // Next step: save to Firestore collection "messages" or send email via backend.
      Alert.alert(
        "Message sent ✅",
        "Thanks! We will contact you soon.",
        [{ text: "OK", onPress: reset }]
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={28}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-3">
          <Text className="text-light-100 text-2xl font-extrabold tracking-widest">
            CONTACT US
          </Text>
          <Text className="text-light-300 mt-2">
            Send us a message and we’ll get back to you.
          </Text>
        </View>

        {/* Contact info card */}
        <View className="px-5 mt-3">
          <View className="bg-dark-100 border border-light-300/15 rounded-2xl p-4">
            <Text className="text-light-100 font-bold">Barber Shop</Text>

            <View className="mt-3 gap-2">
              <Text className="text-light-200">
                <Text className="text-light-100 font-semibold">Phone: </Text>
                +43 000 000 000
              </Text>
              <Text className="text-light-200">
                <Text className="text-light-100 font-semibold">Email: </Text>
                info@barbershop.com
              </Text>
              <Text className="text-light-200">
                <Text className="text-light-100 font-semibold">Address: </Text>
                Vienna, Austria
              </Text>
              <Text className="text-light-200">
                <Text className="text-light-100 font-semibold">Hours: </Text>
                Mon–Sat, 10:00–20:00
              </Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View className="px-5 mt-5 gap-4">
          <View>
            <Label>Your Name</Label>
            <TextInput
              value={name}
              onChangeText={(v) => {
                setName(v);
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
              }}
              placeholder="Full name"
              placeholderTextColor="#9E9E9E"
              className="bg-dark-100 text-light-100 px-4 py-3 rounded-xl border border-light-300/20"
            />
            <FieldError message={errors.name} />
          </View>

          <View>
            <Label>Email</Label>
            <TextInput
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
              }}
              placeholder="Email address"
              placeholderTextColor="#9E9E9E"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-dark-100 text-light-100 px-4 py-3 rounded-xl border border-light-300/20"
            />
            <FieldError message={errors.email} />
          </View>

          <View>
            <Label>Phone</Label>
            <TextInput
              value={phone}
              onChangeText={(v) => {
                setPhone(onlyDigits(v));
                if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
              }}
              placeholder="Phone number"
              placeholderTextColor="#9E9E9E"
              keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
              className="bg-dark-100 text-light-100 px-4 py-3 rounded-xl border border-light-300/20"
            />
            <FieldError message={errors.phone} />
          </View>

          <View>
            <Label>Message</Label>
            <TextInput
              value={message}
              onChangeText={(v) => {
                setMessage(v);
                if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
              }}
              placeholder="Write your message..."
              placeholderTextColor="#9E9E9E"
              multiline
              textAlignVertical="top"
              className="bg-dark-100 text-light-100 px-4 py-3 rounded-xl border border-light-300/20"
              style={{ minHeight: 140 }}
            />
            <FieldError message={errors.message} />
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={reset}
              className="flex-1 bg-dark-100 border border-light-300/20 rounded-xl py-4 items-center"
              style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
            >
              <Text className="text-light-100 font-bold">Clear</Text>
            </Pressable>

            <Pressable
              onPress={onSend}
              disabled={!canSend || sending}
              className={[
                "flex-1 rounded-xl py-4 items-center",
                !canSend || sending ? "bg-accent/40" : "bg-accent",
              ].join(" ")}
              style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
            >
              <Text className="text-secondary font-extrabold">
                {sending ? "Sending..." : "Send Message"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
