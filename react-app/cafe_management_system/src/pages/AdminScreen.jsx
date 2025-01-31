import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminScreen.css';
import { QRCodeSVG } from 'qrcode.react'; // QRCodeSVG bileşenini doğru şekilde import ettik

function AdminScreen() {
    const adminName = "Admin";
    const navigate = useNavigate();
    const [showQRCode, setShowQRCode] = useState(false); // QR kodunun gösterilip gösterilmeyeceğini kontrol etmek için state kullandık

    const url = "http://..../"; // QR kodu için URL

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
                <button className="admin-button" onClick={() => setShowQRCode(true)}>
                    QR Code Maker
                </button>
            </div>

            {showQRCode && (
                <div className="qr-code-container">
                    <h3>Bu QR kodu tarayarak ilgili sayfaya gidebilirsiniz:</h3>
                    <QRCodeSVG value={url} size={200} /> {/* QR kodunu ekrana render ediyoruz */}
                </div>
            )}
        </div>
    );
}

export default AdminScreen;
