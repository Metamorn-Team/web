"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  FiInfo,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import Alert from "@/utils/alert";

type AlertType = "info" | "warn" | "error" | "done";

export default function AlertProvider() {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<AlertType>("info");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    Alert.setCallback((msg: string, type: AlertType) => {
      setMessage(msg);
      setType(type);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setMessage(null);
        timeoutRef.current = null;
      }, 2500);
    });
  }, []);

  const getStyle = () => {
    switch (type) {
      case "info":
        return {
          bg: "bg-[#f9f5ec]",
          text: "text-[#5c4b32]",
          border: "border-[#d6c6aa]",
          Icon: FiInfo,
        };
      case "warn":
        return {
          bg: "bg-[#f0e68c]",
          text: "text-[#6b6b2d]",
          border: "border-[#d6ca6f]",
          Icon: FiAlertTriangle,
        };
      case "error":
        return {
          bg: "bg-[#f8d7da]",
          text: "text-[#721c24]",
          border: "border-[#f5c6cb]",
          Icon: FiXCircle,
        };
      case "done":
        return {
          bg: "bg-[#d4edda]",
          text: "text-[#155724]",
          border: "border-[#c3e6cb]",
          Icon: FiCheckCircle,
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-300",
          Icon: FiInfo,
        };
    }
  };

  const { bg, text, border, Icon } = getStyle();

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          className="fixed top-24 inset-x-0 flex justify-center z-50"
        >
          <div
            className={`${bg} ${text} border ${border} rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-xs mx-auto`}
          >
            <Icon size={18} />
            <span className="text-sm font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
