import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Share2, 
  Check, 
  CheckCheck, 
  Trash2 
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "share";
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  blogId?: string;
  blogTitle?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    user: {
      id: "2",
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    blogId: "1",
    blogTitle: "The Future of AI in Web Development",
    message: "liked your blog post",
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    type: "comment",
    user: {
      id: "3",
      name: "Emma Williams",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    blogId: "2",
    blogTitle: "Designing for Accessibility",
    message: "commented on your blog post",
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    type: "follow",
    user: {
      id: "4",
      name: "Marcus Thompson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    message: "started following you",
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    type: "share",
    user: {
      id: "5",
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
    blogId: "3",
    blogTitle: "React 19: What's New",
    message: "shared your blog post",
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    type: "like",
    user: {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    blogId: "4",
    blogTitle: "Building Scalable Startups",
    message: "liked your blog post",
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "like":
      return <Heart className="h-4 w-4 text-destructive" />;
    case "comment":
      return <MessageCircle className="h-4 w-4 text-primary" />;
    case "follow":
      return <UserPlus className="h-4 w-4 text-success" />;
    case "share":
      return <Share2 className="h-4 w-4 text-accent" />;
  }
};

const getNotificationBg = (type: Notification["type"]) => {
  switch (type) {
    case "like":
      return "bg-destructive/10";
    case "comment":
      return "bg-primary/10";
    case "follow":
      return "bg-success/10";
    case "share":
      return "bg-accent/10";
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => !n.isRead);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-2">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={notifications.length === 0}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread" className="gap-2">
              Unread
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <div
                  key={notification.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-xl border transition-all animate-slide-up",
                    notification.isRead
                      ? "bg-card border-border"
                      : "bg-primary/5 border-primary/20"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  {/* Avatar with Icon */}
                  <div className="relative">
                    <Link to={`/profile/${notification.user.id}`}>
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={notification.user.avatar}
                          alt={notification.user.name}
                        />
                        <AvatarFallback>
                          {notification.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 rounded-full p-1",
                        getNotificationBg(notification.type)
                      )}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <Link
                        to={`/profile/${notification.user.id}`}
                        className="font-semibold hover:text-primary transition-colors"
                      >
                        {notification.user.name}
                      </Link>{" "}
                      {notification.message}
                      {notification.blogTitle && (
                        <>
                          {" "}
                          <Link
                            to={`/blog/${notification.blogId}`}
                            className="font-medium text-primary hover:underline"
                          >
                            "{notification.blogTitle}"
                          </Link>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No notifications</p>
                <p className="text-muted-foreground">
                  {filter === "unread"
                    ? "You're all caught up!"
                    : "You don't have any notifications yet."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
