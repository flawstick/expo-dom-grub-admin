import React from "react";
import { View } from "react-native";
import ProfileScreen from "@/components/profile";
import { router } from "expo-router";
import { useProfileStore } from "@/lib/store/profileStore";

export default function Profile() {
    const profile = useProfileStore();

    React.useEffect(() => {
        profile.fetchOrders();
        profile.fetchMonthlyPayments();
        profile.fetchCurrentMonthPayment();
    }, []);

  return (
    <View style={{ flex: 1 }}>
      <ProfileScreen navigate={router.navigate} profile={profile}/>
    </View>
  );
}
