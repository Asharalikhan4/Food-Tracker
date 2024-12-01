"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Calendar, Send, Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: 'Ashar Ali Khan', selected: false },
    { id: 2, name: 'Pankaj Kumar', selected: false },
    { id: 3, name: 'Arvind yadav', selected: false }
  ]);
  const [newUserName, setNewUserName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [totalTiffins, setTotalTiffins] = useState("");

  const addUser = () => {
    if (newUserName.trim() === '') return;
    const newUser = {
      id: users.length + 1,
      name: newUserName,
      selected: false
    };
    setUsers([...users, newUser]);
    setNewUserName('');
  };

  const deleteUser = (id: any) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const toggleUserSelection = (id: any) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, selected: !user.selected } : user
    ));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const selectedUsers = users.filter(user => user?.selected);
    const formData = {
      date: selectedDate,
      totalTiffins: totalTiffins,
      selectedUsers: selectedUsers.map(user => user?.name)
    };
    if (!formData?.date || !formData?.totalTiffins || !formData?.selectedUsers) {
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    };
    try {
      const response = await fetch(`/api/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response?.ok) {
        toast.success("Order submitted successfully");
        setUsers([
          { id: 1, name: 'Ashar Ali Khan', selected: false },
          { id: 2, name: 'Pankaj Kumar', selected: false },
          { id: 3, name: 'Arvind yadav', selected: false }
        ]);
        setSelectedDate("");
        setTotalTiffins("");
      } else {
        const res = await response.json();
        toast.error(res?.error);
      }
    } catch (_error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">
            Food Tracker
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Select users and enter total tiffins for the day
          </p>
        </div>

        <div className="p-6">
          {/* Date and Tiffin Selection */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <div className="flex items-center gap-2 text-black">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Tiffins for Today
              </label>
              <input
                type="text"
                value={totalTiffins}
                onChange={(e) => setTotalTiffins(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Enter number of tiffins"
              />
            </div>
          </div>

          {/* Add New User */}
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
                onClick={addUser}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Plus size={20} className="mr-2" />
                Add User
              </button>
            </div>
          </div>

          {/* User List */}
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
              >
                <input
                  type="checkbox"
                  checked={user.selected}
                  onChange={() => toggleUserSelection(user.id)}
                  className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="flex-1 font-medium text-gray-700">
                  {user.name}
                </span>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Daily Summary</h3>
            <p className="text-blue-600">
              Selected Users: {users.filter(u => u.selected).length}
            </p>
            <p className="text-blue-600">
              Total Tiffins for Today: {totalTiffins}
            </p>
          </div>
          {/* Submit Button */}
          <div className="mt-6 flex justify-between">

            <Link href="/history"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Calendar className="mr-2" size={20} />
              History
            </Link>

            <button
              onClick={handleSubmit}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {
                loading ? (
                  <Loader />
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Submit Order
                  </>
                )
              }
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
