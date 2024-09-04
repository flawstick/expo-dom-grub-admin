"use dom";

import "@/global.css";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "expo-router";

const foodCategories = [
  {
    name: "אוכל רחוב",
    places: 281,
    image: "/placeholder.svg?height=200&width=200",
    link: "/street-food",
  },
  {
    name: "סלט",
    places: 200,
    image: "/placeholder.svg?height=200&width=200",
    link: "/salad",
  },
  {
    name: "כשר",
    places: 221,
    image: "/placeholder.svg?height=200&width=200",
    link: "/kosher",
  },
  {
    name: "המבורגר",
    places: 73,
    image: "/placeholder.svg?height=200&width=200",
    link: "/burger",
  },
  {
    name: "כריך",
    places: 173,
    image: "/placeholder.svg?height=200&width=200",
    link: "/sandwich",
  },
  {
    name: "אסייתי",
    places: 67,
    image: "/placeholder.svg?height=200&width=200",
    link: "/asian",
  },
  {
    name: "פיצה",
    places: 156,
    image: "/placeholder.svg?height=200&width=200",
    link: "/pizza",
  },
  {
    name: "סושי",
    places: 89,
    image: "/placeholder.svg?height=200&width=200",
    link: "/sushi",
  },
  {
    name: "מאפים",
    places: 112,
    image: "/placeholder.svg?height=200&width=200",
    link: "/pastries",
  },
  {
    name: "גלידה",
    places: 45,
    image: "/placeholder.svg?height=200&width=200",
    link: "/ice-cream",
  },
  {
    name: "מסעדה איטלקית",
    places: 78,
    image: "/placeholder.svg?height=200&width=200",
    link: "/italian",
  },
  {
    name: "טבעוני",
    places: 53,
    image: "/placeholder.svg?height=200&width=200",
    link: "/vegan",
  },
];

const MotionCard = motion(Card);

interface FoodCategoriesProps {
  navigate: any;
}

export default function FoodCategories({ navigate }: FoodCategoriesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // @ts-expect-error
  const IS_DOM = typeof ReactNativeWebView !== "undefined";

  function DOMLink({
    navigate,
    ...props
  }: {
    navigate: (typeof import("expo-router").router)["navigate"];
  } & import("expo-router").LinkProps<any>) {
    return (
      <Link
        {...props}
        onPress={
          IS_DOM
            ? (e) => {
                // NOTE: This is a workaround since Expo Router doesn't have DOM Components support yet.
                e.preventDefault();
                navigate(props.href);
              }
            : undefined
        }
      />
    );
  }

  return (
    <div
      className="bg-background text-foreground p-6 rtl"
      dir="rtl"
      lang="he"
      ref={containerRef}
    >
      <h1 className="text-4xl font-bold mb-8 text-right">אני מרגיש לאכול..</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {foodCategories.map((category, index) => (
          <DOMLink navigate={navigate} key={category.name} href="/restaurants">
            <MotionCard
              className="overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1, root: containerRef }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="w-full h-auto"
                  />
                  <div className="bottom-0 right-0 left-0 bg-background p-3">
                    <h2 className="text-lg font-semibold mb-1">
                      {category.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {category.places} מקומות
                    </p>
                  </div>
                </div>
              </CardContent>
            </MotionCard>
          </DOMLink>
        ))}
      </div>
    </div>
  );
}
