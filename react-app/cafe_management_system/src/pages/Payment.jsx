import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Payment.css';

function Payment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [table, setTable] = useState(null);

    // Seçilen masayı API'den çek
    useEffect(() => {
        const fetchTable = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/tables/${id}`); // API URL'si
                const data = await response.json();
                setTable(data); // Masayı state'e kaydet
            } catch (error) {
                console.error('Masa bilgisi alınamadı:', error);
            }
        };
        fetchTable();
    }, [id]);

    const handlePayment = () => {
        alert(`Masa ${table.number} için ödeme tamamlandı!`);
        navigate('/tables');
    };

    if (!table) {
        return (
            <div className="payment-container">
                <p>Masa bilgisi yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="payment-container">
            <h1>Masa {table.number} - Ödeme Ekranı</h1>
            <div className="payment-details">
                <h2>Siparişler:</h2>
                <ul>
                    {table.orders.length > 0 ? (
                        table.orders.map((order, index) => (
                            <li key={index}>{order}</li>
                        ))
                    ) : (
                        <li>Hiç sipariş yok.</li>
                    )}
                </ul>
                <h3>Toplam Tutar: {table.balance} TL</h3>
            </div>
            <button className="payment-button" onClick={handlePayment}>
                Ödeme Yap
            </button>
            <button className="back-button" onClick={() => navigate('/tables')}>
                Geri Dön
            </button>
        </div>
    );
}

export default Payment;
