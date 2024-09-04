"use dom";

import "@/global.css";
import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus } from "lucide-react";
import { useRouter } from "expo-router";
import { StyleNoSelect } from "./NoSelect";

interface Order {
  size: string;
  doughType: string;
  toppings: string[];
  isSliced: boolean | null;
  quantity: number;
}

const SIZES = [
  { value: "S", label: "S", price: -10 },
  { value: "M", label: "M", price: 0 },
  { value: "L", label: "L", price: 15 },
  { value: "XL", label: "XL", price: 30 },
];

const DOUGH_TYPES = [
  { value: "regular", label: "רגיל" },
  { value: "thin", label: "דק" },
  { value: "thick", label: "עבה" },
];

const TOPPINGS = [
  { id: "extra-cheese", label: "תוספת גבינה", price: 5 },
  { id: "olives", label: "זיתים", price: 3 },
  { id: "peppers", label: "פלפלים", price: 3 },
];

export default function OrderScreen() {
  const [order, setOrder] = useState<Order>({
    size: "",
    doughType: "",
    toppings: [],
    isSliced: null,
    quantity: 1,
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const sizeRef = useRef<HTMLDivElement>(null);
  const doughTypeRef = useRef<HTMLDivElement>(null);
  const sliceRef = useRef<HTMLDivElement>(null);

  const basePrice = 82;
  const totalPrice =
    (SIZES.find((s) => s.value === order.size)?.price || 0) +
    TOPPINGS.filter((t) => order.toppings.includes(t.id)).reduce(
      (sum, t) => sum + t.price,
      0,
    ) +
    basePrice;

  const updateOrder = (key: keyof Order, value: any) => {
    setOrder((prev) => ({ ...prev, [key]: value }));
    setValidationErrors((prev) => prev.filter((error) => error !== key));
  };

  const handleQuantityChange = (delta: number) => {
    setOrder((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
  };

  const handleAddToCart = () => {
    const errors: string[] = [];
    if (!order.size) errors.push("size");
    if (!order.doughType) errors.push("doughType");
    if (order.isSliced === null) errors.push("isSliced");

    if (errors.length > 0) {
      setValidationErrors(errors);
      const firstErrorRef =
        errors[0] === "size"
          ? sizeRef
          : errors[0] === "doughType"
          ? doughTypeRef
          : sliceRef;
      firstErrorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      alert(
        `הזמנה נוספה: ${order.quantity} פיצות, מחיר כולל: ₪${(
          totalPrice * order.quantity
        ).toFixed(2)}`,
      );
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen w-screen pb-24 bg-white"
      dir="rtl"
    >
      <StyleNoSelect />
      <div className="w-full max-w-md mx-auto p-6">
        <article className="mb-6">
          <header className="flex justify-between items-start mb-4">
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">
                פטריות רומאיות
              </h1>
              <div className="flex items-center mt-1 justify-end">
                <span className="text-xl font-bold text-[#FF8000]">
                  ₪{basePrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through mr-2">
                  ₪92.00
                </span>
                <Badge
                  variant="secondary"
                  className="bg-[#FFF0E0] text-[#FF8000] mr-2"
                >
                  פופולרי
                </Badge>
              </div>
            </div>
          </header>
          <p className="text-sm text-gray-600 text-right">
            שמפיניון, מוצרלה, רוטב עגבניות ופרמזן
          </p>
        </article>
        <form className="space-y-6 p-2">
          <div
            ref={sizeRef}
            className={`transition-all duration-300 ${
              validationErrors.includes("size") ? "animate-shake" : ""
            }`}
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-900 text-right">
              בחר את הגודל שלך
            </h3>
            <RadioGroup
              value={order.size}
              onValueChange={(value) => updateOrder("size", value)}
              className="flex flex-col space-y-2"
            >
              {SIZES.map((sizeOption) => (
                <div
                  key={sizeOption.value}
                  className="flex items-center space-x-2"
                >
                  <Label
                    htmlFor={`size-${sizeOption.value}`}
                    className={`flex items-center justify-end space-x-2  w-full ${
                      validationErrors.includes("size") ? "border-red-500" : ""
                    }`}
                  >
                    <span className="text-xs text-gray-500">
                      {`${
                        sizeOption.price > 0
                          ? `(+₪${sizeOption.price})`
                          : sizeOption.price < 0
                          ? `(-₪${Math.abs(sizeOption.price)})`
                          : ""
                      }`}
                    </span>
                    <span className="text-sm font-semibold">
                      {sizeOption.label}
                    </span>
                  </Label>
                  <RadioGroupItem
                    value={sizeOption.value}
                    id={`size-${sizeOption.value}`}
                    className="w-5 h-5"
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
          <div
            ref={doughTypeRef}
            className={`transition-all duration-300 ${
              validationErrors.includes("doughType") ? "animate-shake" : ""
            }`}
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-900 text-right">
              סוג בצק
            </h3>
            <RadioGroup
              value={order.doughType}
              onValueChange={(value) => updateOrder("doughType", value)}
              className="flex flex-col space-y-2"
            >
              {DOUGH_TYPES.map((dough) => (
                <div key={dough.value} className="flex items-center space-x-2">
                  <Label
                    htmlFor={`dough-${dough.value}`}
                    className={`flex items-center justify-end w-full ${
                      validationErrors.includes("doughType")
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <span className="text-sm font-semibold">{dough.label}</span>
                  </Label>
                  <RadioGroupItem
                    value={dough.value}
                    id={`dough-${dough.value}`}
                    className="w-5 h-5"
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 text-right">
              תוספות
            </h3>
            <div className="space-y-2">
              {TOPPINGS.map((topping) => (
                <div
                  key={topping.id}
                  className="flex items-center space-x-reverse space-x-2"
                >
                  <Checkbox
                    id={topping.id}
                    checked={order.toppings.includes(topping.id)}
                    onCheckedChange={(checked) => {
                      const newToppings = checked
                        ? [...order.toppings, topping.id]
                        : order.toppings.filter((id) => id !== topping.id);
                      updateOrder("toppings", newToppings);
                    }}
                    className="border-[#FF8000] text-[#FF8000] hover:bg-[#FFF0E0] transition-colors duration-200 w-6 h-6"
                  />
                  <Label
                    htmlFor={topping.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {topping.label}{" "}
                    <span className="text-sm text-gray-500">
                      (₪{topping.price.toFixed(2)}+)
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div
            ref={sliceRef}
            className={`transition-all duration-300 ${
              validationErrors.includes("isSliced") ? "animate-shake" : ""
            }`}
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-900 text-right">
              לחתוך?
            </h3>
            <RadioGroup
              value={order.isSliced ? "slice" : "not-slice"}
              onValueChange={(value) =>
                updateOrder("isSliced", value === "slice")
              }
              className="flex flex-col space-y-2"
            >
              {[
                { value: "not-slice", label: "לא לחתוך" },
                { value: "slice", label: "לחתוך" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Label
                    htmlFor={`slice-${option.value}`}
                    className={`flex items-center justify-end w-full ${
                      validationErrors.includes("isSliced")
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <span className="text-sm font-semibold">
                      {option.label}
                    </span>
                  </Label>
                  <RadioGroupItem
                    value={option.value}
                    id={`slice-${option.value}`}
                    className="w-5 h-5"
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
        </form>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="w-full max-w-md mx-auto flex items-center justify-between space-x-4 space-x-reverse relative z-10 rounded-lg p-4">
          <div className="flex items-center justify-center border border-gray-300 rounded-md bg-white">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={order.quantity <= 1}
              className="text-[#FF8000] hover:text-[#E67300] hover:bg-[#FFF0E0]"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 text-lg font-semibold">
              {order.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(1)}
              className="text-[#FF8000] hover:text-[#E67300] hover:bg-[#FFF0E0]"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            className="bg-[#FF8000] hover:bg-[#E67300] text-white flex-1 py-6 text-lg font-semibold"
            onClick={handleAddToCart}
          >
            הוסף להזמנה ₪{(totalPrice * order.quantity).toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}
