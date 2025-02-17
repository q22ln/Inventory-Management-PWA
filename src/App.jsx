import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter as Router, Route, Routes, NavLink} from "react-router-dom";
import {InventoryProvider} from "./context/InventoryContext";
import InventoryList from "./components/InventoryList";
import ProductCard from "./components/ProductCard";
import Evaluation from "./components/Evaluation";
import {HomeIcon, CubeIcon, Bars3Icon, ChartPieIcon} from "@heroicons/react/24/outline";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

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
                                <Bars3Icon className="w-7 h-7 flex-shrink-0"/>
                            </button>

                            {isSidebarOpen && <h1 className="text-xl font-bold ml-2">Inventory Tracker</h1>}
                        </div>

                        <nav className="flex flex-col space-y-2 mt-6">
                            <NavLink
                                to="/"
                                className={`flex items-center p-3 rounded-md hover:bg-blue-700 transition ${
                                    isSidebarOpen ? "justify-start space-x-3" : "justify-center"
                                }`}
                            >
                                <HomeIcon className="w-7 h-7 flex-shrink-0"/>
                                {isSidebarOpen && <span>Inventory</span>}
                            </NavLink>
                            <NavLink
                                to="/products"
                                className={`flex items-center p-3 rounded-md hover:bg-blue-700 transition ${
                                    isSidebarOpen ? "justify-start space-x-3" : "justify-center"
                                }`}
                            >
                                <CubeIcon className="w-7 h-7 flex-shrink-0"/>
                                {isSidebarOpen && <span>Product View</span>}
                            </NavLink>
                        </nav>
                        <NavLink to="/evaluation"
                                 className={`flex items-center p-3 rounded-md hover:bg-blue-700 transition ${
                                     isSidebarOpen ? "justify-start space-x-3" : "justify-center"
                                 }`}
                        >
                            <ChartPieIcon className="w-7 h-7 flex-shrink-0"/>
                            {isSidebarOpen && <span>Evaluation</span>}
                        </NavLink>

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
