// File: create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Add your secret key to Netlify env vars
const ALLOWED_ORIGIN = "https://hcj6unazv1.zite.so"; // Zite app origin

export async function handler(event, context) {
  try {
    const { lineItems } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: "https://vetgo-app.netlify.app/success",
      cancel_url: "https://vetgo-app.netlify.app/cancel",
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://hcj6unazv1.zite.so",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: session.id }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://hcj6unazv1.zite.so",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
