"use client";

import { useEffect } from "react";
import { setDeviceId } from "@/utils/device-id";

export default function SessionIdInitializer() {
  useEffect(() => {
    setDeviceId();
  }, []);

  return null;
}
