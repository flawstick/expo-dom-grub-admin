"use dom";

import "@/global.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Fingerprint,
  ChevronLeft,
  ChevronsRight,
  ChevronDown,
  LoaderCircle,
} from "lucide-react";
import { Link } from "expo-router";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useCompanyStore } from "@/lib/store/companyStore";
import { useAuth } from "@/components/providers/auth-provider";
import { StyleNoSelect } from "./NoSelect";

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
              e.preventDefault();
              navigate(props.href);
            }
          : undefined
      }
    />
  );
}

interface LoginProps {
  navigate: (typeof import("expo-router").router)["navigate"];
  auth: ReturnType<typeof useAuth>;
  login: ReturnType<typeof useAuth>["login"];
  selectedCompany: ReturnType<typeof useCompanyStore>["selectedCompany"];
}

export default function Login({
  navigate,
  auth,
  login,
  selectedCompany,
}: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password, selectedCompany?.tenantId ?? "");
  };

  const handleBiometricLogin = () => {
    console.log("Biometric login attempted");
  };

  const shakeAnimation = {
    initial: { x: 0 },
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 },
    },
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full max-w-md mx-auto bg-background flex flex-col p-6"
    >
      <StyleNoSelect />
      <Button
        variant="link"
        className="self-start mb-12 hover:bg-transparent p-0 h-auto text-foreground"
        onClick={() => navigate("/auth")}
      >
        <ChevronsRight className="ml-0.5 h-6 w-6 text-primary" />
        <Avatar className="ml-2 bg-gray-300">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
        </Avatar>
        <span className="font-semibold text-lg">{selectedCompany?.name}</span>
      </Button>

      <h1 className="text-3xl font-bold mb-8 text-right">ברוך הבא</h1>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-right block text-lg">
            שם משתמש
          </Label>
          <motion.div
            initial="initial"
            animate={
              auth.error?.wrongCredential === "username" ? "animate" : ""
            }
            variants={shakeAnimation}
          >
            <Input
              id="username"
              type="text"
              placeholder="הזן שם משתמש"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full py-3 px-2 border-t-0 border-r-0 border-l-0 border-b-2 bg-transparent focus:border-primary focus:ring-0 transition-colors duration-200 text-lg rounded-none shadow-none focus-visible:ring-0 ${
                auth.error?.wrongCredential === "username"
                  ? "border-red-600"
                  : "border-input"
              }`}
            />
            {auth.error?.wrongCredential === "username" && (
              <p className="text-red-600 text-sm mt-1">שם המשתמש שגוי</p>
            )}
          </motion.div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-right block text-lg">
            סיסמה
          </Label>
          <motion.div
            initial="initial"
            animate={
              auth.error?.wrongCredential === "password" ? "animate" : ""
            }
            variants={shakeAnimation}
          >
            <Input
              id="password"
              type="password"
              placeholder="הזן סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full py-3 px-2  border-t-0 border-r-0 border-l-0 border-b-2 bg-transparent focus:border-primary focus:ring-0 transition-colors duration-200 text-lg rounded-none focus-visible:ring-0 shadow-none ${
                auth.error?.wrongCredential === "password"
                  ? "border-red-600"
                  : "border-input"
              }`}
            />
            {auth.error?.wrongCredential === "password" && (
              <p className="text-red-600 text-sm mt-1">הסיסמה שגויה</p>
            )}
          </motion.div>
        </div>

        {auth.error?.message && (
          <motion.p
            initial="initial"
            animate="animate"
            variants={shakeAnimation}
            className="text-red-600 text-sm text-center mt-2"
          >
            {auth.error?.message}
          </motion.p>
        )}

        <Button
          type="submit"
          className={`w-full py-6 text-lg font-semibold rounded-full`}
          disabled={auth.loading}
        >
          {auth.loading ? (
            <motion.div
              initial={{ scale: 1 }}
              animate={{
                rotate: auth.loading ? 360 : 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                repeat: auth.loading ? Infinity : 0,
              }}
            >
              <div className="flex justify-center items-center">
                <LoaderCircle className="h-6 w-6 animate-spin" />
              </div>
            </motion.div>
          ) : auth.error ? (
            "נסה שוב"
          ) : (
            "התחבר"
          )}
        </Button>

        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="ghost"
            className="p-2 h-auto hover:bg-transparent hover:text-primary"
            onClick={handleBiometricLogin}
          >
            <Fingerprint className="ml-2 h-6 w-6 text-primary" />
            התחברות ביומטרית
          </Button>
          <Button variant="link" className="p-0 h-auto text-foreground">
            שכחת סיסמה?
            <ChevronLeft className="mr-0.5 h-5 w-5 text-primary" />
          </Button>
        </div>
      </form>
    </div>
  );
}
