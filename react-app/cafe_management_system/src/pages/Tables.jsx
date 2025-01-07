import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tables.css';

function Tables() {
    const [tables, setTables] = useState([]);
    const navigate = useNavigate();

    // API'den masaları çek
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/tables'); // API URL'si
                const data = await response.json();
                setTables(data); // Masaları state'e kaydet
            } catch (error) {
                console.error('Masalar alınamadı:', error);
            }
        };
        fetchTables();
    }, []);

    const handleTableClick = (table) => {
        if (table.status === 'empty') {
            alert('Bu masa boş, ödeme ekranına gidemezsiniz.');
            return;
        }
        navigate(`/payment/${table.id}`);
    };

    return (
        <div className="tables-container">
            <h1>Masalar</h1>
            <button
                className="back-button"
                onClick={() => navigate('/adminscreen')}
            >
                Geri Dön
            </button>
            <div className="tables-grid">
                {tables.length > 0 ? (
                    tables.map((table) => (
                        <div
                            key={table.id}
                            className={`table ${table.status === 'full' ? 'full' : 'empty'}`}
                            onClick={() => handleTableClick(table)}
                        >
                            <h2>Masa {table.number}</h2>
                            <p>Hesap: {table.balance} TL</p>
                        </div>
                    ))
                ) : (
                    <p>Masalar yükleniyor...</p>
                )}
            </div>
        </div>
    );
}

export default Tables;
