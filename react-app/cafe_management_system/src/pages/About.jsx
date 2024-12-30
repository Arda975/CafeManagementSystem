import React, { useState, useEffect } from 'react';
import axios from 'axios';
import About from './About.css';

const About = () => {
    const [aboutText, setAboutText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newAboutText, setNewAboutText] = useState('');

    // Veritabanından "Hakkımızda" yazısını al
    useEffect(() => {
        const fetchAboutText = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/about'); // API'den veriyi çekme
                setAboutText(response.data.text);
            } catch (error) {
                console.error('Hakkımızda yazısı alınamadı:', error);
            }
        };

        fetchAboutText();
    }, []);

    // Hakkımızda yazısını güncelle
    const handleUpdate = async () => {
        try {
            await axios.put('http://localhost:5000/api/about', { text: newAboutText }); // API'ye güncelleme isteği
            setAboutText(newAboutText); // Güncellenen yazıyı ekranda göster
            setIsEditing(false); // Düzenleme modunu kapat
        } catch (error) {
            console.error('Hakkımızda yazısı güncellenemedi:', error);
        }
    };

    // Edit moda geçiş
    const handleEdit = () => {
        setIsEditing(true);
        setNewAboutText(aboutText); // Mevcut yazıyı formda göstermek için
    };

    return (
        <div className="about-page">
            <div className="navbar">
                <div className="navbar-left">
                    <span className="cafe-name">Amedim Cafe</span>
                </div>
                <div className="navbar-right">
                    <a href="/" className="nav-link">Ana Sayfa</a>
                    <a href="/about" className="nav-link">Hakkımızda</a>
                </div>
            </div>

            <div className="about-content">
                {isEditing ? (
                    <div className="edit-container">
                        <textarea
                            value={newAboutText}
                            onChange={(e) => setNewAboutText(e.target.value)}
                            rows="10"
                            cols="50"
                        />
                        <button onClick={handleUpdate}>Yazıyı Güncelle</button>
                        <button onClick={() => setIsEditing(false)}>İptal</button>
                    </div>
                ) : (
                    <div className="about-text">
                        <h1>Hakkımızda</h1>
                        <p>{aboutText}</p>
                        <button onClick={handleEdit}>Yazıyı Düzenle</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default About;
