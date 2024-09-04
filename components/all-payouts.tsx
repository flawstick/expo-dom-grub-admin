"use dom";

import "@/global.css";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const MAX_OFFSET = 50;
const INITIAL_ITEMS = 10;
const ITEMS_TO_LOAD = 5;

interface AllMonthlyPaymentsProps {
  profile: any;
}

export default function AllMonthlyPayments({
  profile,
}: AllMonthlyPaymentsProps) {
  const [visibleItems, setVisibleItems] = useState(INITIAL_ITEMS);
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);
  const maxPayment = Math.max(
    ...profile.monthlyPayments.map((data: any) => data.totalPayment),
  );

  const visibleData = profile.monthlyPayments.slice(0, visibleItems);

  useEffect(() => {
    const newItems = Array.from(
      { length: ITEMS_TO_LOAD },
      (_, i) => visibleItems - ITEMS_TO_LOAD + i,
    );
    const timer = setTimeout(() => {
      setAnimatedItems((prev) => [...prev, ...newItems]);
    }, 100);
    return () => clearTimeout(timer);
  }, [visibleItems]);

  const loadMore = async () => {
    await profile.fetchMonthlyPayments(visibleItems, ITEMS_TO_LOAD);
    setVisibleItems((prev) => prev + ITEMS_TO_LOAD);
  };

  const formatMonthAndYearToHebrew = (month: number, year: number) => {
    const monthNames = [
      "ינואר",
      "פברואר",
      "מרץ",
      "אפריל",
      "מאי",
      "יוני",
      "יולי",
      "אוגוסט",
      "ספטמבר",
      "אוקטובר",
      "נובמבר",
      "דצמבר",
    ];

    return `${monthNames[month - 2]} ${year}`;
  };

  return (
    <div className="min-h-screen w-full bg-background p-4 rtl" dir="rtl">
      <div className="space-y-4 mb-4">
        {visibleData.map((data: any, index: any) => (
          <Card
            key={index}
            className="payment-card relative overflow-hidden"
            id={index.toString()}
          >
            <CardContent className="p-6 pb-8 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-semibold text-primary">
                  {formatMonthAndYearToHebrew(data.month, data.year)}
                </p>
                <span className="text-sm text-muted-foreground">
                  {data.numberOfOrders} הזמנות
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-4xl font-bold text-primary">
                  ₪{data.totalPayment.toFixed(2)}
                </span>
              </div>
              <div className="absolute bottom-0 right-0 left-0 h-2 bg-primary/10 ">
                <div
                  className="absolute top-0 right-0 h-full bg-primary transition-all duration-1000 ease-out"
                  style={{
                    width: animatedItems.includes(index)
                      ? `${(data.totalPayment / maxPayment) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {visibleItems < MAX_OFFSET && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={loadMore}
            variant="outline"
            className="bg-background shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Plus className="h-4 w-4 ml-2" />
            טען עוד
          </Button>
        </div>
      )}
    </div>
  );
}
