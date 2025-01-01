import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tables.css';

function Tables() {
    const [selectedTable, setSelectedTable] = useState(null);
    const tables = [
        { id: 1, number: '1', balance: 50, status: 'full', orders: ['Kahve', 'Tatlı'] },
        { id: 2, number: '2', balance: 0, status: 'empty', orders: [] },
        { id: 3, number: '3', balance: 25, status: 'full', orders: ['Çay', 'Sandviç'] },
        { id: 4, number: '4', balance: 0, status: 'empty', orders: [] },
        { id: 5, number: '5', balance: 100, status: 'full', orders: ['Izgara Tavuk', 'Ayran'] },
        { id: 6, number: '6', balance: 0, status: 'empty', orders: [] },
        { id: 7, number: '7', balance: 40, status: 'full', orders: ['Makarna', 'Soda'] },
        { id: 8, number: '8', balance: 0, status: 'empty', orders: [] },
        { id: 9, number: '9', balance: 75, status: 'full', orders: ['Pizza', 'Kola'] },
        { id: 10, number: '10', balance: 0, status: 'empty', orders: [] },
    ];
    
    const navigate = useNavigate();

    return (
        <div className="tables-page">
            <button className="back-button" onClick={() => navigate('/adminscreen')}>
                ← Geri
            </button>
            <h1>Masalar</h1>
            <div className="tables-container">
                {tables.map((table) => (
                    <div
                        key={table.id}
                        className={`table ${table.status === 'full' ? 'full' : 'empty'}`}
                        onClick={() => setSelectedTable(table)}
                    >
                        Masa {table.number}
                        <br />
                        Bakiye: {table.balance} TL
                    </div>
                ))}
            </div>
            {selectedTable && (
                <div className="table-details">
                    <h2>Masa {selectedTable.number}</h2>
                    <p>Hesap Bakiyesi: {selectedTable.balance} TL</p>
                    <ul>
                        {selectedTable.orders.map((order, index) => (
                            <li key={index}>{order}</li>
                        ))}
                    </ul>
                    <button onClick={() => navigate('/payment')}>Ödeme Yap</button>
                    <button onClick={() => setSelectedTable(null)}>Geri Dön</button>
                </div>
            )}
        </div>
    );
}

export default Tables;
