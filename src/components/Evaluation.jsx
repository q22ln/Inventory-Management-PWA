import React, { useContext, useState } from "react";
import { InventoryContext } from "../context/InventoryContext";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Evaluation = () => {
    const { inventory, salesLog } = useContext(InventoryContext);

    // Search states
    const [salesSummarySearch, setSalesSummarySearch] = useState("");
    const [salesLogSearch, setSalesLogSearch] = useState("");

    // Pagination
    const itemsPerPage = 10;
    const [salesSummaryPage, setSalesSummaryPage] = useState(1);
    const [salesLogPage, setSalesLogPage] = useState(1);

    const getFilteredData = (data, searchQuery) => {
        return data.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.barcode.includes(searchQuery)
        );
    };

    // Get paginated & filtered items
    const getPaginatedData = (data, page) => {
        return data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    };

    const salesSummaryItems = getPaginatedData(getFilteredData(inventory, salesSummarySearch), salesSummaryPage);
    const salesLogItems = getPaginatedData(getFilteredData(salesLog, salesLogSearch), salesLogPage);

    return (
        <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Evaluation</h2>

            {/* Sales Summary Table */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">Sales Summary</h2>
                <div className="flex items-center mb-6 border border-gray-300 rounded-md p-2">
                    <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 mr-2"/>
                    <input
                        type="text"
                        placeholder="Search by Name or Barcode..."
                        value={salesSummarySearch}
                        onChange={(e) => setSalesSummarySearch(e.target.value)}
                        className="w-full outline-none text-gray-700"
                    />
                </div>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Barcode</th>
                            <th className="px-6 py-3">Total Sold</th>
                        </tr>
                        </thead>
                        <tbody>
                        {salesSummaryItems.map((item, idx) => (
                            <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{item.name}</td>
                                <td className="px-6 py-4">{item.barcode}</td>
                                <td className="px-6 py-4">{salesLog.filter(log => log.barcode === item.barcode).length}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-4">
                    {Array.from({ length: Math.ceil(inventory.length / itemsPerPage) }, (_, i) => (
                        <button key={i} onClick={() => setSalesSummaryPage(i + 1)}
                                className={`px-3 py-1 border ${i + 1 === salesSummaryPage ? "bg-blue-500 text-white" : "hover:bg-blue-200"} rounded-md mx-1`}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sales Log Table */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">Sales Log</h2>
                <div className="flex items-center mb-6 border border-gray-300 rounded-md p-2">
                    <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 mr-2"/>
                    <input
                        type="text"
                        placeholder="Search by Name or Barcode..."
                        value={salesLogSearch}
                        onChange={(e) => setSalesLogSearch(e.target.value)}
                        className="w-full outline-none text-gray-700"
                    />
                </div>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Item Name</th>
                            <th className="px-6 py-3">Barcode</th>
                            <th className="px-6 py-3">Time of Sale</th>
                        </tr>
                        </thead>
                        <tbody>
                        {salesLogItems.map((log, idx) => (
                            <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{log.name}</td>
                                <td className="px-6 py-4">{log.barcode}</td>
                                <td className="px-6 py-4">{log.time}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-4">
                    {Array.from({ length: Math.ceil(salesLog.length / itemsPerPage) }, (_, i) => (
                        <button key={i} onClick={() => setSalesLogPage(i + 1)}
                                className={`px-3 py-1 border ${i + 1 === salesLogPage ? "bg-blue-500 text-white" : "hover:bg-blue-200"} rounded-md mx-1`}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Evaluation;
