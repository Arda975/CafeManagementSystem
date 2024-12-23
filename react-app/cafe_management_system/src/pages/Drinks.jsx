import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useOrders } from "./OrderContext"; // Global sipariş yönetimini içeri alıyoruz
import "./Drinks.css";

const Drinks = () => {
    const [drinks, setDrinks] = useState([]);
    const { orders, dispatch } = useOrders(); // Global state ve dispatch işlemleri

    const categoryId = 4; // Drinks için category_id'yi 4 olarak belirledik

    useEffect(() => {
        const fetchDrinks = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/Cafe_/GetMenuWithCode?category_id=${categoryId}`
                );
                console.log("API'den gelen veri (Drinks):", response.data);
                setDrinks(response.data);
            } catch (error) {
                console.error("İçecek verisi çekilemedi:", error);
            }
        };

        fetchDrinks();
    }, []); // Component mount olduğunda veriyi çekeriz

    const addItem = (drinkName, price) => {
        dispatch({ type: "ADD_ITEM", payload: { itemName: drinkName, price } });
    };

    const removeItem = (drinkName) => {
        // Miktar sıfırın altına düşmemeli
        if (orders[drinkName]?.quantity > 0) {
            dispatch({ type: "REMOVE_ITEM", payload: { itemNameToRemove: drinkName } });
        }
    };

    return (
        <div className="drinks-page">
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
                <Link to="/drinks" className="menu-card selected">İçecekler</Link>
                <Link to="/desserts" className="menu-card">Tatlılar</Link>
            </nav>

            {/* İçecekler Listesi */}
            <div className="drinks-container">
                {drinks.length > 0 ? (
                    drinks.map((drink, index) => (
                        <div className="drink-card" key={index}>
                            <img
                                src={drink.image || "/assets/default-image.png"} // Eğer image gelmezse varsayılan bir resim kullan
                                alt={drink.itemname}
                                className="drink-image"
                            />
                            <div className="drink-details">
                                <h3>{drink.itemname}</h3>
                                <p>İçindekiler: {drink.description}</p>
                                <p>Fiyat: {drink.price} TL</p>
                                {/* Sipariş butonları */}
                                <div className="order-controls">
                                    <button onClick={() => removeItem(drink.itemname)}>-</button>
                                    <span>{orders[drink.itemname]?.quantity || 0}</span>
                                    <button onClick={() => addItem(drink.itemname, drink.price)}>+</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No drinks found for the given category.</p>
                )}
            </div>
        </div>
    );
};

export default Drinks;