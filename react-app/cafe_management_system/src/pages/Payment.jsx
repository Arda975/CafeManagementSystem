import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable } from './TableContext';
import './Payment.css';

function Payment() {
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const navigate = useNavigate();
    const { tableId } = useTable();

    const handlePayment = async () => {
        try {
            const response = await fetch(`http://localhost:5000/Cafe_/Payment?table_id=${tableId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                alert('Ödeme tamamlandı!');
                navigate('/tables'); // Kullanıcıyı tables sayfasına yönlendir
            } else {
                alert('Ödeme başarısız oldu!');
            }
        } catch (error) {
            console.error('Ödeme hatası:', error);
            alert('Ödeme sırasında bir hata oluştu.');
        }
    };

    const handleBack = () => {
        navigate(-1); // Kullanıcıyı önceki sayfaya yönlendir
    };

    return (
        <div className="payment-container">
            <h1>Ödeme Ekranı</h1>
            <div className="payment-form">
                <label>
                    Kart Numarası:
                    <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Kart Numarası"
                    />
                </label>
                <label>
                    CVV:
                    <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="CVV"
                    />
                </label>
                <label>
                    Son Kullanma Tarihi:
                    <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                    />
                </label>
                <div className="button-group">
                    <button className="payment-button" onClick={handlePayment}>
                        Ödeme Yap
                    </button>
                    <button className="back-button" onClick={handleBack}>
                        Geri Dön
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Payment;