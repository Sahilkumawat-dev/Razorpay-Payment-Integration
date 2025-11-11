const Razorpay = require('razorpay');
const crypto = require('crypto');

function createInstance(key_id, key_secret) {
  return new Razorpay({ key_id, key_secret });
}

function verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }, key_secret) {
  const generated_signature = crypto.createHmac('sha256', key_secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  return generated_signature === razorpay_signature;
}

module.exports = { createInstance, verifyPaymentSignature };
