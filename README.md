
#Full Setep avelable on our drive:https://drive.google.com/drive/folders/11Y7jWA1ILcUrm4I50UXXwVVRvTlj8UeT?usp=sharing

Step-by-Step Explanation
Step 1: Razorpay Account Setup

Go to https://razorpay.com

Sign up or log in.

Go to Dashboard → Settings → API Keys

Click Generate Key → You’ll get:

Key ID

Key Secret

These two are very important (keep them secret).
You’ll use them in your backend (Node.js).

SharkCoders Comment:
“Bro, Razorpay key ID and secret are like your ATM PIN. Never expose them in frontend code!”

Step 2: Backend Setup (Node.js)

You’ll create a server that talks to Razorpay securely.

Initialize Node.js app
(npm init -y)

Install dependencies:

express (for API routes)

razorpay (official Razorpay SDK)

dotenv (to hide keys)

Create .env file → store your keys safely:

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret


In your server code:

Create an API route like /create-order

Use Razorpay SDK to create an order (order = payment session)

Return order details (like amount, currency, order_id) to frontend

SharkCoders Comment:
“Backend is the bridge between your React app and Razorpay. Never call Razorpay secret key directly from frontend!”

Step 3: Frontend Setup (React)

Now in React, you’ll:

Create a button like “Pay Now”.

When clicked → call backend API /create-order
→ get order details.

Load Razorpay Checkout script:
Razorpay gives a popup interface for payment.

Initialize Razorpay checkout with:

Key ID (from dashboard)

Order ID (from backend)

Amount, Currency

Callback function (what to do after success/failure)

SharkCoders Comment:
“The frontend only handles the user interface and calls Razorpay checkout. Backend handles the money part!”

Step 4: Verify Payment

After payment success:

Razorpay sends back details like:

payment_id

order_id

signature

Send these details to your backend again.

Backend will verify signature using Razorpay’s method.
(This ensures the payment is genuine.)

SharkCoders Comment:
“Always verify payment from backend! Fake confirmations can happen from frontend.”

Step 5: Save Data

After successful verification:

Save the order/payment info in your database (MongoDB, MySQL, etc.)

Then update your UI or redirect user to a success page.

SharkCoders Comment:
“Always store transactions — you’ll need them for refunds, support, or analytics!”

Output: 
1. <img width="960" height="540" alt="Code Structure like that" src="https://github.com/user-attachments/assets/446921f0-f74f-430f-b22f-df19ad2d60ca" />
2. <img width="904" height="507" alt="output 1" src="https://github.com/user-attachments/assets/61c4a9e9-c9a1-4840-9416-50a16d2954d8" />\
3. <img width="903" height="505" alt="output 2" src="https://github.com/user-attachments/assets/9edbaf56-b056-4db6-be38-65d6e3b7a137" />
4. <img width="901" height="505" alt="output 3" src="https://github.com/user-attachments/assets/6243dba2-9a4e-40be-bf1a-5c9021c5d662" />


