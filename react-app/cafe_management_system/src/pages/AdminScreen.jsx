import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { clearSession, getSession } from '../auth/session';
import './AdminScreen.css';

function AdminScreen() {
    const navigate = useNavigate();
    const session = getSession();
    const [showQRCode, setShowQRCode] = useState(false);

    // Customers scan this code at the table and land on the menu.
    const menuUrl = `${window.location.origin}/main-dishes`;

    const logout = () => {
        clearSession();
        navigate('/');
    };

    return (
        <div className="admin-screen">
            <button className="back-button" onClick={logout}>
                Çıkış Yap
            </button>
            <h1>Hoşgeldiniz, {session?.username}!</h1>
            <p>Yönetim paneline hoş geldiniz.</p>

            <div className="button-container">
                <button className="admin-button" onClick={() => navigate('/tables')}>
                    Masaları Getir
                </button>
                <button className="admin-button" onClick={() => navigate('/productmanagement')}>
                    Ürün Yönetimi
                </button>
                <button className="admin-button" onClick={() => navigate('/adminsettings')}>
                    Kullanıcı Yönetimi
                </button>
                <button className="admin-button" onClick={() => setShowQRCode(true)}>
                    QR Code Maker
                </button>
            </div>

            {showQRCode && (
                <div className="qr-code-container">
                    <h3>Bu QR kodu tarayarak menüye gidebilirsiniz:</h3>
                    <QRCodeSVG value={menuUrl} size={200} />
                    <p>{menuUrl}</p>
                </div>
            )}
        </div>
    );
}

export default AdminScreen;
