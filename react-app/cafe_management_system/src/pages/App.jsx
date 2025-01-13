import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { OrderProvider } from "./OrderContext";
import { TableProvider } from './TableContext';
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


const App = () => {
    return (
        <OrderProvider>
            <TableProvider>
                <OrderProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<MainScreen />} />
                            <Route path="/main-dishes" element={<MainDishes />} />
                            <Route path="/drinks" element={<Drinks />} />
                            <Route path="/snacks" element={<Snacks />} />
                            <Route path="/desserts" element={<Desserts />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/adminscreen" element={<AdminScreen />} />
                            <Route path="/tables" element={<Tables />} />
                            <Route path="/productmanagement" element={<ProductManagement />} />
                            <Route path="/adminsettings" element={<AdminSettings />} />
                            <Route path="/payment/" element={<Payment />} />
                        </Routes>
                        <OrderSummaryPopup />
                    </Router>
                </OrderProvider>
            </TableProvider>
        </OrderProvider>
    );
};

export default App;