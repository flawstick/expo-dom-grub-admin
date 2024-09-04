import { Stack, Slot } from "expo-router";

export default function Tab1Layout() {
  if (process.env.EXPO_OS === "web") return <Slot />;

  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTintColor: "#FF8000", // Adjust the text color if needed
        contentStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0.5,
          borderTopColor: "#E5E7EB",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Profile" }} />
      <Stack.Screen
        name="previous-months"
        options={{
          title: "היסטוריית תשלומים"
        }}
        />
    </Stack>
  );
}

