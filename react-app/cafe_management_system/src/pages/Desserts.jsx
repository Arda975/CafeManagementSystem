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
                    <button className="menu-button">Atıştırmalıklar</button>
                </Link>
                <Link to="/drinks">
                    <button className="menu-button">İçecekler</button>
                </Link>
                <Link to="/desserts">
                    <button className="menu-button-selected">Tatlılar</button>
                </Link>
            </nav>

            {/* Tatlılar Listesi */}
            <div className="dishes-container">
                {desserts.length > 0 ? (
                    desserts.map((dessert, index) => (
                        <div className="dish-card" key={index}>
                            <img
                                src={dessert.image || "/assets/default-dessert.png"}
                                alt={dessert.itemname}
                                className="dish-image"
                            />
                            <div className="dish-details">
                                <h3 className="dish-name">{dessert.itemname}</h3>
                                <p className="dish-description">İçindekiler: {dessert.description}</p>
                                <div className="price-controls">
                                    <p className="dish-price">Fiyat: {dessert.price} TL</p>
                                    <div className="order-controls">
                                        <button onClick={() => removeItem(dessert.itemname)}>-</button>
                                        <p className="dish-quantity">{orders[dessert.itemname]?.quantity || 0}</p>
                                        <button onClick={() => addItem(dessert.itemname, dessert.price)}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Üzgünüz, şu anda bu kategoride tatlı bulunmuyor.</p>
                )}
            </div>
        </div>
    );
};

export default Desserts;