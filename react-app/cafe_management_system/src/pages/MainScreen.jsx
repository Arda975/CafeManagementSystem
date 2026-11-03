import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserLock } from 'react-icons/fa';  // Personel giriş ikonu
import api, { getErrorMessage } from '../api/client';
import { getSession, isAdmin, saveSession } from '../auth/session';
import './MainScreen.css';

const images = [
    "/assets/cafe-image1.jpg",
    "/assets/cafe-image2.jpg",
    "/assets/cafe-image3.jpg",
    "/assets/cafe-image4.jpg",
    "/assets/cafe-image5.jpg"
];

function MainScreen() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Arka plan resmini her 3,5 saniyede bir değiştir
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3500);
        return () => clearInterval(intervalId);
    }, []);

    // Already logged in: the lock icon goes straight to the user's panel.
    const handleLockClick = () => {
        const session = getSession();
        if (session) {
            navigate(isAdmin(session) ? '/adminscreen' : '/tables');
        } else {
            setIsFormVisible(!isFormVisible);
        }
    };

    // Staff login: the API returns a JWT that is sent with every following request.
    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        try {
            const response = await api.post('/auth/login', { username, password });
            saveSession(response.data);
            navigate(isAdmin(response.data) ? '/adminscreen' : '/tables');
        } catch (err) {
            setError(getErrorMessage(err, "Giriş yapılamadı."));
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
                    <FaUserLock className="admin-icon" onClick={handleLockClick} />
                </div>
            </div>

            {/* Personel Giriş Formu */}
            {isFormVisible && (
                <form className="admin-login-form" onSubmit={handleLogin}>
                    <h1>Amedim Cafe</h1>
                    <h2>Personel Girişi</h2>
                    <label htmlFor="username">Kullanıcı Adı</label>
                    <input type="text" id="username" placeholder="Kullanıcı Adınızı Girin" autoComplete="username"
                           value={username} onChange={(e) => setUsername(e.target.value)} />
                    <label htmlFor="password">Şifre</label>
                    <input type="password" id="password" placeholder="Şifrenizi Girin" autoComplete="current-password"
                           value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit">Giriş Yap</button>
                </form>
            )}

            {/* Hero Section - Arka Plan */}
            <div className="hero-section" style={{ backgroundImage: `url(${images[currentImageIndex]})` }}>
                <div className="hero-content">
                    <h1 className="hero-title">Her Lokma Değerli</h1>
                    <p className="hero-subtitle">Lezzetli yemeklerimizle her anınıza değer katıyoruz.</p>
                    <Link to="/main-dishes" className="hero-order-button">Sipariş Ver</Link>
                </div>
            </div>
        </div>
    );
}

export default MainScreen;
