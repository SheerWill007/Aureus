import { motion, AnimatePresence } from "framer-motion";
import { Notification } from "../hooks/useNotifications";

interface NotificationContainerProps {
  notifications: Notification[];
}

export function NotificationContainer({ notifications }: NotificationContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2" role="status" aria-live="polite">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} {...notification} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({ id, type, message }: Notification) {
  const tags = {
    success: { label: "[OK]", text: "text-kiwi", border: "border-kiwi/70" },
    error: { label: "[ERR]", text: "text-red-400", border: "border-red-500/70" },
    info: { label: "[i]", text: "text-white/70", border: "border-white/40" },
  };
  const t = tags[type];

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30, transition: { duration: 0.15 } }}
      className={`flex max-w-sm items-start gap-3 border bg-black px-4 py-3 font-mono text-[11px] text-white ${t.border}`}
    >
      <span className={t.text}>{t.label}</span>
      <span className="leading-relaxed">{message}</span>
    </motion.div>
  );
}
