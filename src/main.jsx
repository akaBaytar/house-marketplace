import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';

import './style/index.css';

ReactDOM.createRoot(document.querySelector('#root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
