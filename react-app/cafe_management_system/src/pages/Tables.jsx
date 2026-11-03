import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../api/client";
import { clearSession, getSession, isAdmin } from "../auth/session";
import "./Tables.css";

function Tables() {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const admin = isAdmin(getSession());

    useEffect(() => {
        api.get("/tables")
            .then((response) => setTables(response.data))
            .catch((err) => setError(getErrorMessage(err, "Masalar alınamadı.")));
    }, []);

    const handleTableClick = async (table) => {
        if (!table.isOccupied) {
            alert("Bu masa boş, ödenecek sipariş yok.");
            return;
        }
        try {
            const response = await api.get(`/tables/${table.id}`);
            setSelectedTable(response.data);
        } catch (err) {
            alert(getErrorMessage(err, "Sipariş detayları alınamadı."));
        }
    };

    const handleBack = () => {
        if (admin) {
            navigate("/adminscreen");
        } else {
            clearSession();
            navigate("/");
        }
    };

    // All items of the open orders, merged per product for a short summary.
    const summary = selectedTable
        ? Object.values(
            selectedTable.openOrders.flatMap((o) => o.items).reduce((acc, item) => {
                const prev = acc[item.productId];
                acc[item.productId] = prev
                    ? { ...prev, quantity: prev.quantity + item.quantity, lineTotal: prev.lineTotal + item.lineTotal }
                    : { ...item };
                return acc;
            }, {})
        )
        : [];

    return (
        <div className="tables-container">
            <h1>Masalar</h1>
            <button className="back-button" onClick={handleBack}>
                {admin ? "Geri Dön" : "Çıkış Yap"}
            </button>
            {error && <p>{error}</p>}
            <div className="tables-grid">
                {tables.length > 0 ? (
                    tables.map((table) => (
                        <div
                            key={table.id}
                            className={`table ${table.isOccupied ? "full" : "empty"}`}
                            onClick={() => handleTableClick(table)}
                        >
                            <h2>{table.name}</h2>
                            <p>Hesap: {table.openBill} TL</p>
                        </div>
                    ))
                ) : (
                    !error && <p>Masalar yükleniyor...</p>
                )}
            </div>

            {selectedTable && (
                <div className="table-details">
                    <div className="details-content">
                        <h2>{selectedTable.name}</h2>
                        <p>Hesap: {selectedTable.openBill} TL</p>
                        <div>
                            <strong>Sipariş Özeti:</strong>
                            {summary.map((item) => (
                                <p key={item.productId}>
                                    {item.productName} x{item.quantity} = {item.lineTotal} TL
                                </p>
                            ))}
                        </div>
                        <button className="send-order-button" onClick={() => navigate(`/payment/${selectedTable.id}`)}>
                            Ödemeye Geç
                        </button>
                        <button className="close-details-button" onClick={() => setSelectedTable(null)}>
                            Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tables;
