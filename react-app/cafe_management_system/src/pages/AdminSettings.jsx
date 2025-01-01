import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigate hook'unu import edin
import './AdminSettings.css';

const AdminSettings = () => {
  const navigate = useNavigate();  // useNavigate'i kullanarak navigate fonksiyonunu alıyoruz
  const [selectedUser, setSelectedUser] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [users, setUsers] = useState([
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
    { id: 3, username: 'user3', password: 'password3' }
  ]);

  const handleUserChange = (e) => {
    const userId = e.target.value;
    const user = users.find((user) => user.id === parseInt(userId));
    setSelectedUser(user ? user.username : '');
  };

  const handleSubmit = () => {
    if (!selectedUser) {
      alert('Lütfen bir kullanıcı seçin!');
      return;
    }
    
    if (newUsername) {
      const updatedUsers = users.map(user =>
        user.username === selectedUser ? { ...user, username: newUsername } : user
      );
      setUsers(updatedUsers);
    }

    if (newPassword) {
      const updatedUsers = users.map(user =>
        user.username === selectedUser ? { ...user, password: newPassword } : user
      );
      setUsers(updatedUsers);
    }

    alert('Kullanıcı bilgileri başarıyla güncellendi!');
    setNewUsername('');
    setNewPassword('');
    setSelectedUser('');
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
          <h3>{selectedUser} için yeni bilgileri girin:</h3>
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
