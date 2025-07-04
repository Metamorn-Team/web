"use client";

import { useEffect } from "react";
import { setSessionId } from "@/utils/session-id";

export default function SessionIdInitializer() {
  useEffect(() => {
    setSessionId();
  }, []);

  return null;
}
