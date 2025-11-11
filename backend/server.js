require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createInstance, verifyPaymentSignature } = require('./razorpay-util');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!KEY_ID || !KEY_SECRET) {
  console.error('Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
  process.exit(1);
}

const razorpay = createInstance(KEY_ID, KEY_SECRET);

// create order (called from React)
app.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = req.body;

    // amount should be in paise (=> multiply by 100 if sending INR amount)
    const options = {
      amount: amount, // integer (paise). e.g. 50000 for ₹500.00
      currency,
      receipt,
      payment_capture: 1 // auto capture
    };

    const order = await razorpay.orders.create(options);
    return res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// verify payment signature (called from React after success)
app.post('/verify', (req, res) => {
  try {
    const payload = req.body; // expects razorpay_order_id, razorpay_payment_id, razorpay_signature
    const ok = verifyPaymentSignature(payload, KEY_SECRET);
    if (ok) {
      // here you would update DB / fulfill order
      return res.json({ success: true, message: 'Payment verified' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
