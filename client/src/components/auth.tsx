import type { TUser } from "@/assets/types";
import { AuthContext } from "@/context/authContext";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

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

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
