import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: data.priceId, quantity: 1 }],
      success_url: "https://your-zite-app.zite.xyz/success",
      cancel_url: "https://your-zite-app.zite.xyz/cancel",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.message };
  }
}

const response = await fetch(
  "https://vetgo-app.netlify.app/.netlify/functions/create-checkout-session",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lineItems: [{ price: "price_123", quantity: 1 }],
    }),
  }
);

const data = await response.json();
const sessionId = data.id;
