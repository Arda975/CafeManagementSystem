import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './MainScreen.css';

function MainScreen() {
    const [showAdminLogin, setShowAdminLogin] = useState(false);

    const toggleAdminLogin = () => {
        setShowAdminLogin(!showAdminLogin);
    };

    return (
        <div className="main-screen">
            {/* Blurlu Arka Plan */}
            <div className="background"></div>

            {/* Admin İkonu */}
            <div className="user-icon" onClick={toggleAdminLogin}>
                <img src="/assets/user-icon.png" alt="Admin" />
            </div>

            {/* Admin Giriş Ekranı */}
            {showAdminLogin && (
                <div className="admin-login">
                    <h3>Admin Girişi</h3>
                    <input type="text" placeholder="Kullanıcı Adı" />
                    <input type="password" placeholder="Şifre" />
                    <button>Giriş Yap</button>
                </div>
            )}

            {/* Üst Başlık */}
            <h1 className="cafe-title">Amedim Cafe</h1>

            {/* Menü Kartları */}
            <div className="menu-cards">
                <Link to="/main-dishes" className="menu-card">
                    Ana Yemek
                </Link>
                <Link to="/snacks" className="menu-card">
                    Atıştırmalık
                </Link>
                <Link to="/drinks" className="menu-card">
                    İçecekler
                </Link>
                <Link to="/desserts" className="menu-card">
                    Tatlı
                </Link>
            </div>

            {/* Alt Footer */}
            <div className="footer">
                <div className="social">
                    <img src="/assets/instagram-icon.png" alt="Instagram"/>
                    <span>@amedimcafe</span>
                </div>
                <div className="social">
                    <img src="/assets/facebook-icon.png" alt="Facebook"/>
                    <span>@amedimcafe</span>
                </div>
                <div className="social">
                    <img src="/assets/phone-icon.png" alt="Phone"/>
                    <span>555-123-4567</span>
                </div>
                <div className="social">
                    <img src="/assets/maps-icon.png" alt="Address"/>
                    <span>Cafe Adresi</span>
                </div>
            </div>
        </div>
    );
}

export default MainScreen;
