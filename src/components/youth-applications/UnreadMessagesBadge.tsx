"use client";

import { Badge } from "@/components/ui/badge";
import { useUnreadMessagesCount } from "@/hooks/use-youth-applications";

interface UnreadMessagesBadgeProps {
  applicationId: string;
}

export default function UnreadMessagesBadge({
  applicationId,
}: UnreadMessagesBadgeProps) {
  const { data: unreadCount } = useUnreadMessagesCount(applicationId);

  if (!unreadCount || unreadCount === 0) {
    return null;
  }

  return (
    <Badge
      variant="destructive"
      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
    >
      {unreadCount > 9 ? "9+" : unreadCount}
    </Badge>
  );
}
