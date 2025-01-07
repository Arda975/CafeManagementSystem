import React, { useState, useEffect } from 'react';
import './ProductManagement.css';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '' });
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [isEditingProduct, setIsEditingProduct] = useState(false);

    // Ürünleri API'den çek
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Ürünler yüklenemedi:', error);
            }
        };
        fetchProducts();
    }, []);

    // Ürün ekleme işlemi
    const handleAddProduct = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            if (response.ok) {
                alert('Ürün başarıyla eklendi!');
                setNewProduct({ name: '', description: '', price: '', category: '' });
                setIsAddingProduct(false);
                const updatedProducts = await response.json();
                setProducts(updatedProducts);
            } else {
                throw new Error('Ürün eklenemedi.');
            }
        } catch (error) {
            console.error('Ürün eklenemedi:', error);
        }
    };

    // Ürün güncelleme işlemi
    const handleUpdateProduct = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingProduct),
            });
            if (response.ok) {
                alert('Ürün başarıyla güncellendi!');
                setEditingProduct(null);
                setIsEditingProduct(false);
                const updatedProducts = await response.json();
                setProducts(updatedProducts);
            } else {
                throw new Error('Ürün güncellenemedi.');
            }
        } catch (error) {
            console.error('Ürün güncellenemedi:', error);
        }
    };

    // Ürün silme işlemi
    const handleDeleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Ürün başarıyla silindi!');
                setProducts(products.filter((product) => product.id !== id));
            } else {
                throw new Error('Ürün silinemedi.');
            }
        } catch (error) {
            console.error('Ürün silinemedi:', error);
        }
    };

    return (
        <div className="product-management">
            <button className="back-button" onClick={() => window.location.href = '/adminscreen'}>
                Geri
            </button>
            <h1>Ürün Yönetimi</h1>

            <div className="actions">
                <button onClick={() => setIsAddingProduct(true)}>Ürün Ekle</button>
                <button onClick={() => setIsEditingProduct(true)}>Ürün Bilgisi Güncelle</button>
            </div>

            {isAddingProduct && (
                <div className="product-form">
                    <h2>Yeni Ürün Ekle</h2>
                    <input
                        type="text"
                        placeholder="Ürün Adı"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <textarea
                        placeholder="Ürün Açıklaması"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Fiyat"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Kategori"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    />
                    <button onClick={handleAddProduct}>Kaydet</button>
                    <button onClick={() => setIsAddingProduct(false)}>İptal</button>
                </div>
            )}

            {isEditingProduct && (
                <div className="product-form">
                    <h2>Ürün Güncelle</h2>
                    <select
                        onChange={(e) => {
                            const product = products.find((p) => p.id === parseInt(e.target.value));
                            setEditingProduct(product || null);
                        }}
                    >
                        <option value="">Bir ürün seçin</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    {editingProduct && (
                        <>
                            <input
                                type="text"
                                placeholder="Ürün Adı"
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            />
                            <textarea
                                placeholder="Ürün Açıklaması"
                                value={editingProduct.description}
                                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Fiyat"
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Kategori"
                                value={editingProduct.category}
                                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            />
                            <button onClick={handleUpdateProduct}>Kaydet</button>
                        </>
                    )}
                    <button onClick={() => setIsEditingProduct(false)}>İptal</button>
                </div>
            )}

            <div className="product-list">
                <h2>Ürünler</h2>
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            <span>{product.name}</span>
                            <button onClick={() => handleDeleteProduct(product.id)}>Sil</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ProductManagement;
