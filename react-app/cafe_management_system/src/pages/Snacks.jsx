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

    const addItem = (snackName, price) => {
        dispatch({ type: "ADD_ITEM", payload: { itemName: snackName, price } });
    };

    const removeItem = (snackName) => {
        dispatch({ type: "REMOVE_ITEM", payload: { itemNameToRemove: snackName } });
    };

    return (
        <div className="snacks-page">
            {/* Navigation Bar */}
            <div className="navbar">
                <div className="navbar-left">
                    <span className="cafe-name">Amedim Cafe</span>
                </div>
                <div className="navbar-right">
                    <Link to="/" className="nav-link">Ana Sayfa</Link>
                    <Link to="/about" className="nav-link">Hakkımızda</Link>
                    <Link to="/main-dishes" className="menu-button">Menü</Link>
                </div>
            </div>

            {/* Menu Title */}
            <h1 className="menu-title">Menümüz</h1>

            {/* Menu Navigation (Categories as Buttons) */}
            <nav className="menu-nav">
                <Link to="/main-dishes">
                    <button className="menu-button">Ana Yemekler</button>
                </Link>
                <Link to="/snacks">
                    <button className="menu-button-selected">Atıştırmalıklar</button>
                </Link>
                <Link to="/drinks">
                    <button className="menu-button">İçecekler</button>
                </Link>
                <Link to="/desserts">
                    <button className="menu-button">Tatlılar</button>
                </Link>
            </nav>

            {/* Atıştırmalık Listesi */}
            <div className="dishes-container">
                {snacks.length > 0 ? (
                    snacks.map((snack, index) => (
                        <div className="dish-card" key={index}>
                            <img
                                src={snack.image || "/assets/default-snack.png"}
                                alt={snack.itemname}
                                className="dish-image"
                            />
                            <div className="dish-details">
                                <h3 className="dish-name">{snack.itemname}</h3>
                                <p className="dish-description">İçindekiler: {snack.description}</p>
                                <div className="price-controls">
                                    <p className="dish-price">Fiyat: {snack.price} TL</p>
                                    <div className="order-controls">
                                        <button onClick={() => removeItem(snack.itemname)}>-</button>
                                        <p className="dish-quantity">{orders[snack.itemname]?.quantity || 0}</p>
                                        <button onClick={() => addItem(snack.itemname, snack.price)}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Üzgünüz, şu anda bu kategoride atıştırmalık bulunmuyor.</p>
                )}
            </div>
        </div>
    );
};

export default Snacks;