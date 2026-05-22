import { useState, useCallback } from "react";

export interface Notification {
  id: number;
  type: "success" | "error" | "info";
  message: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (type: "success" | "error" | "info", message: string) => {
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, type, message }]);
      
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== id)
        );
      }, 5000);
    },
    []
  );

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  return { notifications, addNotification, removeNotification };
}
