"use dom";

import React, { useState, useCallback, useEffect } from "react";
import "@/global.css";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { ScrollView, RefreshControl } from "react-native";
import { useCompanyStore } from "@/lib/store/companyStore";
import { StyleNoSelect } from "./NoSelect";

export default function CompanyList({
  handleSelection,
  searchTerm,
  companies,
}: {
  handleSelection: (company: any) => void;
  searchTerm: string;
  companies: any[];
}) {
  const { fetchCompanies } = useCompanyStore();
  const [refreshing, setRefreshing] = useState(false);

  // Refresh control
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCompanies();
    setRefreshing(false);
  }, [fetchCompanies]);

  const filteredItems = companies.filter((item) =>
    item.name.includes(searchTerm),
  );

  // Define Framer Motion variants for the list items
  const itemVariants = {
    hidden: { opacity: 0, y: 10 }, // Slightly offset with 10px vertical shift
    visible: { opacity: 1, y: 0 },
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: "white",
        direction: "rtl",
        marginTop: 150,
        padding: 8,
      }}
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => onRefresh()}
          colors={["#FF8000"]}
        />
      }
    >
      <StyleNoSelect />
      {filteredItems.map((item) => (
        <motion.li
          key={item.tenantId} // Using tenantId as the key
          className="flex items-center bg-white border border-gray-200 rounded-full p-3 shadow-md transition-all duration-100 ease-in-out active:bg-gray-100 cursor-pointer"
          onClick={() => {
            handleSelection(item);
          }}
          initial="hidden"
          animate="visible"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // Trigger animation when 10% of the item is in view
          variants={itemVariants}
          transition={{ duration: 0.25, ease: "easeOut" }} // Fast and smooth transition
        >
          <Avatar className="ml-6">
            <AvatarFallback>{/* Empty avatar */}</AvatarFallback>
          </Avatar>
          <span className="flex-grow text-right ml-3 font-medium">
            {item.name}
          </span>
        </motion.li>
      ))}
    </ScrollView>
  );
}
