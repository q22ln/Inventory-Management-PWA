import React, { createContext, useState, useEffect } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create Context
export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    // Load inventory from LocalStorage
    const initialInventory = JSON.parse(localStorage.getItem("inventory")) || [
        { id: 1, name: "Apple", barcode: "123456789", originalStock: 50, stock: 50, price: 1.5 },
        { id: 2, name: "Banana", barcode: "987654321", originalStock: 30, stock: 30, price: 0.8 },
        { id: 3, name: "Orange", barcode: "456123789", originalStock: 20, stock: 20, price: 1.2 },
    ];

    const [inventory, setInventory] = useState(initialInventory);
    const [salesLog, setSalesLog] = useState(JSON.parse(localStorage.getItem("salesLog")) || []);

    // Sync with LocalStorage
    useEffect(() => {
        localStorage.setItem("inventory", JSON.stringify(inventory));
        localStorage.setItem("salesLog", JSON.stringify(salesLog));
    }, [inventory, salesLog]);

    // ✅ Ensure every new item has `originalStock`
    const addItem = (item) => {
        const newItem = { ...item, originalStock: item.originalStock || item.stock };
        setInventory([...inventory, newItem]);
    };

    // ✅ Ensure editing retains `originalStock`
    const editItem = (updatedItem) => {
        setInventory(inventory.map(item =>
            item.id === updatedItem.id ? { ...updatedItem, originalStock: item.originalStock } : item
        ));
    };

    // Remove an item
    const removeItem = (id) => {
        setInventory(inventory.filter(item => item.id !== id));
    };

    // ✅ Sell Item & Reduce "Current Stock"
    const sellItem = (barcode) => {
        const itemIndex = inventory.findIndex(item => item.barcode === barcode);
        if (itemIndex !== -1) {
            const updatedInventory = [...inventory];
            if (updatedInventory[itemIndex].stock > 0) {
                updatedInventory[itemIndex].stock -= 1; // Reduce current stock

                // Update sales log
                const newLogEntry = {
                    id: Date.now(),
                    name: updatedInventory[itemIndex].name,
                    barcode,
                    time: new Date().toLocaleString(),
                };
                setSalesLog([newLogEntry, ...salesLog]);
                setInventory(updatedInventory);

                toast.success(`Sold 1 unit of "${updatedInventory[itemIndex].name}"`);
            } else {
                toast.error(`No stock left for "${updatedInventory[itemIndex].name}"`);
            }
        } else {
            toast.error("Item not found!");
        }
    };

    return (
        <InventoryContext.Provider value={{ inventory, salesLog, addItem, editItem, removeItem, sellItem }}>
            {children}
        </InventoryContext.Provider>
    );
};
