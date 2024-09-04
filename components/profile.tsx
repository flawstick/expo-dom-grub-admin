"use dom";

import "@/global.css";
import { ChevronLeft, CreditCard, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StyleNoSelect } from "./NoSelect";
import { useProfileStore } from "@/lib/store/profileStore";
import { useEffect } from "react";
import { useLoginStore } from "@/lib/store/loginStore";
import { useAuth } from "./providers/auth-provider";

// @ts-expect-error
const IS_DOM = typeof ReactNativeWebView !== "undefined";

interface ProfileScreenProps {
  navigate: (typeof import("expo-router").router)["navigate"];
  profile: any;
}

export default function ProfileScreen({ navigate }: ProfileScreenProps) {
  const profile = useProfileStore();
  const { user } = useAuth();

  const orders = [
    { id: "1", date: "01.06.2023", total: 50.99, status: "נמסר" },
    { id: "2", date: "15.06.2023", total: 75.5, status: "נשלח" },
    { id: "3", date: "30.06.2023", total: 120.25, status: "בעיבוד" },
  ];

  useEffect(() => {
    console.log(
      "Fetching orders and monthly payments",
      profile.currentMonthlyPayment,
    );
  }, [profile.currentMonthlyPayment]);

  const handlePreviousMonths = () => {
    navigate("/previous-months");
  };

  const handleLoadMore = () => {
    console.log("Loading more orders");
    // Add load more logic here
  };

  return (
    <div
      dir="rtl"
      className="w-full mx-auto bg-background min-h-screen font-sans pb-6"
    >
      <StyleNoSelect />
      <div className="relative">
        <img
          src={user?.bannerImage}
          alt="תמונת רקע של הפרופיל"
          className="w-full h-48 object-cover"
        />
        <Avatar className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 w-32 h-32 border-4 border-background">
          <AvatarImage
            src={user?.profilePicture}
            alt={`תמונת הפרופיל של ${user?.name}`}
          />
          <AvatarFallback>
            {user?.name
              .split(" ")
              .map((n: any) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="pt-20 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-6 h-6 ml-2 text-primary" />
              עלויות נוכחיות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              ₪
              {profile.currentMonthlyPayment
                ? profile.currentMonthlyPayment.totalPayment
                : 55}
            </p>
            <p className="text-sm text-muted-foreground">סכום לתשלום החודש</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="link"
              className="mr-auto p-0 h-auto text-primary hover:text-primary/80"
              onClick={handlePreviousMonths}
            >
              צפייה בחודשים קודמים
              <ChevronLeft className="w-4 h-4 mr-1" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-6 h-6 ml-2 text-primary" />
              הזמנות קודמות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="border-b border-border pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">הזמנה מס' {order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.date}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-primary">
                        ₪{order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.status}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleLoadMore}
            >
              טען עוד
              <ChevronLeft className="w-4 h-4 mr-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
