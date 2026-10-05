// src/services/razorpay.js
// Thin wrapper around Razorpay REST API.
// Uses axios + Node's built-in crypto for HMAC — no Razorpay SDK needed.
'use strict';

const crypto = require('crypto');
const axios  = require('axios');

const BASE_URL = 'https://api.razorpay.com/v1';

function credentials() {
  return {
    username: process.env.RAZORPAY_KEY_ID,
    password: process.env.RAZORPAY_KEY_SECRET,
  };
}

/**
 * Create a Razorpay order.
 * @param {number} amountINR  Amount in INR (will be converted to paise internally)
 * @param {string} receipt    Unique receipt string for your records
 * @returns {Promise<{ id: string, amount: number, currency: string }>}
 */
async function createOrder(amountINR, receipt) {
  const { data } = await axios.post(
    `${BASE_URL}/orders`,
    {
      amount: amountINR * 100, // Razorpay expects paise
      currency: 'INR',
      receipt,
    },
    { auth: credentials() }
  );
  return data;
}

/**
 * Verify a Razorpay payment signature (CRITICAL — always server-side).
 * See: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration/#verify-payment-signature
 *
 * @param {string} orderId    razorpay_order_id from create-order response
 * @param {string} paymentId  razorpay_payment_id returned by Razorpay Checkout
 * @param {string} signature  razorpay_signature returned by Razorpay Checkout
 * @returns {boolean}
 */
function verifySignature(orderId, paymentId, signature) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expected === signature;
}

/**
 * Fetch a payment's details from Razorpay (for optional server-side double-check).
 * @param {string} paymentId
 */
async function fetchPayment(paymentId) {
  const { data } = await axios.get(`${BASE_URL}/payments/${paymentId}`, {
    auth: credentials(),
  });
  return data;
}

module.exports = { createOrder, verifySignature, fetchPayment };
