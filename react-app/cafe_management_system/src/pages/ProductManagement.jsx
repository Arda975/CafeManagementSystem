import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage, resolveImage } from '../api/client';
import "./ProductManagement.css";

const emptyNewItem = { name: '', price: '', stockQuantity: '', description: '', image: null, categoryId: '' };

const ProductManagement = () => {
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newItem, setNewItem] = useState(emptyNewItem);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [editItem, setEditItem] = useState(null); // full product being edited
    const [deleteId, setDeleteId] = useState('');
    const [message, setMessage] = useState('');

    const loadProducts = () =>
        api.get('/products')
            .then((response) => setMenu(response.data))
            .catch((err) => setMessage(getErrorMessage(err, 'Ürünler alınamadı.')));

    useEffect(() => {
        loadProducts();
        api.get('/categories')
            .then((response) => setCategories(response.data))
            .catch((err) => setMessage(getErrorMessage(err, 'Kategoriler alınamadı.')));
    }, []);

    const handleAddItem = async () => {
        // multipart/form-data because the request can include an image file
        const formData = new FormData();
        formData.append('name', newItem.name);
        formData.append('price', newItem.price || '0');
        formData.append('stockQuantity', newItem.stockQuantity || '0');
        formData.append('description', newItem.description);
        formData.append('categoryId', newItem.categoryId || '0');
        if (newItem.image) formData.append('image', newItem.image);

        try {
            const response = await api.post('/products', formData);
            setMenu([...menu, response.data]);
            setNewItem(emptyNewItem);
            setFileInputKey((k) => k + 1); // reset the file input
            setMessage(`"${response.data.name}" eklendi.`);
        } catch (err) {
            setMessage(getErrorMessage(err, 'Ürün eklenirken bir hata oluştu.'));
        }
    };

    const handleSelectForEdit = (event) => {
        const product = menu.find((item) => item.id === Number(event.target.value));
        setEditItem(product ? { ...product } : null);
    };

    const handleUpdateItem = async () => {
        if (!editItem) return;
        try {
            const response = await api.put(`/products/${editItem.id}`, {
                name: editItem.name,
                description: editItem.description,
                price: Number(editItem.price),
                stockQuantity: Number(editItem.stockQuantity),
                categoryId: editItem.categoryId,
            });
            setMenu(menu.map((item) => (item.id === response.data.id ? response.data : item)));
            setEditItem(null);
            setMessage(`"${response.data.name}" güncellendi.`);
        } catch (err) {
            setMessage(getErrorMessage(err, 'Ürün güncellenirken bir hata oluştu.'));
        }
    };

    const handleDeleteItem = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/products/${deleteId}`);
            setMenu(menu.filter((item) => item.id !== Number(deleteId)));
            setDeleteId('');
            setMessage('Ürün menüden kaldırıldı.');
        } catch (err) {
            setMessage(getErrorMessage(err, 'Ürün silinirken bir hata oluştu.'));
        }
    };

    return (
        <div className="container">
            <button onClick={() => navigate('/adminscreen')} className="back-button">Geri Dön</button>
            <h1>Menü Yönetimi</h1>
            {message && <p>{message}</p>}

            <div>
                <h3>Yeni Ürün Ekle</h3>
                <input type="text" placeholder="Ürün Adı" value={newItem.name}
                       onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                <input type="number" placeholder="Fiyat" min="0" step="0.01" value={newItem.price}
                       onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
                <input type="number" placeholder="Stok" min="0" value={newItem.stockQuantity}
                       onChange={(e) => setNewItem({ ...newItem, stockQuantity: e.target.value })} />
                <input type="text" placeholder="Açıklama" value={newItem.description}
                       onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
                <select value={newItem.categoryId} onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}>
                    <option value="">Kategori Seçin</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <input key={fileInputKey} type="file" accept=".jpg,.jpeg,.png,.webp"
                       onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] || null })} />
                <button onClick={handleAddItem}>Ürün Ekle</button>
            </div>

            <div>
                <h3>Fiyat / Stok Güncelle</h3>
                <select onChange={handleSelectForEdit} value={editItem?.id ?? ''}>
                    <option value="">Ürün Seçin</option>
                    {menu.map((item) => (
                        <option key={item.id} value={item.id}>{item.name} (stok: {item.stockQuantity})</option>
                    ))}
                </select>
                {editItem && (
                    <>
                        <img src={resolveImage(editItem.imagePath)} alt={editItem.name} width={50} height={50} />
                        <input type="number" placeholder="Fiyat" min="0" step="0.01" value={editItem.price}
                               onChange={(e) => setEditItem({ ...editItem, price: e.target.value })} />
                        <input type="number" placeholder="Stok" min="0" value={editItem.stockQuantity}
                               onChange={(e) => setEditItem({ ...editItem, stockQuantity: e.target.value })} />
                        <button onClick={handleUpdateItem}>Güncelle</button>
                    </>
                )}
            </div>

            <div>
                <h3>Ürün Sil</h3>
                <select value={deleteId} onChange={(e) => setDeleteId(e.target.value)}>
                    <option value="">Silinecek Ürünü Seçin</option>
                    {menu.map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
                <button onClick={handleDeleteItem}>Ürünü Sil</button>
            </div>
        </div>
    );
};

export default ProductManagement;
