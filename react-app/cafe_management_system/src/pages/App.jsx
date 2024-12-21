import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { OrderProvider } from "./OrderContext";
import MainDishes from "./MainDishes";
import Drinks from "./Drinks";
import Snacks from "./Snacks";
import Desserts from "./Desserts";
import OrderSummaryPopup from "./OrderSummaryPopup";
import MainScreen from "./MainScreen.jsx";

const App = () => {
    return (
        <OrderProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<MainScreen />} />
                    <Route path="/main-dishes" element={<MainDishes />} />
                    <Route path="/drinks" element={<Drinks />} />
                    <Route path="/snacks" element={<Snacks />} />
                    <Route path="/desserts" element={<Desserts />} />
                </Routes>
                <OrderSummaryPopup />
            </Router>
        </OrderProvider>
    );
};

export default App;