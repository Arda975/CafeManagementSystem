import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from './TableContext';
import "./Tables.css";

function Tables() {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [orderDetails, setOrderDetails] = useState("");
    const navigate = useNavigate();
    const { setTableId } = useTable();

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch("http://localhost:5000/Cafe_/GetTables");
                const data = await response.json();
                setTables(data);
            } catch (error) {
                console.error("Masalar alınamadı:", error);
            }
        };
        fetchTables();
    }, []);

    const handleTableClick = async (table) => {
        if (table.is_active === false) {
            alert("Bu masa boş, ödeme ekranına gidemezsiniz.");
            return;
        }
        setSelectedTable(table);

        try {
            const response = await fetch(`http://localhost:5000/Cafe_/GetTableDetail?table_id=${table.table_id}`);
            const data = await response.text();
            setOrderDetails(data);
        } catch (error) {
            console.error("Sipariş detayları alınamadı:", error);
        }
    };

    const handleCloseDetails = () => {
        setSelectedTable(null);
        setOrderDetails("");
    };

    const handlePayment = () => {
        setTableId(selectedTable.table_id);
        navigate('/payment');
    };

    return (
        <div className="tables-container">
            <h1>Masalar</h1>
            <button
                className="back-button"
                onClick={() => navigate("/adminscreen")}
            >
                Geri Dön
            </button>
            <div className="tables-grid">
                {tables.length > 0 ? (
                    tables.map((table) => (
                        <div
                            key={table.table_id}
                            className={`table ${table.is_active ? "full" : "empty"}`}
                            onClick={() => handleTableClick(table)}
                        >
                            <h2>Masa {table.table_name}</h2>
                            <p>Hesap: {table.total_bill} TL</p>
                        </div>
                    ))
                ) : (
                    <p>Masalar yükleniyor...</p>
                )}
            </div>

            {selectedTable && (
                <div className="table-details">
                    <div className="details-content">
                        <h2>Masa {selectedTable.table_name}</h2>
                        <p>Hesap: {selectedTable.total_bill} TL</p>
                        <p>Sipariş Özeti: {orderDetails}</p>
                        <button
                            className="send-order-button"
                            onClick={handlePayment}
                        >
                            Siparişi Göster
                        </button>
                        <button
                            className="close-details-button"
                            onClick={handleCloseDetails}
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tables;