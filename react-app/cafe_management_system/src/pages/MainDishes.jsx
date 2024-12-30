import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useOrders } from "./OrderContext"; // Global sipariş yönetimini içeri alıyoruz
import "./MainDishes.css";

const MainDishes = () => {
    const [dishes, setDishes] = useState([]);
    const { orders, dispatch } = useOrders(); // Global state ve dispatch işlemleri
    const categoryId = 2; // category_id'yi sabitliyoruz

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/Cafe_/GetMenuWithCode?category_id=${categoryId}`
                );
                console.log("API'den gelen veri:", response.data);
                setDishes(response.data);
            } catch (error) {
                console.error("Yemek verisi çekilemedi:", error);
            }
        };

        fetchDishes();
    }, []);

    const addItem = (dishName, price) => {
        dispatch({ type: "ADD_ITEM", payload: { itemName: dishName, price } });
    };

    const removeItem = (dishName) => {
        dispatch({ type: "REMOVE_ITEM", payload: { itemNameToRemove: dishName } });
    };

    return (
        <div className="main-dishes-page">
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
                    <button className="menu-button-selected">Ana Yemekler</button>
                </Link>
                <Link to="/snacks">
                    <button className="menu-button">Atıştırmalıklar</button>
                </Link>
                <Link to="/drinks">
                    <button className="menu-button">İçecekler</button>
                </Link>
                <Link to="/desserts">
                    <button className="menu-button">Tatlılar</button>
                </Link>
            </nav>

            {/* Ana Yemekler Listesi */}
            <div className="dishes-container">
                {dishes.length > 0 ? (
                    dishes.map((dish, index) => (
                        <div className="dish-card" key={index}>
                            <img
                                src={dish.image || "/assets/default-image.png"} // Eğer image gelmezse varsayılan bir resim kullan
                                alt={dish.itemname}
                                className="dish-image"
                            />
                            <div className="dish-details">
                                <h3 className="dish-name">{dish.itemname}</h3>
                                <p className="dish-description">İçindekiler: {dish.description}</p>
                                <div className="price-controls">
                                    <p className="dish-price">Fiyat: {dish.price} TL</p>
                                    <div className="order-controls">
                                        <button onClick={() => removeItem(dish.itemname)}>-</button>
                                        <p className="dish-quantity">{orders[dish.itemname]?.quantity || 0}</p>
                                        <button onClick={() => addItem(dish.itemname, dish.price)}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Üzgünüz, şu anda bu kategoride yemek bulunmuyor.</p>
                )}
            </div>
        </div>
    );
};

export default MainDishes;
