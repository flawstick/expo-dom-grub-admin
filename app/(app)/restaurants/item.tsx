"use dom";

import React, { useEffect } from "react";
import Image from "next/image";
import Item from "@/components/item";
import { motion, useAnimation } from "framer-motion";

export default function AddItemScreen() {
  const controls = useAnimation();

  // Define animation variants
  const headerVariants = {
    hidden: { y: -100 }, // Header is hidden above the viewport
    visible: { y: 0 }, // Header is visible at the top of the viewport
  };

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      controls.start("visible"); // Trigger the 'visible' variant
    } else {
      controls.start("hidden"); // Trigger the 'hidden' variant
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [controls]);

  return (
    <>
      <motion.div
        className="fixed w-full bg-white p-4 text-center"
        initial="hidden" // Start with the header hidden
        animate={controls} // Control the animation with useAnimation
        variants={headerVariants} // Apply the defined variants
        transition={{ type: "tween" }} // Spring animation
        style={{ zIndex: 1000 }}
      >
        <h1 className="text-lg font-semibold leading-none tracking-tight ">
          Add Item
        </h1>
        <p className="text-sm text-muted-foreground ">Add item to your cart</p>
      </motion.div>
      <div
        className="flex flex-col items-center justify-center"
        style={{ position: "relative", flex: 1 }}
      >
        <Image
          src="/placeholder.svg"
          alt="food"
          width={100}
          height={200}
          style={{ width: "100%" }}
        />
        <div className="absolute top-3 h-2 w-[75px] bg-gray-400 rounded-full self-center" />
        <Item />
      </div>
    </>
  );
}
