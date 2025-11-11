import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import axios from 'axios';
import './PaymentComponent.css';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentComponent() {
  const [upiAmount, setUpiAmount] = useState(0);
  const [razorAmount, setRazorAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const VPA = process.env.REACT_APP_MERCHANT_VPA;
  const NAME = process.env.REACT_APP_MERCHANT_NAME;
  const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;

  const upiLink = `upi://pay?pa=${encodeURIComponent(VPA)}&pn=${encodeURIComponent(NAME)}&am=${encodeURIComponent(
    Number(upiAmount).toFixed(2)
  )}&cu=INR`;

  async function handleRazorpayPay() {
    if (razorAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    const ok = await loadRazorpayScript();
    if (!ok) {
      alert('Razorpay SDK failed to load.');
      setLoading(false);
      return;
    }

    try {
      const amountPaise = Math.round(razorAmount * 100);

      const createResp = await axios.post('http://localhost:4000/create-order', {
        amount: amountPaise,
        currency: 'INR'
      });

      const { order } = createResp.data;

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: NAME,
        description: 'Payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyResp = await axios.post('http://localhost:4000/verify', response);
            alert(verifyResp.data.success ? 'Payment successful and verified!' : 'Payment verification failed.');
          } catch (err) {
            console.error(err);
            alert('Error verifying payment on server.');
          }
        },
        prefill: { name: NAME },
        theme: { color: '#3399cc' }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        console.error('Payment failed', resp);
        alert('Payment failed: ' + (resp.error?.description || 'Unknown error'));
      });

      rzp.open();
    } catch (err) {
      console.error('Razorpay error:', err);
      alert('Could not initiate Razorpay payment.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h3>Pay via UPI</h3>
        <input
          type="number"
          min="1"
          value={upiAmount === 0 ? '' : upiAmount}
          onChange={(e) => setUpiAmount(Number(e.target.value))}
          placeholder="Enter Amount"
        />
        <QRCode value={upiLink} size={200} className="qr-code" />
        <a href={upiLink} className="upi-link">
          Click to pay via UPI
        </a>
      </div>

      <div className="payment-card">
        <h3>Pay via Razorpay</h3>
        <input
          type="number"
          min="1"
          value={razorAmount === 0 ? '' : razorAmount}
          onChange={(e) => setRazorAmount(Number(e.target.value))}
          placeholder="Enter Amount"
        />
        <button onClick={handleRazorpayPay} disabled={loading} className="pay-btn">
          {loading ? 'Processing...' : `Pay ₹${razorAmount} via Razorpay`}
        </button>
      </div>
    </div>
  );
}
