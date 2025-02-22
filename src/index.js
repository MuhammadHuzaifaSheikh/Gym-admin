import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "./Css/core.css"
import "./Css/theme-semi-dark.css"
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
// import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
