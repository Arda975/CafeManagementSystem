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
            {/* Üst Menü */}
            <header className="header">
                <Link to="/">
                    <img src="/assets/home-icon.png" alt="Home" className="home-icon" />
                </Link>
                <h1 className="title">AMEDİM CAFE</h1>
                <h2 className="subtitle">ANA YEMEKLER</h2>
            </header>

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
                                <h3>{dish.itemname}</h3>
                                <p>İçindekiler: {dish.description}</p>
                                <p>Fiyat: {dish.price} TL</p>
                                {/* Sipariş butonları */}
                                <div className="order-controls">
                                    <button onClick={() => removeItem(dish.itemname)}>-</button>
                                    <span>{orders[dish.itemname]?.quantity || 0}</span>
                                    <button onClick={() => addItem(dish.itemname, dish.price)}>+</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No dishes found for the given category.</p>
                )}
            </div>
        </div>
    );
};

export default MainDishes;
