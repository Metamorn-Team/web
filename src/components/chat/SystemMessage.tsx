import React from "react";

const SystemMessage = ({ message }: { message: string }) => {
  return <div className="text-center text-xs text-[#2a1f14]">{message}</div>;
};

export default SystemMessage;
