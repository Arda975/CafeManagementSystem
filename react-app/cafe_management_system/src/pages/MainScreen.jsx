import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './MainScreen.css';

function MainScreen() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Resim listesi
    const images = [
        "/assets/cafe-image.jpg",
        "/assets/cafe-image-2.jpg",
        "/assets/cafe-image-3.jpg"
    ];

    // Resmi değiştir
    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handleDotClick = (index) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className="main-screen">
            {/* Navbar */}
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

            {/* Hero Section */}
            <div className="hero-section" style={{ backgroundImage: `url(${images[currentImageIndex]})` }}>
                <div className="hero-content">
                    <h1 className="hero-title">Her Lokma Değerli</h1>
                    <p className="hero-subtitle">Lezzetli yemeklerimizle her anınıza değer katıyoruz.</p>
                    <Link to="/main-dishes" className="hero-order-button">Sipariş Et</Link>
                </div>
            </div>

            {/* Görsel Değiştirme Noktaları */}
            <div className="image-dots">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                    ></div>
                ))}
            </div>

            {/* Görsel Değiştirme Okları */}
            <div className="image-controls">
                <button className="next-button" onClick={handleNextImage}>▶</button>
            </div>
        </div>
    );
}

export default MainScreen;