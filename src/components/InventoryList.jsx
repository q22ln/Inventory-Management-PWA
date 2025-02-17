import React, {useContext, useState, useRef} from "react";
import {InventoryContext} from "../context/InventoryContext";
import {
    PencilIcon,
    TrashIcon,
    ShoppingCartIcon,
    PlusCircleIcon,
    CheckCircleIcon,
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx"; // ✅ Import XLSX to read Excel files


const InventoryList = () => {
    const {inventory, salesLog, addItem, editItem, removeItem, sellItem} = useContext(InventoryContext);
    const [name, setName] = useState("");
    const [barcode, setBarcode] = useState("");
    const [stock, setStock] = useState("");
    const [price, setPrice] = useState("");
    const [editingItemId, setEditingItemId] = useState(null);
    const [barcodeInput, setBarcodeInput] = useState("");
    const [inventorySearch, setInventorySearch] = useState("");

    const nameInputRef = useRef(null);

    // Pagination settings for each table
    const itemsPerPage = 10;
    const [inventoryPage, setInventoryPage] = useState(1);

    // Function to paginate data for each table
    const getPaginatedData = (data, page) => {
        return data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    };

    const getFilteredData = (data, searchQuery) => {
        return data.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.barcode.includes(searchQuery)
        );
    };

    const inventoryItems = getPaginatedData(getFilteredData(inventory, inventorySearch), inventoryPage);

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: "array"});
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert sheet data to JSON
            const importedData = XLSX.utils.sheet_to_json(worksheet);

            // ✅ Format data to match inventory structure
            const formattedData = importedData.map((item, index) => ({
                id: Date.now() + index, // Unique ID
                name: item.Name || "Unnamed Product",
                barcode: item.Barcode || `000${index}`,
                originalStock: item.Stock ? parseInt(item.Stock, 10) : 0,
                stock: item.Stock ? parseInt(item.Stock, 10) : 0,
                price: item.Price ? parseFloat(item.Price) : 0,
            }));

            // ✅ Add imported data to inventory
            formattedData.forEach((product) => addItem(product));
            toast.success("Products imported successfully!");
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="bg-white p-6 shadow-md rounded-lg">
            <ToastContainer autoClose={1500}/>
            <h2 className="text-2xl font-bold mb-4">Inventory</h2>

            {/* Add/Edit Item Form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!name || !barcode || !stock || !price) {
                        toast.error("Please fill in all fields.");
                        return;
                    }
                    const newItem = {
                        id: editingItemId || Date.now(),
                        name,
                        barcode,
                        originalStock: parseInt(stock, 10),
                        stock: parseInt(stock, 10),
                        price: parseFloat(price),
                    };
                    if (editingItemId) {
                        editItem(newItem);
                        setEditingItemId(null);
                        toast.success("Item successfully updated!");
                    } else {
                        addItem(newItem);
                        toast.success("New item added!");
                    }
                    setName("");
                    setBarcode("");
                    setStock("");
                    setPrice("");
                }}
                className="grid grid-cols-2 gap-4 mb-6"
            >
                <input ref={nameInputRef} type="text" placeholder="Item Name" value={name}
                       onChange={(e) => setName(e.target.value)} className="border p-2 rounded-md w-full"/>
                <input type="text" placeholder="Barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)}
                       className="border p-2 rounded-md w-full"/>
                <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)}
                       className="border p-2 rounded-md w-full"/>
                <input type="number" placeholder="Price (€)" step="0.01" value={price}
                       onChange={(e) => setPrice(e.target.value)} className="border p-2 rounded-md w-full"/>
                <button type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center">
                    {editingItemId ? (
                        <CheckCircleIcon className="w-5 h-5"/>
                    ) : (
                        <PlusCircleIcon className="w-5 h-5"/>
                    )}
                </button>
            </form>

            {/* Sell Item Manually */}
            <h3 className="text-lg font-bold mb-2">Sell an Item</h3>
            <div className="flex gap-4 mb-6">
                <input type="text" placeholder="Enter Barcode" value={barcodeInput}
                       onChange={(e) => setBarcodeInput(e.target.value)} className="border p-2 rounded-md w-full"/>
                <button onClick={() => sellItem(barcodeInput)} className="bg-green-500 text-white px-4 py-2 rounded-md">
                    <ShoppingCartIcon className="w-5 h-5"/>
                </button>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Import Products</label>
                <input type="file" accept=".xls,.xlsx" onChange={handleImport} className="border p-2 rounded-md"/>
            </div>

            {/* Tables Section */}
            {[
                {
                    id: "inventoryTable",
                    title: "Current Inventory",
                    data: inventoryItems,
                    setPage: setInventoryPage,
                    totalItems: inventory.length,
                    searchQuery: inventorySearch,
                    setSearchQuery: setInventorySearch,
                },
            ].map(({id, title, data, setPage, totalItems, searchQuery, setSearchQuery, summary, log}) => (
                <div key={id} className="mb-8">
                    <h2 className="text-xl font-bold mb-2">{title}</h2>

                    {/* 🔹 Individual Search Input for Each Table */}
                    <div className="flex items-center mb-6 border border-gray-300 rounded-md p-2">
                        <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 mr-2"/>
                        <input
                            type="text"
                            placeholder="Search by Name or Barcode..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full outline-none text-gray-700"
                        />
                    </div>

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table id={id} className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                {log ? (
                                    <>
                                        <th className="px-6 py-3">Item Name</th>
                                        <th className="px-6 py-3">Barcode</th>
                                        <th className="px-6 py-3">Time of Sale</th>
                                    </>
                                ) : summary ? (
                                    <>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Barcode</th>
                                        <th className="px-6 py-3">Total Sold</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Barcode</th>
                                        <th className="px-6 py-3">Original Stock</th>
                                        <th className="px-6 py-3">Current Stock</th>
                                        <th className="px-6 py-3">Price (€)</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </>
                                )}
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((item, idx) => (
                                <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                    {log ? (
                                        <>
                                            <td className="px-6 py-4">{item.name}</td>
                                            <td className="px-6 py-4">{item.barcode}</td>
                                            <td className="px-6 py-4">{item.time}</td>
                                        </>
                                    ) : summary ? (
                                        <>
                                            <td className="px-6 py-4">{item.name}</td>
                                            <td className="px-6 py-4">{item.barcode}</td>
                                            <td className="px-6 py-4">{salesLog.filter(log => log.barcode === item.barcode).length}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4">{item.name}</td>
                                            <td className="px-6 py-4">{item.barcode}</td>
                                            <td className="px-6 py-4">{item.originalStock}</td>
                                            <td className="px-6 py-4">{item.stock}</td>
                                            <td className="px-6 py-4">{item.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button onClick={() => setEditingItemId(item.id)}
                                                        className="bg-yellow-500 text-white px-2 py-1 rounded-md">
                                                    <PencilIcon className="w-5 h-5"/>
                                                </button>
                                                <button onClick={() => removeItem(item.id)}
                                                        className="bg-red-500 text-white px-2 py-1 rounded-md">
                                                    <TrashIcon className="w-5 h-5"/>
                                                </button>
                                                <button onClick={() => sellItem(item.barcode)}
                                                        className="bg-green-500 text-white px-2 py-1 rounded-md">
                                                    <ShoppingCartIcon className="w-5 h-5"/>
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination - Unique per table */}
                    <div className="flex justify-center mt-4">
                        {Array.from({length: Math.ceil(totalItems / itemsPerPage)}, (_, i) => (
                            <button key={i} onClick={() => setPage(i + 1)}
                                    className={`px-3 py-1 border ${i + 1 === (id === "inventoryTable" ? inventoryPage : id === "salesSummaryTable" ? salesSummaryPage : salesLogPage) ? "bg-blue-500 text-white" : "hover:bg-blue-200"} rounded-md mx-1`}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InventoryList;
