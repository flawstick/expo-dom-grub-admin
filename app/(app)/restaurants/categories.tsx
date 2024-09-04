import { View } from "react-native";
import { router } from "expo-router";
import FoodCategories from "@/components/categories";

export default function Restaurants() {
  return (
    <View style={{ flex: 1 }}>
      <FoodCategories navigate={router.navigate} />
    </View>
  );
}
