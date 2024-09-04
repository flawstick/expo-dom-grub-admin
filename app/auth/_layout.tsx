import { useCompanyStore } from "@/lib/store/companyStore";
import { Stack, Slot } from "expo-router";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

export default function Tab1Layout() {
  if (process.env.EXPO_OS === "web") return <Slot />;
  const { setSearchTerm } = useCompanyStore();

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
      <Stack.Screen
        name="index"
        options={{
          title: "Select Company",
          headerSearchBarOptions: {
            placeholder: "חברה",
            textColor: "#000000",
            tintColor: "#FF8000",
            hintTextColor: "#000000",
            onChangeText: (
              text: NativeSyntheticEvent<TextInputChangeEventData>,
            ) => {
              setSearchTerm(text.nativeEvent.text);
            },
          },
        }}
      />
      <Stack.Screen
        name="login"
        // pick one
        options={{ title: "Login", headerBackTitle: "בחר חברה" }}
      />
    </Stack>
  );
}
