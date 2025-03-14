"use client";

import { Notification } from "@/types";

interface NotificationsProps {
  notifications: Notification[];
}

export default function Notifications({ notifications }: NotificationsProps) {
  return (
    <div className="mt-2">
      <h3 className="text-lg font-medium">Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No new notifications.</p>
      ) : (
        notifications.map((n, idx) => (
          <div key={idx} className="bg-gray-100 p-2 my-1 rounded text-sm">
            New video: <strong>{n.title}</strong> shared by{" "}
            <em>{n.sharedBy}</em>
          </div>
        ))
      )}
    </div>
  );
}
