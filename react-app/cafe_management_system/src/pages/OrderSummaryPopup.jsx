import React, { useState } from "react";
import { useOrders } from "./OrderContext";
import api, { getErrorMessage } from "../api/client";
import "./OrderPopup.css";

const OrderSummaryPopup = () => {
    const { orders, dispatch } = useOrders();
    const [isOpen, setIsOpen] = useState(false);
    const [tableId, setTableId] = useState("");
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);

    const items = Object.values(orders);
    // Shown to the customer only; the API calculates the real total from database prices.
    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const sendOrder = async () => {
        if (!tableId) {
            setError("Lütfen masa numarası giriniz.");
            return;
        }

        setSending(true);
        try {
            const response = await api.post("/orders", {
                tableId: parseInt(tableId, 10),
                items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
            });

            alert(`Sipariş alındı! Toplam: ${response.data.totalAmount} TL`);
            setError("");
            dispatch({ type: "CLEAR_ORDERS" });
            setIsOpen(false);
        } catch (err) {
            setError(getErrorMessage(err, "Sipariş gönderilirken bir hata oluştu."));
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            {items.length > 0 && (
                <button className="order-button" onClick={() => setIsOpen(!isOpen)}>
                    Siparişimi Göster
                </button>
            )}

            <div className={`order-popup ${isOpen ? "open" : ""}`}>
                <div className="popup-content">
                    <h3>Sipariş Özeti</h3>
                    <div>
                        <label htmlFor="tableId">Masa Numarası:</label>
                        <input
                            type="number"
                            id="tableId"
                            min="1"
                            value={tableId}
                            onChange={(e) => setTableId(e.target.value)}
                            className="table-id-input"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {items.length > 0 ? (
                        <div>
                            {items.map((item) => (
                                <div className="order-item" key={item.productId}>
                                    <p>{item.name} {item.quantity} adet Toplam: {item.price * item.quantity} TL</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Henüz siparişiniz yok.</p>
                    )}
                    <div>Toplam: {totalAmount} TL</div>
                    <button className="send-button" onClick={sendOrder} disabled={sending || items.length === 0}>
                        {sending ? "Gönderiliyor..." : "Siparişi Gönder"}
                    </button>
                    <button className="close-button" onClick={() => setIsOpen(false)}>
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSummaryPopup;
