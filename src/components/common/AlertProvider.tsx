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
import { renderMultilineMessage } from "@/game/utils/render-multilline-message";

type AlertType = "info" | "warn" | "error" | "done";

export default function AlertProvider() {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<AlertType>("info");
  const [iconVisible, setIconVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    Alert.setCallback(
      (msg: string, type: AlertType, iconVisible: boolean = true) => {
        setIconVisible(iconVisible);
        setMessage(msg);
        setType(type);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setMessage(null);
          timeoutRef.current = null;
        }, 2500);
      }
    );
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
          className="fixed top-24 inset-x-0 flex justify-center z-[99] pointer-events-none"
        >
          <div
            className={`${bg} ${text} border ${border} rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-lg mx-auto pointer-events-auto`}
          >
            {iconVisible ? <Icon size={18} /> : null}
            <span className="text-sm font-medium">
              {typeof message === "string"
                ? renderMultilineMessage(message)
                : message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
