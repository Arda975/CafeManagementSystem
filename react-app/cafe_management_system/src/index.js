// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../src/pages/App.jsx'; // App.jsx dosyanızı import edin

// public/index.html dosyasındaki 'root' id'li div elementini alıyoruz
const rootElement = document.getElementById('root');

// React uygulamamızı root elementine render ediyoruz
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />  {/* Uygulamanızın başlangıç bileşeni */}
  </React.StrictMode>
);
