"use client";
import React, { FC, createContext, useContext, useState, useEffect } from "react";

interface AuthContextProps {
    isAuthorized: boolean;
    authorize: (code: string) => boolean;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const authorized = sessionStorage.getItem("isAuthorized") === "true";
        setIsAuthorized(authorized);
    }, []);

    const authorize = (code: string) => {
        const correctCode = process.env.NEXT_PUBLIC_ACCESS_CODE;
        if (code === correctCode) {
            sessionStorage.setItem("isAuthorized", "true");
            setIsAuthorized(true);
            return true;
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{ isAuthorized, authorize }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

export default AuthProvider;