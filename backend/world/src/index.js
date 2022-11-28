import React from 'react';
import ReactDOM from 'react-dom/client';
import {PayPalScriptProvider } from "@paypal/react-paypal-js";
import './index.css';
import App from './App';

import { StoreProvider } from './Store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StoreProvider>
      <PayPalScriptProvider deferLoading={true}>
        <App />
       </PayPalScriptProvider>
    </StoreProvider>
  </React.StrictMode>
);


