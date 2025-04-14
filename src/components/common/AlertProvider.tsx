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
          bg: "bg-[#f3ece1]",
          text: "text-[#5c4b32]",
          border: "border-[#d6c6aa]",
          Icon: FiInfo,
        };
      case "warn":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-300",
          Icon: FiAlertTriangle,
        };
      case "error":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-300",
          Icon: FiXCircle,
        };
      case "done":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-300",
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
            className={`${bg} ${text} border ${border} rounded-full px-4 py-2 shadow-lg flex items-center gap-2`}
          >
            <Icon size={16} />
            <span className="text-sm">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
