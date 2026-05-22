import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";
import { Notification } from "../hooks/useNotifications";

interface NotificationContainerProps {
  notifications: Notification[];
}

export function NotificationContainer({ notifications }: NotificationContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} {...notification} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({ id, type, message }: Notification) {
  const icons = {
    success: <Check className="h-6 w-6 text-green-500" />,
    error: <AlertCircle className="h-6 w-6 text-red-500" />,
    info: <AlertCircle className="h-6 w-6 text-blue-500" />,
  };

  const colors = {
    success: "bg-green-100 dark:bg-green-800 border-green-500",
    error: "bg-red-100 dark:bg-red-800 border-red-500",
    info: "bg-blue-100 dark:bg-blue-800 border-blue-500",
  };

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center space-x-2 rounded-lg border-l-4 p-4 shadow-lg ${colors[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
}
