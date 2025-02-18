import React, {useState} from "react";
import {BrowserRouter as Router, NavLink, Route, Routes} from "react-router-dom";
import {InventoryProvider} from "./context/InventoryContext";
import InventoryList from "./components/InventoryList";
import ProductCard from "./components/ProductCard";
import Evaluation from "./components/Evaluation";
import {Bars3Icon, ChartPieIcon, CubeIcon, HomeIcon} from "@heroicons/react/24/outline";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(
        localStorage.getItem("sidebarOpen") === "true"
    );

    const toggleSidebar = () => {
        const newState = !isSidebarOpen;
        setIsSidebarOpen(newState);
        localStorage.setItem("sidebarOpen", newState);
    };

    return (
        <InventoryProvider>
            <Router>
                <div className="flex h-screen bg-gray-100">
                    <aside
                        className={`bg-blue-600 text-white p-4 flex flex-col fixed transition-all duration-300 ${
                            isSidebarOpen ? "w-64" : "w-16"
                        } h-screen`}
                    >
                        <div className="flex items-center justify-center">
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-md hover:bg-blue-700 transition"
                            >
                                <Bars3Icon className="w-6 h-6 flex-shrink-0"/>
                            </button>

                            {isSidebarOpen && <h1 className="text-xl font-bold ml-2">Inventory Tracker</h1>}
                        </div>

                        <nav className="flex flex-col space-y-2 mt-6">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-md transition ${
                                        isActive ? "bg-blue-800" : "hover:bg-blue-700"
                                    } ${isSidebarOpen ? "justify-start space-x-3" : "justify-center"}`
                                }
                            >
                                <HomeIcon className="w-6 h-6 flex-shrink-0"/>
                                {isSidebarOpen && <span>Inventory</span>}
                            </NavLink>

                            <NavLink
                                to="/products"
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-md transition ${
                                        isActive ? "bg-blue-800" : "hover:bg-blue-700"
                                    } ${isSidebarOpen ? "justify-start space-x-3" : "justify-center"}`
                                }
                            >
                                <CubeIcon className="w-6 h-6 flex-shrink-0"/>
                                {isSidebarOpen && <span>Product View</span>}
                            </NavLink>

                            <NavLink
                                to="/evaluation"
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-md transition ${
                                        isActive ? "bg-blue-800" : "hover:bg-blue-700"
                                    } ${isSidebarOpen ? "justify-start space-x-3" : "justify-center"}`
                                }
                            >
                                <ChartPieIcon className="w-6 h-6 flex-shrink-0"/>
                                {isSidebarOpen && <span>Evaluation</span>}
                            </NavLink>
                        </nav>
                    </aside>

                    <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
                        <ToastContainer autoClose={1500}/>

                        <Routes>
                            <Route path="/" element={<InventoryList/>}/>
                            <Route path="/products" element={<ProductCard/>}/>
                            <Route path="/evaluation" element={<Evaluation/>}/> {/* ✅ New Route */}
                        </Routes>
                    </main>
                </div>
            </Router>
        </InventoryProvider>
    );
}

export default App;
