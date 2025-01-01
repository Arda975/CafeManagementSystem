import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserLock } from 'react-icons/fa';  // Admin ikonu
import './MainScreen.css';

function MainScreen() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFormVisible, setIsFormVisible] = useState(false); // Formun görünürlüğünü kontrol eden state
    const navigate = useNavigate();  // useNavigate hook'unu başlat

    // Resim listesi
    const images = [
        "/assets/cafe-image1.jpg",
        "/assets/cafe-image2.jpg",
        "/assets/cafe-image3.jpg",
        "/assets/cafe-image4.jpg",
        "/assets/cafe-image5.jpg"
    ];

    // Resim değişimini her saniye yapmak için useEffect kullanabiliriz
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3500); // Her 3500ms (3,5 saniye) bir resim değişecek

        return () => clearInterval(intervalId); // Komponent unmount olduğunda interval temizlenir
    }, []);

    // Form açma ve kapama fonksiyonu
    const toggleAdminForm = () => {
        setIsFormVisible(!isFormVisible);
    };

    // Admin giriş yapıldığında yönlendirme
    const handleAdminLogin = () => {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        if (username !== "admin" || password !== "admin") {
            alert("Yanlış kullanıcı adı veya şifre");
        } else {
            navigate('/adminscreen');  // Admin ekranına yönlendirme
        }
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
                    {/* Admin Icon */}
                    <FaUserLock
                        className="admin-icon"
                        onClick={toggleAdminForm} // Tıklama ile formu aç/kapa
                    />
                </div>
            </div>

            {/* Admin Login Form */}
            {isFormVisible && (
                <div className="admin-login-form">
                    <h1>Amedim Cafe</h1>
                    <h2>Admin Girişi</h2>
                    <label htmlFor="username">Kullanıcı Adı</label>
                    <input type="text" id="username" placeholder="Kullanıcı Adınızı Girin" />
                    <label htmlFor="password">Şifre</label>
                    <input type="password" id="password" placeholder="Şifrenizi Girin" />
                    <button onClick={handleAdminLogin}>Giriş Yap</button>
                </div>
            )}

            {/* Hero Section - Arka Plan */}
            <div className="hero-section" style={{ backgroundImage: `url(${images[currentImageIndex]})` }}>
                <div className="hero-content">
                    <h1 className="hero-title">Her Lokma Değerli</h1>
                    <p className="hero-subtitle">Lezzetli yemeklerimizle her anınıza değer katıyoruz.</p>
                    <Link to="/main-dishes" className="hero-order-button">Sipariş Ver</Link>
                </div>
            </div>

            {/* Görsel Değiştirme Noktaları Kaldırıldı */}
        </div>
    );
}

export default MainScreen;
