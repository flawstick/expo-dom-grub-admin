import React from "react";
import { ScrollView } from "react-native";
import Restaurant from "@/components/restaurant";
import { router } from "expo-router";

export default function Profile() {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      bounces={false}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}
    >
      <Restaurant navigate={router.navigate} />
    </ScrollView>
  );
}
