"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

const AuthModal: React.FC = () => {
    const { isAuthorized, authorize } = useAuth();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    if (isAuthorized) return null; // Hide modal if user is authorized

    const handleSubmit = () => {
        if (!authorize(code)) {
            setError("Invalid code. Please try again.");
        } else {
            setError("");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
                <h2 className="text-xl font-semibold mb-4">Enter Access Code</h2>
                <input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter code"
                />
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default AuthModal;
