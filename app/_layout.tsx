import { Slot } from "expo-router";
import { Provider } from "@/components/providers";

export default function RootLayout() {
  return (
    <Provider>
      <Slot />
    </Provider>
  );
}
