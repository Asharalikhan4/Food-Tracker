"use client";
import React, { useState, useEffect } from "react";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface HistoryData {
    _id: string;
    date: string;
    totalTiffins: number;
    selectedUsers: string[];
};

export default function History() {

    const [historyData, setHistoryData] = useState<HistoryData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const fetchHistory = async () => {
        try {
            const response = await fetch(`/api/history`, { cache: "no-store" });
            if (!response.ok) {
                const data = await response.json();
                setError(data?.error);
                return;
            }
            const data = await response.json();
            setHistoryData(data?.data);
            toast.success(data?.message);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            View all your past orders and details.
                        </p>
                    </div>
                    <div>
                        <Link href="/"
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            <ArrowBigLeft size={20} className="mr-2" />
                            Home
                        </Link>
                    </div>
                </div>

                <div className="p-6">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : historyData?.length === 0 ? (
                        <p className="text-center text-gray-500">No history available.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="border border-gray-300 px-4 py-2">Date</th>
                                        <th className="border border-gray-300 px-4 py-2">Users</th>
                                        <th className="border border-gray-300 px-4 py-2">Total Tiffins</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyData?.map((entry) => (
                                        <tr key={entry._id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2">
                                                {new Date(entry?.date).toLocaleDateString()}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {entry?.selectedUsers?.join(", ")}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {entry?.totalTiffins}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};