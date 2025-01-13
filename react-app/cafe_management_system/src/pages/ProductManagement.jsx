import React, { useState, useEffect } from 'react';
import "./ProductManagement.css";
import axios from 'axios';

const ProductManagement = () => {
    const [menu, setMenu] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        description: '',
        imageUrl: null,
        categoryId: ''
    });
    const [updatedItem, setUpdatedItem] = useState({
        name: '',
        price: ''
    });
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/Cafe_/GetProducts')
            .then(response => {
                setMenu(response.data);
            })
            .catch(error => console.error('Menü verileri alınırken bir hata oluştu:', error));

        axios.get('http://localhost:5000/Cafe_/GetCategories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => console.error('Kategori verileri alınırken bir hata oluştu:', error));
    }, []);

    const handleAddItem = () => {
        const formData = new FormData();
        formData.append('name', newItem.name);
        formData.append('price', newItem.price);
        formData.append('description', newItem.description);
        formData.append('image', newItem.imageUrl);
        formData.append('categoryId', newItem.categoryId);

        axios.post('http://localhost:5000/Cafe_/AddProduct', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(response => {
                setMenu([...menu, response.data]);
                setNewItem({
                    name: '',
                    price: '',
                    description: '',
                    imageUrl: null,
                    categoryId: ''
                });
            })
            .catch(error => console.error('Ürün eklenirken bir hata oluştu:', error));
    };

    const handleUpdateItem = () => {
        const updatedProduct = {
            name: updatedItem.name,
            price: updatedItem.price
        };

        axios.put(`http://localhost:5000/Cafe_/UpdateProduct?name=${updatedProduct.name}&price=${updatedProduct.price}`)
            .then(response => {
                setMenu(menu.map(item => item.name === updatedItem.name ? { ...item, price: updatedItem.price } : item));
                setUpdatedItem({
                    name: '',
                    price: ''
                });
            })
            .catch(error => console.error('Ürün güncellenirken bir hata oluştu:', error));
    };

    const handleDeleteItem = () => {
        axios.delete(`http://localhost:5000/Cafe_/DeleteProduct?item_id=${selectedItemId}`)
            .then(() => {
                setMenu(menu.filter(item => item.id !== selectedItemId));
                setSelectedItemId(null);
            })
            .catch(error => console.error('Ürün silinirken bir hata oluştu:', error));
    };

    const handleImageChange = (event) => {
        setNewItem({
            ...newItem,
            imageUrl: event.target.files[0]
        });
    };

    const handleDropdownChange = (event) => {
        const selectedProduct = menu.find(item => item.name === event.target.value);
        setUpdatedItem({
            name: selectedProduct.name,
            price: selectedProduct.price,
            image: selectedProduct.image
        });
    };

    return (
        <div className="container">
            <button onClick={() => window.history.back()} className="back-button">Geri Dön</button>
            <h1>Cafe Menu Management</h1>

            <div>
                <h3>Add New Item</h3>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Product Price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Product Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
                <select
                    value={newItem.categoryId}
                    onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <input
                    type="file"
                    onChange={handleImageChange}
                />
                <button onClick={handleAddItem}>Add Product</button>
            </div>

            <div>
                <h3>Update Product Price</h3>
                <select onChange={handleDropdownChange} value={updatedItem.name}>
                    <option value="">Select Product</option>
                    {menu.map(item => (
                        <option key={item.name} value={item.name}>{item.name}</option>
                    ))}
                </select>
                {updatedItem.image && (
                    <img src={updatedItem.image} alt={updatedItem.name} width={50} height={50} />
                )}
                <input
                    type="number"
                    placeholder="Product Price"
                    value={updatedItem.price}
                    onChange={(e) => setUpdatedItem({ ...updatedItem, price: e.target.value })}
                />
                <button onClick={handleUpdateItem}>Update Price</button>
            </div>

            <div>
                <h3>Delete Product</h3>
                <select onChange={(e) => setSelectedItemId(parseInt(e.target.value))}>
                    <option value="">Select Product to Delete</option>
                    {menu.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
                <button onClick={handleDeleteItem}>Delete Product</button>
            </div>
        </div>
    );
};

export default ProductManagement;