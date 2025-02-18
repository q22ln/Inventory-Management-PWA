import {useContext, useEffect, useState} from "react";
import {InventoryContext} from "../context/InventoryContext";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import Product from "./Product.jsx";

const ProductCard = () => {
    const {inventory, sellItem} = useContext(InventoryContext);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        let barcodeBuffer = "";

        const handleBarcodeScan = (event) => {
            if (event.key === "Enter" && barcodeBuffer.length > 0) {
                console.log("Scanned Barcode:", barcodeBuffer);
                sellItem(barcodeBuffer.trim()); // ✅ Sell item
                barcodeBuffer = ""; // ✅ Clear buffer
            } else if (event.key.length === 1) {
                barcodeBuffer += event.key;
            }
        };

        if (!window.hasBarcodeListener) {
            window.hasBarcodeListener = true;
            window.addEventListener("keydown", handleBarcodeScan);
        }

        return () => {
            window.removeEventListener("keydown", handleBarcodeScan);
            window.hasBarcodeListener = false;
        };
    }, []);

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.barcode.includes(searchQuery)
    );

    return (
        <div className="bg-white p-6 shadow-md rounded-lg">
            <ToastContainer autoClose={1500}/>

            <h2 className="text-2xl font-bold mb-4">Product List</h2>

            {/* ✅ Search Bar */}
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
                        <Product key={item.id} item={item} sellItem={sellItem}/>
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-3">No products found.</p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
