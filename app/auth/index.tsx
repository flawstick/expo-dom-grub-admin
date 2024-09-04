import React, { useEffect } from "react";
import { View } from "react-native";
import CompanyList from "@/components/company-list";
import { router } from "expo-router";
import { useCompanyStore } from "@/lib/store/companyStore";

export default function CompanySelect() {
  const { fetchCompanies, setSelectedCompany, searchTerm, companies } =
    useCompanyStore();

  // just on init
  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSelection = (company: any) => {
    setSelectedCompany(company);
    router.navigate("/auth/login");
  };

  return (
    <View style={{ flex: 1 }}>
      <CompanyList
        handleSelection={handleSelection}
        searchTerm={searchTerm}
        companies={companies}
      />
    </View>
  );
}
