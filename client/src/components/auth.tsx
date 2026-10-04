import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { io, Socket } from "socket.io-client";

import type {
  NamespaceSpecificClientToServerEvents,
  NamespaceSpecificServerToClientEvents,
  TUser,
} from "@/assets/types";
import { AuthContext } from "@/context/authContext";
import { useIsMobile } from "@/hooks/use-mobile";
interface TAuthProps {
  children: React.ReactNode;
}

export const Auth = ({ children }: TAuthProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<TUser>({
    _id: "",
    name: "",
    email: "",
    displayName: "",
    displayPicture: "",
    status: "",
  });
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<
    | Socket<
        NamespaceSpecificServerToClientEvents,
        NamespaceSpecificClientToServerEvents
      >
    | undefined
  >(undefined);
  const socketRef = useRef<Socket<
    NamespaceSpecificServerToClientEvents,
    NamespaceSpecificClientToServerEvents
  > | null>(null);

  useEffect(() => {
    if (!isMobile && pathname === "/conversations") {
      navigate("/");
    }

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/currentUser", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 403) {
          navigate("/login");
          return;
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err : "Unkown error occurred";
        console.error(errorMessage, "SOME ERROR");
      }
    };

    if (!["/login", "/signup"].includes(pathname) && user._id.length < 1) {
      fetchUser();
    }
  }, [pathname, user._id, isMobile, navigate]);

  useEffect(() => {
    if (!user._id || socketRef.current) return;

    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
    });

    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });

    newSocket.connect();
    socketRef.current = newSocket;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket);

    return () => {
      newSocket.off("getOnlineUsers");
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(undefined);
    };
  }, [user._id]);

  const disconnectSocket = () => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setSocket(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        onlineUsers,
        socket,
        disconnectSocket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
