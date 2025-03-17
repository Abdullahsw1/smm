import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getUserData, getAdminData, UserData, AdminUserData } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  adminData: AdminUserData | null;
  isLoading: boolean;
  isAdmin: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  adminData: null,
  isLoading: true,
  isAdmin: false,
  refreshUserData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [adminData, setAdminData] = useState<AdminUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUserData = async () => {
    if (!user) {
      setUserData(null);
      setAdminData(null);
      return;
    }

    try {
      console.log("Refreshing user data for ID:", user.id);
      // Try to get admin data first
      const adminData = await getAdminData(user.id);
      console.log("Admin data check result:", !!adminData);

      if (adminData) {
        console.log("Setting admin data:", adminData);
        setAdminData(adminData);
        setUserData(adminData);
        return;
      }

      // If not admin, get regular user data
      console.log("Not admin, getting regular user data");
      const userData = await getUserData(user.id);
      setUserData(userData);
      setAdminData(null);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);

        if (data.user) {
          await refreshUserData();
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          await refreshUserData();
        } else {
          setUserData(null);
          setAdminData(null);
        }
        setIsLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        adminData,
        isLoading,
        isAdmin: !!adminData,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
