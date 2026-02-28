import { useState, useEffect, useRef } from "react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    // Polling toutes les 30 secondes
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fermer si on clique en dehors
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:5002/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch { /* silently fail */ }
  };

  const loadUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:5002/api/notifications/unread-count", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUnreadCount(data.count || 0);
    } catch { /* silently fail */ }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5002/api/notifications/mark-all-read", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(0);
      setNotifications(n => n.map(notif => ({ ...notif, isRead: true })));
    } catch { /* silently fail */ }
  };

  const markRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5002/api/notifications/mark-read/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(n => n.map(notif => notif.id === id ? { ...notif, isRead: true } : notif));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch { /* silently fail */ }
  };

  const typeIcons: Record<string, string> = {
    appointment_accepted: "✅",
    appointment_rejected: "❌",
    account_approved: "🎉",
    account_rejected: "🚫",
    new_appointment: "📅",
    general: "🔔"
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) loadNotifications(); }}
        className="relative min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-[min(95vw,480px)] sm:w-[min(95vw,520px)] min-w-[320px] max-h-[85vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 z-50 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Tout marquer comme lu
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1 min-h-0 p-1">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-base">Aucune notification</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markRead(n.id)}
                  className={`px-4 py-4 rounded-lg mx-2 my-1 border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer transition-colors ${
                    n.isRead ? "bg-white dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900/20"
                  } hover:bg-gray-50 dark:hover:bg-gray-700/50`}
                >
                  <div className="flex gap-4">
                    <span className="text-2xl flex-shrink-0">{typeIcons[n.type] || "🔔"}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-base text-gray-900 dark:text-gray-100">{n.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed whitespace-pre-wrap">{n.message}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(n.created_at).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })} à {new Date(n.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    {!n.isRead && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
