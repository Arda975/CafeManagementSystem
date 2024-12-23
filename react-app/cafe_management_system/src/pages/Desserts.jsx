import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useOrders } from "./OrderContext"; // Global sipariş yönetimini içeri alıyoruz
import "./Desserts.css"; // Desserts'e özel CSS dosyası

const Desserts = () => {
    const [desserts, setDesserts] = useState([]);
    const { orders, dispatch } = useOrders(); // Global state ve dispatch işlemleri
    const categoryId = 1; // Desserts için category_id'yi sabitliyoruz

    useEffect(() => {
        const fetchDesserts = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/Cafe_/GetMenuWithCode?category_id=${categoryId}`
                );
                console.log("API'den gelen veri (Desserts):", response.data);
                setDesserts(response.data);
            } catch (error) {
                console.error("Tatlı verisi çekilemedi:", error);
            }
        };

        fetchDesserts();
    }, []); // Component mount olduğunda veriyi çekeriz

    const addItem = (dessertName, price) => {
        dispatch({ type: "ADD_ITEM", payload: { itemName: dessertName, price } });
    };

    const removeItem = (dessertName) => {
        dispatch({ type: "REMOVE_ITEM", payload: { itemNameToRemove: dessertName } });
    };

    return (
        <div className="desserts-page">
            {/* Blurlu Arka Plan */}
            <div className="background-blur"></div>

            {/* Üst Menü */}
            <header className="header">
                <Link to="/">
                    <img src="/assets/home-icon.png" alt="Home" className="home-icon" />
                </Link>
                <h1 className="title">AMEDİM CAFE</h1>
            </header>

            {/* Menü Kartları */}
            <nav className="menu-nav">
                <Link to="/main-dishes" className="menu-card">Ana Yemekler</Link>
                <Link to="/snacks" className="menu-card">Atıştırmalıklar</Link>
                <Link to="/drinks" className="menu-card">İçecekler</Link>
                <Link to="/desserts" className="menu-card selected">Tatlılar</Link>
            </nav>

            {/* Tatlılar Listesi */}
            <div className="desserts-container">
                {desserts.length > 0 ? (
                    desserts.map((dessert, index) => (
                        <div className="dessert-card" key={index}>
                            <img
                                src={dessert.image || "/assets/default-dessert.png"}
                                alt={dessert.itemname}
                                className="dessert-image"
                            />
                            <div className="dessert-details">
                                <h3>{dessert.itemname}</h3>
                                <p>İçindekiler: {dessert.description}</p>
                                <p>Fiyat: {dessert.price} TL</p>
                                {/* Sipariş butonları */}
                                <div className="order-controls">
                                    <button onClick={() => removeItem(dessert.itemname)}>-</button>
                                    <span>{orders[dessert.itemname]?.quantity || 0}</span>
                                    <button onClick={() => addItem(dessert.itemname, dessert.price)}>+</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No desserts found for the given category.</p>
                )}
            </div>
        </div>
    );
};

export default Desserts;