import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminSettings.css";

const AdminSettings = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Düzenleme için yeni değerler
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Ekleme için alanlar
  const [addUsername, setAddUsername] = useState("");
  const [addPassword, setAddPassword] = useState("");

  useEffect(() => {
    // Kullanıcıları API'den çek
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/Cafe_/GetUsers");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Kullanıcılar yüklenemedi:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserChangeForEdit = (e) => {
    const userId = e.target.value;
    const user = users.find((user) => user.userid === parseInt(userId));
    setSelectedUser(user || null);
    if (user) {
      setNewUsername(user.username);
      setNewPassword(user.password);
    } else {
      setNewUsername("");
      setNewPassword("");
    }
  };

  const handleUserChangeForDelete = (e) => {
    const userId = e.target.value;
    const user = users.find((user) => user.userid === parseInt(userId));
    setSelectedUser(user || null);
  };

  // Kullanıcı güncelle
  const handleUpdate = async () => {
    if (!selectedUser) {
      alert("Lütfen bir kullanıcı seçin!");
      return;
    }

    try {
      // Güncellenmiş veriyi oluştur
      const updatedData = {};
      if (newUsername) updatedData.username = newUsername;
      if (newPassword) updatedData.password = newPassword;

      // API'yi çağır
      const response = await fetch(`http://localhost:5000/Cafe_/UpdateUser?user_id=${selectedUser.userid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("Kullanıcı başarıyla güncellendi!");
        setNewUsername("");
        setNewPassword("");
        setSelectedUser(null);

        // Güncellenmiş kullanıcı listesi
        const updatedUsers = await fetch("http://localhost:5000/Cafe_/GetUsers");
        const data = await updatedUsers.json();
        setUsers(data);
      } else {
        const error = await response.json();
        alert(error.message || "Güncelleme sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri güncellenemedi:", error);
      alert("Kullanıcı bilgileri güncellenemedi.");
    }
  };

  // Kullanıcı ekle
  const handleAddUser = async () => {
    if (!addUsername || !addPassword) {
      alert("Lütfen gerekli tüm alanları doldurun!");
      return;
    }
    try {
      const newUser = { username: addUsername, password: addPassword };

      const response = await fetch("http://localhost:5000/Cafe_/AddUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert("Kullanıcı başarıyla eklendi!");
        setAddUsername("");
        setAddPassword("");
        const updatedUsers = await fetch("http://localhost:5000/Cafe_/GetUsers");
        const data = await updatedUsers.json();
        setUsers(data);
      } else {
        throw new Error("Kullanıcı ekleme sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.error("Kullanıcı eklenemedi:", error);
    }
  };

  // Kullanıcı sil
  const handleDeleteUser = async () => {
    if (!selectedUser) {
      alert("Lütfen bir kullanıcı seçin!");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/Cafe_/DeleteUser?user_id=${selectedUser.userid}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Kullanıcı başarıyla silindi!");
        setSelectedUser(null);
        const updatedUsers = await fetch("http://localhost:5000/Cafe_/GetUsers");
        const data = await updatedUsers.json();
        setUsers(data);
      } else {
        throw new Error("Kullanıcı silme sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.error("Kullanıcı silinemedi:", error);
    }
  };

  return (
      <div className="admin-settings">
        <button className="back-button" onClick={() => navigate("/adminscreen")}>
          ← Geri
        </button>
        <h2>Admin Ayarları</h2>

        {/* Kullanıcı Düzenleme */}
        <div className="section">
          <h3>Kullanıcı Düzenleme</h3>
          <div className="user-select">
            <label htmlFor="user-select">Kullanıcı Seçin:</label>
            <select id="user-select" onChange={handleUserChangeForEdit}>
              <option value="">Seçiniz...</option>
              {users.map((user) => (
                  <option key={user.userid} value={user.userid}>
                    {user.username}
                  </option>
              ))}
            </select>
          </div>
          <div className="update-info">
            <h4>Kullanıcı Adı ve Şifreyi Girin:</h4>
            <div className="input-group">
              <label>Yeni Kullanıcı Adı:</label>
              <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Yeni Şifre:</label>
              <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button onClick={handleUpdate}>Güncelle</button>
          </div>
        </div>

        {/* Kullanıcı Ekleme */}
        <div className="section">
          <h3>Kullanıcı Ekleme</h3>
          <div className="input-group">
            <label>Kullanıcı Adı:</label>
            <input
                type="text"
                value={addUsername}
                onChange={(e) => setAddUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Şifre:</label>
            <input
                type="password"
                value={addPassword}
                onChange={(e) => setAddPassword(e.target.value)}
            />
          </div>
          <button onClick={handleAddUser}>Ekle</button>
        </div>

        {/* Kullanıcı Silme */}
        <div className="section">
          <h3>Kullanıcı Silme</h3>
          <div className="user-select">
            <label htmlFor="delete-user-select">Kullanıcı Seçin:</label>
            <select id="delete-user-select" onChange={handleUserChangeForDelete}>
              <option value="">Seçiniz...</option>
              {users.map((user) => (
                  <option key={user.userid} value={user.userid}>
                    {user.username}
                  </option>
              ))}
            </select>
          </div>
          <button onClick={handleDeleteUser}>Sil</button>
        </div>
      </div>
  );
};

export default AdminSettings;