'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Award,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Users,
  Settings,
  BookOpen,
  FileText
} from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'message' | 'meeting' | 'achievement' | 'system';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // For testing - can be replaced with real API calls
  useEffect(() => {
    // Mock notifications
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: 'New Message',
        message: 'You have a new message from John Doe',
        time: '5 minutes ago',
        read: false,
        type: 'message'
      },
      {
        id: 2,
        title: 'Meeting Reminder',
        message: 'Your meeting with Alice Smith starts in 30 minutes',
        time: '30 minutes ago',
        read: false,
        type: 'meeting'
      },
      {
        id: 3,
        title: 'Achievement Awarded',
        message: 'You have been awarded "Top Performer" badge',
        time: '2 hours ago',
        read: true,
        type: 'achievement'
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);
  
  const markAsRead = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Role-specific navigation items
  const getNavigationItems = () => {
    const role = user?.role || 'mentee';
    
    // Common navigation items for all roles
    const commonItems = [
      {
        name: 'Messages',
        href: `/dashboard/messages`,
        icon: MessageSquare,
        current: pathname.includes('/messages')
      },
      {
        name: 'Meetings',
        href: `/dashboard/meetings`,
        icon: Calendar,
        current: pathname.includes('/meetings')
      },
      {
        name: 'Profile',
        href: `/dashboard/profile`,
        icon: User,
        current: pathname.includes('/profile') && !pathname.includes('/mentees')
      }
    ];
    
    // Role-specific navigation items
    if (role === 'admin') {
      return [
        {
          name: 'Dashboard',
          href: `/dashboard/admin`,
          icon: LayoutDashboard,
          current: pathname === `/dashboard/admin`
        },
        ...commonItems,
        {
          name: 'Users',
          href: `/dashboard/admin/users`,
          icon: Users,
          current: pathname.includes('/users')
        },
        {
          name: 'Reports',
          href: `/dashboard/admin/reports`,
          icon: FileText,
          current: pathname.includes('/reports')
        },
        {
          name: 'Settings',
          href: `/dashboard/admin/settings`,
          icon: Settings,
          current: pathname.includes('/settings')
        }
      ];
    } else if (role === 'mentor') {
      return [
        {
          name: 'Dashboard',
          href: `/dashboard/mentor`,
          icon: LayoutDashboard,
          current: pathname === `/dashboard/mentor`
        },
        ...commonItems,
        {
          name: 'Mentees',
          href: `/dashboard/mentor/mentees`,
          icon: Users,
          current: pathname.includes('/mentees')
        },
        {
          name: 'Achievements',
          href: `/dashboard/achievements`,
          icon: Award,
          current: pathname.includes('/achievements')
        }
      ];
    } else {
      // Mentee navigation
      return [
        {
          name: 'Dashboard',
          href: `/dashboard/mentee`,
          icon: LayoutDashboard,
          current: pathname === `/dashboard/mentee`
        },
        ...commonItems,
        {
          name: 'Assignments',
          href: `/dashboard/mentee/assignments`,
          icon: BookOpen,
          current: pathname.includes('/assignments')
        },
        {
          name: 'Achievements',
          href: `/dashboard/achievements`,
          icon: Award,
          current: pathname.includes('/achievements')
        }
      ];
    }
  };
  
  const navigation = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <span className="sr-only">Open sidebar</span>
          {isSidebarOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Header with notifications */}
      <div className="sticky top-0 z-10 flex-shrink-0 flex bg-white shadow">
        <div className="flex-1 px-4 flex justify-end">
          <div className="ml-4 flex items-center md:ml-6">
            {/* Notifications dropdown */}
            <div className="relative">
              <button
                type="button"
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                )}
              </button>
              
              {/* Notifications dropdown panel */}
              <div
                className={`origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${
                  isNotificationsOpen ? 'block' : 'hidden'
                }`}
              >
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-blue-600 hover:text-blue-500"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            {notification.type === 'message' && (
                              <MessageSquare className="h-5 w-5 text-blue-500" />
                            )}
                            {notification.type === 'meeting' && (
                              <Calendar className="h-5 w-5 text-green-500" />
                            )}
                            {notification.type === 'achievement' && (
                              <Award className="h-5 w-5 text-yellow-500" />
                            )}
                            {notification.type === 'system' && (
                              <Bell className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-500">{notification.message}</p>
                            <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="ml-3 flex-shrink-0 bg-white rounded-md text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-gray-200 px-4 py-2">
                  <Link
                    href="/dashboard/notifications"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    onClick={() => setIsNotificationsOpen(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            </div>
            
            {/* User profile */}
            <div className="ml-3 relative">
              <div className="flex items-center">
                <span className="hidden md:inline-block text-sm text-gray-700 mr-2">
                  {user?.name || 'User'}
                </span>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 flex z-40 lg:hidden ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } transition-opacity duration-300 ease-in-out`}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">Mentor-Mentee</h1>
            </div>
            
            {/* User info */}
            <div className="px-4 py-4 border-t border-b border-gray-200 mt-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.official_mail_id || 'user@example.com'}</p>
                </div>
              </div>
            </div>
            
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    item.current
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 ${
                      item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  logout();
                  setIsSidebarOpen(false);
                }}
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
              >
                <LogOut className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">Mentor-Mentee</h1>
            </div>
            
            {/* User info */}
            <div className="px-4 py-4 border-t border-b border-gray-200 mt-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.official_mail_id || 'user@example.com'}</p>
                </div>
              </div>
            </div>
            
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 ${
                      item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={logout}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
              >
                <LogOut className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-8 pt-16">
          <div className="px-4 sm:px-6 lg:px-8 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
} 