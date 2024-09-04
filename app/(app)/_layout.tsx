import { useAuth } from "@/components/providers/auth-provider";
import { Slot, Tabs, Redirect } from "expo-router";

export default function RootLayout() {
  if (process.env.EXPO_OS === "web") return <Slot />;

  const { user, isLoggedIn } = useAuth();
  if (!user && !isLoggedIn)  return <Redirect href="/auth" />;

  return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0.5,
            borderTopColor: "#E5E7EB",
          },
          tabBarActiveTintColor: "#FF8000",
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Profile" }} />
        <Tabs.Screen name="restaurants" options={{ title: "Restaurants" }} />
      </Tabs>
  );
}
