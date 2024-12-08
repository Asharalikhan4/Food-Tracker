"use client";
import React, { useState, useEffect } from "react";
import { ArrowBigLeft, Loader, Plus, Trash2} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";

export default function createUser() {

    const [loading, setLoading] = useState<boolean>(false);
    const [newUserName, setNewUserName] = useState<string>("");
    const [users, setUsers] = useState<any[]>([]);

    const createUser = async () => {
        setLoading(true);
        try {
            if (newUserName === '') {
                toast.error("Enter a valid username");
                return;
            };
            const response = await fetch(`/api/create-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newUserName }),
            });
            const res = await response.json();
            console.log(res);
            if (response?.ok) {
                setNewUserName("");
                toast.success(res?.message);
            } else {
                toast.error(res?.error);
            };
        } catch (error) {
            toast.error("Something went wrong");
            setNewUserName("");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`/api/users`, { cache: "no-store" });
            if (!response.ok) {
                const data = await response.json();
                toast.error(data?.error);
                return;
            }
            const data = await response.json();
            setUsers(data?.data);
            toast.success(data?.message);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    console.log(users);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Create User</h1>
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
                    <div className="mb-6">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter new user name"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            />
                            <button
                                onClick={createUser}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                {
                                    loading ? (
                                        <Loader />
                                    ) : (
                                        <>
                                            <Plus size={20} className="mr-2" />
                                            Add User
                                        </>
                                    )
                                }

                            </button>
                        </div>
                    </div>
                    <div className="space-y-3">
                    {users?.map((user) => (
                        <div
                            key={user?.id}
                            className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                        >
                            <span className="flex-1 font-medium text-gray-700">
                                {capitalizeFirstLetter(user?.name)}
                            </span>
                            <button
                                //   onClick={() => deleteUser(user.id)}
                                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
                </div>
            </div>
        </div>
    )
}