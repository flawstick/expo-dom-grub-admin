import React, { useEffect } from "react";
import { View } from "react-native";
import Login from "@/components/login";
import { router } from "expo-router";
import { useAuth } from "@/components/providers/auth-provider";
import { useCompanyStore } from "@/lib/store/companyStore";

export default function LoginScreen() {
  const auth = useAuth();
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    if (auth.user) router.navigate("/");
  }, [auth.user]);

  return (
    <View style={{ flex: 1 }}>
      <Login
        login={auth.login}
        auth={auth}
        navigate={router.navigate}
        selectedCompany={selectedCompany}
      />
    </View>
  );
}
