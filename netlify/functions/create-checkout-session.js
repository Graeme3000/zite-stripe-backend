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