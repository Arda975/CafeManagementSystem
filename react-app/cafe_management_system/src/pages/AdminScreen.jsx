import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminScreen.css';

function AdminScreen() {
    const adminName = "Admin"; // Adminin adını burada ayarlayın veya bir state ile dinamik hale getirin
    const navigate = useNavigate();

    return (
        <div className="admin-screen">
            <button className="back-button" onClick={() => navigate('/')}>
                Anasayfaya dön
            </button>
            <h1>Hoşgeldiniz, {adminName}!</h1>
            <p>Yönetim paneline hoş geldiniz.</p>

            <div className="button-container">
                <button className="admin-button" onClick={() => navigate('/tables')}>
                    Masaları Getir
                </button>
                <button className="admin-button" onClick={() => navigate('/productmanagement')}>
                    Ürün Güncelleme
                </button>
                <button className="admin-button" onClick={() => navigate('/adminsettings')}>
                    Kullanıcı Bilgisi Güncelleme
                </button>
            </div>
        </div>
    );
}

export default AdminScreen;
