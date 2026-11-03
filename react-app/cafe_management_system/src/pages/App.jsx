import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { OrderProvider } from "./OrderContext";
import MainDishes from "./MainDishes";
import Drinks from "./Drinks";
import Snacks from "./Snacks";
import Desserts from "./Desserts";
import OrderSummaryPopup from "./OrderSummaryPopup";
import About from "./About";
import MainScreen from "./MainScreen.jsx";
import AdminScreen from "./AdminScreen.jsx";
import Tables from "./Tables.jsx";
import ProductManagement from "./ProductManagement.jsx";
import AdminSettings from "./AdminSettings.jsx";
import Payment from "./Payment.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const STAFF = ["Admin", "Waiter"];
const ADMIN = ["Admin"];

const App = () => {
    return (
        <OrderProvider>
            <Router>
                <Routes>
                    {/* Public: customers */}
                    <Route path="/" element={<MainScreen />} />
                    <Route path="/main-dishes" element={<MainDishes />} />
                    <Route path="/drinks" element={<Drinks />} />
                    <Route path="/snacks" element={<Snacks />} />
                    <Route path="/desserts" element={<Desserts />} />
                    <Route path="/about" element={<About />} />

                    {/* Staff (Admin + Waiter) */}
                    <Route path="/tables" element={<ProtectedRoute roles={STAFF}><Tables /></ProtectedRoute>} />
                    <Route path="/payment/:tableId" element={<ProtectedRoute roles={STAFF}><Payment /></ProtectedRoute>} />

                    {/* Admin only */}
                    <Route path="/adminscreen" element={<ProtectedRoute roles={ADMIN}><AdminScreen /></ProtectedRoute>} />
                    <Route path="/productmanagement" element={<ProtectedRoute roles={ADMIN}><ProductManagement /></ProtectedRoute>} />
                    <Route path="/adminsettings" element={<ProtectedRoute roles={ADMIN}><AdminSettings /></ProtectedRoute>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <OrderSummaryPopup />
            </Router>
        </OrderProvider>
    );
};

export default App;
