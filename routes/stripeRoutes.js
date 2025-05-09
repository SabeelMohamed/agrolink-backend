// routes/stripeRoutes.js
const express = require("express");
const Stripe = require("stripe");
const router = express.Router();

// Initialize Stripe with the secret key directly for testing
const stripe = Stripe('[REMOVED_STRIPE_KEY]');

router.post("/create-checkout-session", async (req, res) => {
  const { items, buyerDetails } = req.body;

  try {
    // Get the origin from request headers or use default
    const origin = req.get('origin') || 'http://localhost:3000';

    // Map items and handle quantity and price
    const line_items = items.map(item => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(parseFloat(item.price) * 100), // convert to paisa
      },
      quantity: parseInt(item.quantity) || 1, // Ensure quantity is passed, else defaults to 1
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/buyer/dashboard`,
      cancel_url: `${origin}/buyer/dashboard`,
      metadata: {
        buyer_name: buyerDetails?.name || '',
        buyer_address: buyerDetails?.address || '',
        buyer_phone: buyerDetails?.phone || '',
      },
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Stripe Checkout Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
