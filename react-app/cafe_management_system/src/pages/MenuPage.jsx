import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage, resolveImage } from "../api/client";
import { useOrders } from "./OrderContext";

const CATEGORY_LINKS = [
    { to: "/main-dishes", label: "Ana Yemekler", categoryId: 2 },
    { to: "/snacks", label: "Atıştırmalıklar", categoryId: 3 },
    { to: "/drinks", label: "İçecekler", categoryId: 4 },
    { to: "/desserts", label: "Tatlılar", categoryId: 1 },
];

/** Shared menu page; the four category pages only differ in categoryId and styling. */
const MenuPage = ({ categoryId, className }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { orders, dispatch } = useOrders();

    useEffect(() => {
        setLoading(true);
        api.get("/products", { params: { categoryId } })
            .then((response) => {
                setProducts(response.data);
                setError("");
            })
            .catch((err) => setError(getErrorMessage(err, "Menü yüklenemedi.")))
            .finally(() => setLoading(false));
    }, [categoryId]);

    const addItem = (product) =>
        dispatch({ type: "ADD_ITEM", payload: { productId: product.id, name: product.name, price: product.price } });

    const removeItem = (product) => dispatch({ type: "REMOVE_ITEM", payload: { productId: product.id } });

    return (
        <div className={className}>
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

            <h1 className="menu-title">Menümüz</h1>

            <nav className="menu-nav">
                {CATEGORY_LINKS.map((link) => (
                    <Link to={link.to} key={link.to}>
                        <button className={link.categoryId === categoryId ? "menu-button-selected" : "menu-button"}>
                            {link.label}
                        </button>
                    </Link>
                ))}
            </nav>

            <div className="dishes-container">
                {loading && <p>Menü yükleniyor...</p>}
                {!loading && error && <p>{error}</p>}
                {!loading && !error && products.length === 0 && <p>Üzgünüz, şu anda bu kategoride ürün bulunmuyor.</p>}

                {!loading && products.map((product) => {
                    const quantity = orders[product.id]?.quantity || 0;
                    const outOfStock = product.stockQuantity <= quantity;
                    return (
                        <div className="dish-card" key={product.id}>
                            <img src={resolveImage(product.imagePath)} alt={product.name} className="dish-image" />
                            <div className="dish-details">
                                <h3 className="dish-name">{product.name}</h3>
                                {product.description && <p className="dish-description">İçindekiler: {product.description}</p>}
                                <div className="price-controls">
                                    <p className="dish-price">Fiyat: {product.price} TL</p>
                                    <div className="order-controls">
                                        <button onClick={() => removeItem(product)} disabled={quantity === 0}>-</button>
                                        <p className="dish-quantity">{quantity}</p>
                                        <button onClick={() => addItem(product)} disabled={outOfStock} title={outOfStock ? "Stokta yok" : ""}>+</button>
                                    </div>
                                </div>
                                {product.stockQuantity === 0 && <p className="dish-description">Tükendi</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MenuPage;
