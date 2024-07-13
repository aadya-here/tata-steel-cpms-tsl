import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "../supabase";
import BottomNavbar from "../components/BottomNavbar";

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    const setAuth = (value) => {
        setIsAuth(value);
    };

    const fetchUser = async () => {
        setIsLoading(true);
        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error) {
                throw new Error("Error getting session:", error);
            }

            if (session) {
                const { access_token, refresh_token } = session;
                await supabase.auth.setSession({ access_token, refresh_token });
            }

            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                throw new Error("Error fetching user:", userError);
            }

            const user_id = userData?.user?.id;
            setUserId(user_id);

            if (user_id) {
                setIsAuth(true);
            }
        } catch (error) {
            console.error("Unexpected error fetching user and vendor:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [isAuth]);

    // console.log({ userId, isLoading, isAuth });

    return (
        <AuthContext.Provider
            value={{
                userId,
                isLoading,
                isAuth,
                setAuth,
            }}
        >
            {children}
            {isAuth && <BottomNavbar />}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
