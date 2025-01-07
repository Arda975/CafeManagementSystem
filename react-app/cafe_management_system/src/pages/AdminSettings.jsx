import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminSettings.css';

const AdminSettings = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [users, setUsers] = useState([]);

  // Kullanıcıları API'den çek
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Kullanıcılar yüklenemedi:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserChange = (e) => {
    const userId = e.target.value;
    const user = users.find((user) => user.id === parseInt(userId));
    setSelectedUser(user || null);
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      alert('Lütfen bir kullanıcı seçin!');
      return;
    }

    try {
      const updatedData = {};
      if (newUsername) updatedData.username = newUsername;
      if (newPassword) updatedData.password = newPassword;

      const response = await fetch(`http://localhost:5000/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Kullanıcı bilgileri başarıyla güncellendi!');
        setNewUsername('');
        setNewPassword('');
        setSelectedUser(null);

        // Kullanıcı listesini güncelle
        const updatedUsers = await response.json();
        setUsers(updatedUsers);
      } else {
        throw new Error('Güncelleme sırasında bir hata oluştu.');
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri güncellenemedi:', error);
    }
  };

  return (
    <div className="admin-settings">
      <button className="back-button" onClick={() => navigate('/adminscreen')}>
        ← Geri
      </button>
      <h2>Admin Ayarları</h2>
      <div className="user-select">
        <label htmlFor="user-select">Kullanıcı Seçin:</label>
        <select id="user-select" onChange={handleUserChange}>
          <option value="">Seçiniz...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <div className="update-info">
          <h3>{selectedUser.username} için yeni bilgileri girin:</h3>
          <div className="input-group">
            <label htmlFor="username">Yeni Kullanıcı Adı:</label>
            <input
              type="text"
              id="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Yeni Şifre:</label>
            <input
              type="password"
              id="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button onClick={handleSubmit}>Güncelle</button>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
