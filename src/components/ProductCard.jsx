import React, {useContext, useState} from 'react';
import {InventoryContext} from '../context/InventoryContext';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {CubeIcon, CurrencyEuroIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {ShoppingCartIcon} from "@heroicons/react/24/outline/index.js";

const ProductCard = () => {
    const {inventory, sellItem} = useContext(InventoryContext);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.barcode.includes(searchQuery)
    );

    return (
        <div className="bg-white p-6 shadow-md rounded-lg">
            <ToastContainer autoClose={1500}/>

            <h2 className="text-2xl font-bold mb-4">Product List</h2>

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

            {/* ✅ Grid: Display 3 Cards Per Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => (
                        <div key={item.id}
                             className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md sm:p-8">

                            {/* ✅ Item Name */}
                            <h5 className="mb-4 text-xl font-medium text-gray-600">{item.name}</h5>

                            {/* ✅ Barcode Display */}
                            <div className="flex items-baseline text-gray-900">
                                <span className="text-sm font-semibold">Barcode: {item.barcode}</span>
                            </div>

                            {/* ✅ Item Details List */}
                            <ul role="list" className="space-y-5 my-7">
                                {/* Stock */}
                                <li className="flex items-center">
                                    <CubeIcon className="shrink-0 w-6 h-6 text-blue-700"/>
                                    <span className="text-base font-normal leading-tight text-gray-600 ms-3">
                                        {item.stock} Stück
                                    </span>
                                </li>

                                {/* Price */}
                                <li className="flex items-center">
                                    <CurrencyEuroIcon className="shrink-0 w-6 h-6 text-blue-700"/>
                                    <span className="text-base font-normal leading-tight text-gray-600 ms-3">
                                        {item.price.toFixed(2)} EUR
                                    </span>
                                </li>
                            </ul>

                            {/* ✅ Sell Button */}
                            <button type="button"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200
                                               font-medium rounded-lg text-md px-5 py-3 inline-flex justify-center w-full text-center"
                                    onClick={() => sellItem(item.barcode)}
                            >
                                <ShoppingCartIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-3">No products found.</p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
