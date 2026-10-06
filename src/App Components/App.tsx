"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { io } from "socket.io-client";
import { MessageCircle, Compass, UserRound, Users, Globe2, LogOut, Zap } from "lucide-react";
import { ItemContext } from "../ItemContext";
import { useAppLogic } from "./UseAppLogic";
import { API_URL } from "../lib/config";

const App = ({ children }: { children: ReactNode }) => {
  const {
    auth,
    setAuth,
    account,
    refreshAccount,
    contacts,
    refreshContacts,
    explorePeople,
    refreshExplorePeople,
    memberGroups,
    refreshMemberGroups,
    exploreGroups,
    refreshExploreGroups,
    contactMessages,
    groupMessages,
    hasMoreContactMessages,
    hasMoreGroupMessages,
    logout,
    refreshContactMessages,
    refreshGroupMessages,
    refreshRecentContactMessages,
    refreshRecentGroupMessages,
    loadOlderContactMessages,
    loadOlderGroupMessages,
  } = useAppLogic();

  const router = useRouter();
  const handleLogout = () => {
    logout();
    router.push("/");
  };
  const value = {
    auth,
    setAuth,
    account,
    refreshAccount,
    contacts,
    refreshContacts,
    explorePeople,
    refreshExplorePeople,
    memberGroups,
    refreshMemberGroups,
    exploreGroups,
    refreshExploreGroups,
    contactMessages,
    groupMessages,
    hasMoreContactMessages,
    hasMoreGroupMessages,
    logout: handleLogout,
    refreshContactMessages,
    refreshGroupMessages,
    refreshRecentContactMessages,
    refreshRecentGroupMessages,
    loadOlderContactMessages,
    loadOlderGroupMessages,
  };
  const pathname = usePathname();
  const [realtimeStatus, setRealtimeStatus] = useState<"connecting" | "online" | "offline">("offline");
  const refreshMessagesRef = useRef({
    refreshRecentContactMessages,
    refreshRecentGroupMessages,
  });
  const messageRefreshTimers = useRef<
    Partial<Record<"direct" | "group", ReturnType<typeof setTimeout>>>
  >({});

  useEffect(() => {
    refreshMessagesRef.current = {
      refreshRecentContactMessages,
      refreshRecentGroupMessages,
    };
  }, [refreshRecentContactMessages, refreshRecentGroupMessages]);

  useEffect(() => {
    const token = window.localStorage.getItem("authorization");
    if (!auth || !token) {
      setRealtimeStatus("offline");
      return;
    }

    setRealtimeStatus("connecting");
    const socket = io(API_URL, {
      auth: { token: token.replace(/^Bearer\s+/i, "") },
      transports: ["websocket", "polling"],
    });
    socket.on("connect", () => setRealtimeStatus("online"));
    socket.on("disconnect", () => setRealtimeStatus("offline"));
    socket.on("connect_error", (error) => {
      console.error("Realtime connection failed:", error.message);
      setRealtimeStatus("offline");
    });
    socket.on("message:new", (event: { type: "direct" | "group" }) => {
      clearTimeout(messageRefreshTimers.current[event.type]);
      messageRefreshTimers.current[event.type] = setTimeout(() => {
        if (event.type === "group") {
          refreshMessagesRef.current.refreshRecentGroupMessages();
        } else {
          refreshMessagesRef.current.refreshRecentContactMessages();
        }
      }, 100);
    });

    return () => {
      Object.values(messageRefreshTimers.current).forEach(clearTimeout);
      messageRefreshTimers.current = {};
      socket.disconnect();
    };
  }, [auth]);

  const navigation = [
    { href: "/chats/people", label: "Messages", icon: MessageCircle },
    { href: "/chats/groups", label: "Group chats", icon: Users },
    { href: "/explore/people", label: "Discover people", icon: Compass },
    { href: "/explore/groups", label: "Discover groups", icon: Globe2 },
    { href: "/account", label: "Your profile", icon: UserRound },
  ];

  return (
    <ItemContext.Provider value={value}>
      <div className="min-h-screen bg-[#f5f7fb] text-slate-900 md:flex">
        <aside className="flex w-full flex-col border-b border-slate-200 bg-white px-4 py-4 md:fixed md:inset-y-0 md:w-64 md:border-b-0 md:border-r md:px-5 md:py-7">
          <Link href="/" className="flex items-center gap-3 px-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <MessageCircle size={21} />
            </span>
            <span className="text-lg font-bold tracking-tight">Gather<span className="text-indigo-600">.</span></span>
          </Link>
          <div className="mt-8 hidden px-2 text-[11px] font-semibold uppercase tracking-[.16em] text-slate-400 md:block">Workspace</div>
          <nav className="mt-3 flex gap-1 overflow-x-auto md:flex-col">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto hidden rounded-2xl bg-slate-50 p-4 md:block">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Zap size={16} className="text-amber-500" /> Realtime
              <span className={`ml-auto size-2 rounded-full ${realtimeStatus === "online" ? "bg-emerald-500" : realtimeStatus === "connecting" ? "bg-amber-400" : "bg-slate-300"}`} />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {realtimeStatus === "online" ? "You’re connected" : realtimeStatus === "connecting" ? "Connecting…" : "Waiting for connection"}
            </p>
          </div>
          {auth && (
            <button
              onClick={handleLogout}
              className="mt-3 hidden items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 md:flex"
            >
              <LogOut size={18} /> Sign out
            </button>
          )}
        </aside>
        <div className="flex min-h-screen min-w-0 flex-1 flex-col md:ml-64">
          <header className="flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur md:px-9">
            <div>
              <p className="text-xs font-medium text-slate-400">Your space</p>
              <h1 className="mt-0.5 text-base font-semibold">{navigation.find((item) => item.href === pathname)?.label ?? "Welcome"}</h1>
            </div>
            {account ? (
              <Link href="/account" className="flex items-center gap-3 rounded-full p-1 pr-3 hover:bg-slate-50">
                <img src={account.photo} alt="" className="size-9 rounded-full object-cover" />
                <span className="hidden text-sm font-medium sm:block">{account.displayName}</span>
              </Link>
            ) : (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">A calmer way to connect</span>
            )}
          </header>
          <main className="flex-1 p-4 md:p-8">
            <div className="mx-auto h-full max-w-[1440px]">{children}</div>
          </main>
        </div>
      </div>
    </ItemContext.Provider>
  );
};

export default App;
