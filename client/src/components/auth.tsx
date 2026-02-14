import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { io, Socket } from "socket.io-client";

import type { ServerToClientEvents, TUser } from "@/assets/types";
import { AuthContext } from "@/context/authContext";
interface TAuthProps {
  children: React.ReactNode;
}

export const Auth = ({ children }: TAuthProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState<TUser>({
    _id: "",
    name: "",
    email: "",
    displayName: "",
  });
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<
    Socket<ServerToClientEvents> | undefined
  >(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/currentUser", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 403) {
          navigate("/login");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err : "Unkown error occurred";
        console.error(errorMessage, "SOME ERROR");
      }
    };
    if (!["/login", "/signup"].includes(pathname)) {
      fetchUser();
    }
  }, [pathname]);

  useEffect(() => {
    if (user._id && !socket) {
      const newSocket = io("http://localhost:8000", { withCredentials: true });

      newSocket.on("getOnlineUsers", (userIds: string[]) => {
        setOnlineUsers(userIds);
      });

      newSocket.connect();

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket(newSocket);
    }
  }, [user._id, socket]);

  const disconnectSocket = () => {
    if (socket?.connected) {
      setSocket(undefined);
      socket?.disconnect();
    }
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
