import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useOrders } from "./OrderContext"; // Global sipariş yönetimini içeri alıyoruz
import "./Snacks.css"; // Snacks'e özel CSS dosyası

const Snacks = () => {
    const [snacks, setSnacks] = useState([]);
    const { orders, dispatch } = useOrders(); // Global state ve dispatch işlemleri
    const categoryId = 3; // Snacks için category_id'yi sabitliyoruz

    useEffect(() => {
        const fetchSnacks = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/Cafe_/GetMenuWithCode?category_id=${categoryId}`
                );
                console.log("API'den gelen veri (Snacks):", response.data);
                setSnacks(response.data);
            } catch (error) {
                console.error("Atıştırmalık verisi çekilemedi:", error);
            }
        };

        fetchSnacks();
    }, []); // Component mount olduğunda veriyi çekeriz

    const addItem = (drinkName, price) => {
        dispatch({ type: "ADD_ITEM", payload: { itemName: drinkName, price } });
    };

    const removeItem = (drinkName) => {
        dispatch({ type: "REMOVE_ITEM", payload: { itemNameToRemove: drinkName } });
    };

    return (
        <div className="snacks-page">
            {/* Üst Menü */}
            <header className="header">
                <Link to="/">
                    <img src="/assets/home-icon.png" alt="Home" className="home-icon" />
                </Link>
                <h1 className="title">AMEDİM CAFE</h1>
                <h2 className="subtitle">ATIŞTIRMALIKLAR</h2>
            </header>

            {/* Atıştırmalık Listesi */}
            <div className="snacks-container">
                {snacks.length > 0 ? (
                    snacks.map((snack, index) => (
                        <div className="snack-card" key={index}>
                            <img
                                src={snack.image || "/assets/default-snack.png"}
                                alt={snack.itemname}
                                className="snack-image"
                            />
                            <div className="snack-details">
                                <h3>{snack.itemname}</h3>
                                <p>İçindekiler: {snack.description}</p>
                                <p>Fiyat: {snack.price} TL</p>
                                {/* Sipariş butonları */}
                                <div className="order-controls">
                                    <button onClick={() => removeItem(snack.itemname)}>-</button>
                                    <span>{orders[snack.itemname]?.quantity || 0}</span>
                                    <button onClick={() => addItem(snack.itemname, snack.price)}>+</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No snacks found for the given category.</p>
                )}
            </div>

        </div>
    );
};

export default Snacks;