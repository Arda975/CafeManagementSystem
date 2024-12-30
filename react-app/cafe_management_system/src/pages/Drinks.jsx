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
                    <button className="menu-button-selected">İçecekler</button>
                </Link>
                <Link to="/desserts">
                    <button className="menu-button">Tatlılar</button>
                </Link>
            </nav>

            {/* İçecekler Listesi */}
            <div className="dishes-container">
                {drinks.length > 0 ? (
                    drinks.map((drink, index) => (
                        <div className="dish-card" key={index}>
                            <img
                                src={drink.image || "/assets/default-image.png"} // Eğer image gelmezse varsayılan bir resim kullan
                                alt={drink.itemname}
                                className="dish-image"
                            />
                            <div className="dish-details">
                                <h3 className="dish-name">{drink.itemname}</h3>
                                <p className="dish-description">İçindekiler: {drink.description}</p>
                                <div className="price-controls">
                                    <p className="dish-price">Fiyat: {drink.price} TL</p>
                                    <div className="order-controls">
                                        <button onClick={() => removeItem(drink.itemname)}>-</button>
                                        <p className="dish-quantity">{orders[drink.itemname]?.quantity || 0}</p>
                                        <button onClick={() => addItem(drink.itemname, drink.price)}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Üzgünüz, şu anda bu kategoride içecek bulunmuyor.</p>
                )}
            </div>
        </div>
    );
};

export default Drinks;