import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import './Payment.css';

/**
 * Staff screen that closes a table's bill. Card details are NOT collected here:
 * the app doesn't process card payments, so it shouldn't touch card data at all.
 */
function Payment() {
    const { tableId } = useParams();
    const navigate = useNavigate();
    const [table, setTable] = useState(null);
    const [error, setError] = useState("");
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        api.get(`/tables/${tableId}`)
            .then((response) => setTable(response.data))
            .catch((err) => setError(getErrorMessage(err, "Masa bilgisi alınamadı.")));
    }, [tableId]);

    const handlePayment = async () => {
        setPaying(true);
        try {
            const response = await api.post(`/tables/${tableId}/payment`);
            alert(`Ödeme alındı: ${response.data.paidAmount} TL`);
            navigate('/tables');
        } catch (err) {
            alert(getErrorMessage(err, 'Ödeme sırasında bir hata oluştu.'));
        } finally {
            setPaying(false);
        }
    };

    return (
        <div className="payment-container">
            <h1>Ödeme Ekranı</h1>
            <div className="payment-form">
                {error && <p>{error}</p>}
                {table && (
                    <>
                        <h2>{table.name}</h2>
                        <p>Açık sipariş sayısı: {table.openOrders.length}</p>
                        <p><strong>Ödenecek tutar: {table.openBill} TL</strong></p>
                    </>
                )}
                <div className="button-group">
                    <button className="payment-button" onClick={handlePayment} disabled={!table?.isOccupied || paying}>
                        {paying ? 'İşleniyor...' : 'Ödemeyi Al'}
                    </button>
                    <button className="back-button" onClick={() => navigate('/tables')}>
                        Geri Dön
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Payment;
