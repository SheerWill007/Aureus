// Custom Notification component
type NotificationType = {
  message: string;
  type: "error" | "success";
  onClose: () => void;
};

import { useEffect } from "react";

const Notification = ({ message, type, onClose }: NotificationType) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      className={`fixed right-4 top-4 z-[300] flex max-w-sm items-start gap-3 border bg-black px-4 py-3 font-mono text-[11px] text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,1)] ${
        type === "error" ? "border-red-500/70" : "border-kiwi/70"
      }`}
    >
      <span className={type === "error" ? "text-red-400" : "text-kiwi"}>{type === "error" ? "[ERR]" : "[OK]"}</span>
      <span className="leading-relaxed">{message}</span>
    </div>
  );
};

export default Notification;
