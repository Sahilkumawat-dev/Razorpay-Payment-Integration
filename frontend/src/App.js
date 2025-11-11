import React from 'react';
import CheckoutButton from './components/CheckoutButton';
// import QRGenerator from './components/QRGenerator';

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>

      <div style={{ marginTop: 20 }}>
        <CheckoutButton />
      </div>
      {/* <QRGenerator amountInINR={50} vpa={process.env.REACT_APP_MERCHANT_VPA || 'merchant@bank'} name="AK Store" /> */}
    </div>
  );
}
