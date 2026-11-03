import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../api/client";
import "./AdminSettings.css";

const ROLES = [
  { value: "Waiter", label: "Garson" },
  { value: "Admin", label: "Admin" },
];

const AdminSettings = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  // Düzenleme
  const [editUser, setEditUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  // Ekleme
  const [addUsername, setAddUsername] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRole, setAddRole] = useState("Waiter");

  // Silme
  const [deleteId, setDeleteId] = useState("");

  const loadUsers = () =>
    api.get("/users")
      .then((response) => setUsers(response.data))
      .catch((err) => alert(getErrorMessage(err, "Kullanıcılar yüklenemedi.")));

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSelectForEdit = (e) => {
    const user = users.find((u) => u.id === Number(e.target.value));
    setEditUser(user ? { ...user } : null);
    setNewPassword(""); // passwords are never sent to the client, only a new one can be set
  };

  const handleUpdate = async () => {
    if (!editUser) {
      alert("Lütfen bir kullanıcı seçin!");
      return;
    }
    try {
      await api.put(`/users/${editUser.id}`, {
        username: editUser.username,
        role: editUser.role,
        password: newPassword || null, // empty = keep the current password
      });
      alert("Kullanıcı başarıyla güncellendi!");
      setEditUser(null);
      setNewPassword("");
      loadUsers();
    } catch (err) {
      alert(getErrorMessage(err, "Güncelleme sırasında bir hata oluştu."));
    }
  };

  const handleAddUser = async () => {
    if (!addUsername || !addPassword) {
      alert("Lütfen gerekli tüm alanları doldurun!");
      return;
    }
    try {
      await api.post("/users", { username: addUsername, password: addPassword, role: addRole });
      alert("Kullanıcı başarıyla eklendi!");
      setAddUsername("");
      setAddPassword("");
      setAddRole("Waiter");
      loadUsers();
    } catch (err) {
      alert(getErrorMessage(err, "Kullanıcı eklenemedi."));
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteId) {
      alert("Lütfen bir kullanıcı seçin!");
      return;
    }
    try {
      await api.delete(`/users/${deleteId}`);
      alert("Kullanıcı başarıyla silindi!");
      setDeleteId("");
      loadUsers();
    } catch (err) {
      alert(getErrorMessage(err, "Kullanıcı silinemedi."));
    }
  };

  const userOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.username} ({user.role === "Admin" ? "Admin" : "Garson"})
    </option>
  ));

  return (
    <div className="admin-settings">
      <button className="back-button" onClick={() => navigate("/adminscreen")}>
        ← Geri
      </button>
      <h2>Kullanıcı Yönetimi</h2>

      {/* Kullanıcı Düzenleme */}
      <div className="section">
        <h3>Kullanıcı Düzenleme</h3>
        <div className="user-select">
          <label htmlFor="user-select">Kullanıcı Seçin:</label>
          <select id="user-select" value={editUser?.id ?? ""} onChange={handleSelectForEdit}>
            <option value="">Seçiniz...</option>
            {userOptions}
          </select>
        </div>
        {editUser && (
          <div className="update-info">
            <div className="input-group">
              <label>Kullanıcı Adı:</label>
              <input type="text" value={editUser.username}
                     onChange={(e) => setEditUser({ ...editUser, username: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Yeni Şifre (boş bırakılırsa değişmez):</label>
              <input type="password" value={newPassword} autoComplete="new-password"
                     onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Rol:</label>
              <select value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <button onClick={handleUpdate}>Güncelle</button>
          </div>
        )}
      </div>

      {/* Kullanıcı Ekleme */}
      <div className="section">
        <h3>Kullanıcı Ekleme</h3>
        <div className="input-group">
          <label>Kullanıcı Adı:</label>
          <input type="text" value={addUsername} onChange={(e) => setAddUsername(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Şifre (en az 6 karakter):</label>
          <input type="password" value={addPassword} autoComplete="new-password"
                 onChange={(e) => setAddPassword(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Rol:</label>
          <select value={addRole} onChange={(e) => setAddRole(e.target.value)}>
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <button onClick={handleAddUser}>Ekle</button>
      </div>

      {/* Kullanıcı Silme */}
      <div className="section">
        <h3>Kullanıcı Silme</h3>
        <div className="user-select">
          <label htmlFor="delete-user-select">Kullanıcı Seçin:</label>
          <select id="delete-user-select" value={deleteId} onChange={(e) => setDeleteId(e.target.value)}>
            <option value="">Seçiniz...</option>
            {userOptions}
          </select>
        </div>
        <button onClick={handleDeleteUser}>Sil</button>
      </div>
    </div>
  );
};

export default AdminSettings;
