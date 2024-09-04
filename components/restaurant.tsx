"use dom";

import "@/global.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";

interface ProfileScreenProps {
  navigate: (typeof import("expo-router").router)["navigate"];
}

export default function MenuScreen({ navigate }: ProfileScreenProps) {
  const categories = [
    "פופולרי",
    "ארוחת בוקר",
    "צהריים",
    "ערב",
    "קינוחים",
    "משקאות",
  ];
  const [activeCategory, setActiveCategory] = useState("פופולרי");
  const categoryRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current || isScrolling) return;

    const scrollPosition = scrollAreaRef.current.scrollTop;
    const viewportHeight = scrollAreaRef.current.clientHeight;
    let newActiveCategory = categories[0];

    for (let i = categories.length - 1; i >= 0; i--) {
      const category = categories[i];
      const element = menuRefs.current[category];
      if (element && element.offsetTop <= scrollPosition + viewportHeight / 2) {
        newActiveCategory = category;
        break;
      }
    }

    if (newActiveCategory !== activeCategory) {
      setActiveCategory(newActiveCategory);
      categoryRefs.current[newActiveCategory]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [categories, activeCategory, isScrolling]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener("scroll", handleScroll);
      return () => scrollArea.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const scrollToCategory = (category: string) => {
    setIsScrolling(true);
    setActiveCategory(category);
    menuRefs.current[category]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setTimeout(() => setIsScrolling(false), 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-white w-screen" dir="rtl">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full whitespace-nowrap overflow-x-auto">
          <div className="flex p-2" dir="rtl">
            {categories.map((category, index) => (
              <button
                key={category}
                ref={(el) => (categoryRefs.current[category] = el)}
                onClick={() => scrollToCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ml-2 category-button ${
                  activeCategory === category
                    ? "bg-[#FF8000] text-white active-category"
                    : "text-gray-600 hover:bg-gray-100"
                } ${index === categories.length - 1 ? "ml-4" : ""}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className="flex-grow overflow-y-auto" ref={scrollAreaRef}>
        <div className="p-4 space-y-8">
          {categories.map((category) => (
            <div key={category} ref={(el) => (menuRefs.current[category] = el)}>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {category}
              </h2>
              {menuItems[category].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                  onClick={() => navigate("/restaurants/item")}
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      {item.isNew && (
                        <Badge
                          variant="secondary"
                          className="mr-2 bg-green-100 text-green-800"
                        >
                          חדש
                        </Badge>
                      )}
                      {item.isPopular && (
                        <Badge
                          variant="secondary"
                          className="mr-2 bg-red-100 text-red-800"
                        >
                          פופולרי
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-[#FF8000] mt-1 font-medium">
                      ₪{item.price.toFixed(2)}
                    </p>
                  </div>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-md mr-4 object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const menuItems: { [key: string]: any[] } = {
  פופולרי: [
    {
      name: "בורגר חתימה",
      description: "בשר אנגוס, גבינת צ'דר, בייקון, חסה, עגבנייה, רוטב מיוחד",
      price: 44.99,
      image: "/placeholder.svg?height=80&width=80",
      isPopular: true,
    },
    {
      name: "טוסט אבוקדו",
      description: "לחם מחמצת, אבוקדו מעוך, ביצי עין, פתיתי צ'ילי",
      price: 34.99,
      image: "/placeholder.svg?height=80&width=80",
      isNew: true,
    },
    {
      name: "סלט קיסר עוף",
      description: "חזה עוף צלוי, חסה רומאית, פרמזן, קרוטונים, רוטב קיסר",
      price: 39.99,
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
  "ארוחת בוקר": [
    {
      name: "פנקייק קלאסי",
      description: "פנקייקים תפוחים מוגשים עם סירופ מייפל וחמאה",
      price: 29.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "חביתה צמחונית",
      description: "חביתה משלוש ביצים עם פלפלים, בצל, עגבניות וגבינה",
      price: 34.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "בוריטו בוקר",
      description:
        "ביצים מקושקשות, בייקון, גבינה ותפוחי אדמה עטופים בטורטייה גדולה",
      price: 39.99,
      image: "/placeholder.svg?height=80&width=80",
      isPopular: true,
    },
  ],
  צהריים: [
    {
      name: "כריך עוף בגריל",
      description: "חזה עוף בגריל, אבוקדו, בייקון, חסה, עגבנייה, מיונז",
      price: 39.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "טורטייה צמחונית",
      description:
        "חומוס, ירקות מעורבים, מלפפון, עגבנייה, גבינת פטה בטורטיית תרד",
      price: 34.99,
      image: "/placeholder.svg?height=80&width=80",
      isNew: true,
    },
    {
      name: "קערת קינואה",
      description: "קינואה, ירקות צלויים, חומוס, רוטב טחינה",
      price: 39.99,
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
  ערב: [
    {
      name: "סלמון בגריל",
      description: "סלמון אטלנטי, רוטב חמאת לימון, אספרגוס, אורז בר",
      price: 69.99,
      image: "/placeholder.svg?height=80&width=80",
      isPopular: true,
    },
    {
      name: "מוקפץ ירקות",
      description: "ירקות מעורבים, טופו, אורז מלא, רוטב טריאקי",
      price: 49.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "סטייק פילה",
      description: "סטייק סרלוין 8oz, חמאת עשבים, צ'יפס, סלט בצד",
      price: 79.99,
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
  קינוחים: [
    {
      name: "עוגת שוקולד לוהטת",
      description: "עוגת שוקולד חמה עם מרכז נוזלי, גלידת וניל",
      price: 29.99,
      image: "/placeholder.svg?height=80&width=80",
      isPopular: true,
    },
    {
      name: "עוגת גבינה ניו יורקית",
      description: "עוגת גבינה קלאסית עם בסיס פתי בר, רוטב פירות יער",
      price: 26.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "טירמיסו",
      description: "קינוח איטלקי בטעם קפה עם גבינת מסקרפונה",
      price: 29.99,
      image: "/placeholder.svg?height=80&width=80",
      isNew: true,
    },
  ],
  משקאות: [
    {
      name: "שייק פירות טריים",
      description: "תערובת של פירות עונתיים, יוגורט ודבש",
      price: 19.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "מקיאטו קרמל קר",
      description: "אספרסו, חלב, סירופ וניל, קרמל",
      price: 14.99,
      image: "/placeholder.svg?height=80&width=80",
      isPopular: true,
    },
    {
      name: "מיץ ניקוי ירוק",
      description: "קייל, מלפפון, תפוח ירוק, לימון, ג'ינג'ר",
      price: 24.99,
      image: "/placeholder.svg?height=80&width=80",
      isNew: true,
    },
  ],
};
