import { View } from "react-native";
import { router } from "expo-router";
import RestaurantList from "@/components/restaurants";

export default function Restaurants() {
  return (
    <View style={{ flex: 1 }}>
      <RestaurantList navigate={router.navigate} />
    </View>
  );
}
