// create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Set in Netlify env vars
const ALLOWED_ORIGIN = "https://hcj6unazv1.zite.so"; // Your Zite app origin

export async function handler(event, context) {
  // Handle CORS preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "OK",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      },
      body: "Method Not Allowed",
    };
  }

  try {
    // Parse line items from request body
    const { lineItems } = JSON.parse(event.body);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems, // Example: [{ price: "price_123", quantity: 1 }]
      success_url: "https://vetgo-app.netlify.app/success",
      cancel_url: "https://vetgo-app.netlify.app/cancel",
    });

    // Respond with session ID and CORS headers
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: session.id }),
    };
  } catch (err) {
    // Error response with CORS headers
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
}