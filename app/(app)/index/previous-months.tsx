import { View } from "react-native";
import AllPayouts from "@/components/all-payouts";
import { useProfileStore } from "@/lib/store/profileStore";

export default function Restaurants() {
    const profile = useProfileStore();

  return (
    <View style={{ flex: 1 }}>
      <AllPayouts profile={profile} />
    </View>
  );
}

