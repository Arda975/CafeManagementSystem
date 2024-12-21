import React, { useState } from "react";
import { useOrders } from "./OrderContext"; // Global sipariş yönetimini içeri alıyoruz
import "./OrderPopup.css";
import axios from "axios"; // Axios'u içeri alıyoruz

const OrderSummaryPopup = () => {
    const { orders, dispatch } = useOrders(); // Global state'den orders alıyoruz ve dispatch fonksiyonunu alıyoruz
    const [isOpen, setIsOpen] = useState(false); // Pop-up'ın açık olup olmadığını kontrol eden state
    const [tableId, setTableId] = useState(""); // Masa numarasını tutan state
    const [error, setError] = useState(""); // Hata mesajını tutan state

    const togglePopup = () => {
        setIsOpen(!isOpen); // Pop-up'ı açıp kapatmak için state değiştiriyoruz
    };

    const handleTableIdChange = (e) => {
        setTableId(e.target.value); // Masa numarası değişimini yönetiyoruz
    };

    const sendOrder = async () => {
        if (!tableId) {
            setError("Lütfen masa numarası giriniz.");
            return;
        }

        try {
            const orderContent = Object.keys(orders).map(item => `${item} ${orders[item].quantity} adet`).join(", ");
            const totalAmount = Object.keys(orders).reduce((total, item) => total + (orders[item].price * orders[item].quantity), 0);

            const response = await axios.post("http://localhost:5000/Cafe_/InsertOrder", {
                TableId: parseInt(tableId, 10),
                OrderContent: orderContent,
                TotalAmount: totalAmount
            });

            if (response.status === 200) {
                alert("Sipariş başarıyla gönderildi!");
                setError(""); // Hata mesajını temizliyoruz

                // Sipariş başarıyla gönderildikten sonra listeyi temizliyoruz
                dispatch({ type: "CLEAR_ORDERS" });
            }
        } catch (error) {
            console.error("Sipariş gönderme hatası:", error);
            alert("Sipariş gönderilirken bir hata oluştu.");
        }
    };

    // Order listesi render edilmesi
    const orderItems = Object.keys(orders).map((item) => {
        const order = orders[item];
        return (
            <div className="order-item" key={item}>
                <p>{item} {order.quantity} adet Toplam: {order.price * order.quantity} TL</p>
            </div>
        );
    });

    const totalAmount = Object.keys(orders).reduce((total, item) => {
        const order = orders[item];
        return total + (order.price * order.quantity);
    }, 0);

    return (
        <div>
            <button className="order-button" onClick={togglePopup}>
                Siparişimi Göster
            </button>

            <div className={`order-popup ${isOpen ? "open" : ""}`}>
                <div className="popup-content">
                    <h3>Önizleme</h3>
                    <div>
                        <label htmlFor="tableId">Masa Numarası:</label>
                        <input
                            type="number"
                            id="tableId"
                            value={tableId}
                            onChange={handleTableIdChange}
                            className="table-id-input"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {orderItems.length > 0 ? (
                        <div>{orderItems}</div>
                    ) : (
                        <p>Henüz siparişiniz yok.</p>
                    )}
                    <div>
                        Toplam: {totalAmount} TL
                    </div>
                    <button className="send-button" onClick={sendOrder}>
                        Siparişi Gönder
                    </button>
                    <button className="close-button" onClick={togglePopup}>
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSummaryPopup;
