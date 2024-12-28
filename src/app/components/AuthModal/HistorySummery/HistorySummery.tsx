import React, { useMemo } from 'react';

interface HistoryData {
    _id: string;
    date: string;
    totalTiffins: string;
    selectedUsers: string[];
    createdAt: string;
    presentUsers?: string[]; // Add optional field for present users
}

interface HistorySummaryProps {
    historyData: HistoryData[];
}

const TIFFIN_COST = 140; // Updated cost per tiffin in rupees

const HistorySummary: React.FC<HistorySummaryProps> = ({ historyData }) => {
    const summaryStats = useMemo(() => {
        // Calculate unique days tiffins were ordered
        const uniqueDays = new Set(historyData.map(entry => entry.date)).size;

        // Calculate total tiffins
        const totalTiffins = historyData.reduce((sum, entry) => 
            sum + parseInt(entry.totalTiffins), 0);

        // Calculate tiffins and cost per user
        const userStats: { [key: string]: { tiffins: number, cost: number } } = 
        historyData.reduce((acc, entry) => {
            // Only process if presentUsers is defined and the user is present
            const presentUsers = entry.presentUsers || entry.selectedUsers;
            const totalTiffins = parseInt(entry.totalTiffins);
            
            // Calculate cost per tiffin
            const perTiffinCost = TIFFIN_COST / 3; // 140/3 per portion

            presentUsers.forEach(user => {
                if (!acc[user]) {
                    acc[user] = { tiffins: 0, cost: 0 };
                }

                // Calculate user's tiffin portion
                const userTiffinPortion = totalTiffins / presentUsers.length;
                
                acc[user].tiffins += userTiffinPortion;
                // Calculate cost based on user's tiffin portion
                acc[user].cost += Math.ceil(userTiffinPortion * perTiffinCost);
            });
            
            return acc;
        }, {} as { [key: string]: { tiffins: number, cost: number } });

        return {
            uniqueDays,
            totalTiffins,
            userStats
        };
    }, [historyData]);

    return (
        <div className="bg-blue-50 rounded-lg p-6 mt-6 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Statistics */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                        Total Overview
                    </h3>
                    <div className="space-y-2">
                        <p className="text-gray-700">
                            <span className="font-medium text-blue-600">
                                {summaryStats.uniqueDays}
                            </span> Days Ordered
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium text-blue-600">
                                {summaryStats.totalTiffins}
                            </span> Total Tiffins
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium text-blue-600">
                                ₹{summaryStats.totalTiffins * (TIFFIN_COST / 3)}
                            </span> Total Cost
                        </p>
                    </div>
                </div>

                {/* User Tiffin Breakdown */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                        Tiffins per User
                    </h3>
                    <div className="space-y-2">
                        {Object.entries(summaryStats.userStats)
                            .sort((a, b) => b[1].tiffins - a[1].tiffins)
                            .map(([user, stats]) => (
                                <div 
                                    key={user} 
                                    className="flex justify-between items-center"
                                >
                                    <span className="text-gray-700">{user}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-blue-600">
                                            {stats.tiffins.toFixed(1)} Tiffins
                                        </span>
                                        <span className="font-medium text-green-600">
                                            ₹{stats.cost}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Additional Insights */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                        Additional Insights
                    </h3>
                    <div className="space-y-2">
                        <p className="text-gray-700">
                            Avg Tiffins per Day: 
                            <span className="font-medium text-blue-600 ml-2">
                                {(summaryStats.totalTiffins / summaryStats.uniqueDays).toFixed(1)}
                            </span>
                        </p>
                        <p className="text-gray-700">
                            Total Users Served: 
                            <span className="font-medium text-blue-600 ml-2">
                                {Object.keys(summaryStats.userStats).length}
                            </span>
                        </p>
                        <p className="text-gray-700">
                            Cost per Tiffin Portion: 
                            <span className="font-medium text-green-600 ml-2">
                                ₹{TIFFIN_COST / 3}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistorySummary;