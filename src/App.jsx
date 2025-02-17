import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter as Router, Route, Routes, NavLink} from "react-router-dom";
import {InventoryProvider} from "./context/InventoryContext";
import InventoryList from "./components/InventoryList";
import ProductCard from "./components/ProductCard";
import {HomeIcon, CubeIcon} from "@heroicons/react/24/outline";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

function App() {
    return (
        <InventoryProvider>
            <Router>
                <div className="flex h-screen bg-gray-100">
                    {/* Sidebar - Now Full Height */}
                    <aside className="w-64 bg-blue-600 text-white p-6 space-y-6 flex flex-col h-screen fixed">
                        <h1 className="text-2xl font-bold">Inventory Tracker</h1>
                        <nav className="flex flex-col space-y-4">
                            <NavLink to="/"
                                     className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 transition">
                                <HomeIcon className="w-6 h-6"/>
                                <span>Inventory</span>
                            </NavLink>
                            <NavLink to="/products"
                                     className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 transition">
                                <CubeIcon className="w-6 h-6"/>
                                <span>Product View</span>
                            </NavLink>
                        </nav>
                    </aside>

                    {/* Main Content - Ensure it doesn't go under the sidebar */}
                    <main className="flex-1 p-6 ml-64">
                        {/* ✅ Global Toastr Settings */}
                        <ToastContainer autoClose={1500}/>

                        <Routes>
                            <Route path="/" element={<InventoryList/>}/>
                            <Route path="/products" element={<ProductCard/>}/>
                        </Routes>
                    </main>
                </div>
            </Router>
        </InventoryProvider>
    );
}

export default App;
